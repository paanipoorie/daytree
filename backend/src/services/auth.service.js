const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { generateToken } = require('../utils/jwt');
const emailService = require('./email.service');
const { OAuth2Client } = require('google-auth-library');
const env = require('../config/env');

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

/**
 * Generate a secure 6-digit OTP
 * @returns {string}
 */
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Verify Google ID Token
 * @param {string} idToken 
 * @returns {Promise<Object>} Google user payload
 */
const verifyGoogleToken = async (idToken) => {
  // Support mock token for test/dev environment when credentials are not configured
  if ((env.NODE_ENV === 'test' || env.NODE_ENV === 'development') && idToken && idToken.startsWith('mock-')) {
    return {
      email: 'googleuser@example.com',
      email_verified: true,
      name: 'Google User',
      picture: 'https://example.com/picture.png',
      sub: 'google-oauth2|1234567890',
    };
  }

  if (!env.GOOGLE_CLIENT_ID) {
    throw new Error('Google Client ID is not configured');
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    console.error('Google verification error:', error.message);
    throw new Error('Invalid Google token');
  }
};

/**
 * Hash OTP code using SHA-256 for fast security comparison
 * @param {string} otp 
 * @returns {string} Hashed OTP
 */
const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Send / generate OTP with rate limiting checks
 * @param {Object} user 
 */
const sendOtpHelper = async (user) => {
  const now = new Date();
  
  // Rate limit: Max 3 OTP sends per 10 minutes per email
  if (user.otpLastSentAt && (now - user.otpLastSentAt) < 10 * 60 * 1000) {
    if (user.otpSentCount >= 3) {
      throw new Error('Too many verification codes sent. Please try again after 10 minutes.');
    }
    user.otpSentCount += 1;
  } else {
    user.otpSentCount = 1;
  }
  user.otpLastSentAt = now;
  
  // Generate new OTP
  const otp = generateOtp();
  const hashedOtp = hashOtp(otp);
  
  user.otpHash = hashedOtp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  user.otpAttemptsCount = 0; // Reset verification attempts
  
  await user.save();
  
  // Send email using Resend
  await emailService.sendOtpEmail(user.email, otp);
};

/**
 * Register a new user
 * @param {Object} userData - email, password, username
 * @returns {Object} User and Token details
 */
const signup = async ({ email, password, username }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email is already registered');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user (unverified by default)
  const defaultUsername = username || email.split('@')[0];
  const user = await User.create({
    email,
    passwordHash,
    username: defaultUsername,
    isVerified: false,
  });

  // Send OTP
  try {
    await sendOtpHelper(user);
  } catch (error) {
    // Clean up created user if sending initial OTP fails so they can retry
    await User.deleteOne({ _id: user._id });
    throw error;
  }

  // Generate token
  const token = generateToken({ id: user._id });

  // Format user output
  const userResponse = {
    id: user._id,
    email: user.email,
    username: user.username,
    profilePicture: user.profilePicture,
    isOnboarded: user.isOnboarded,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };

  return {
    user: userResponse,
    token,
  };
};

/**
 * Log in an existing user
 * @param {Object} credentials - email, password
 * @returns {Object} User and Token details
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.passwordHash) {
    throw new Error('This account uses Google Sign-In. Please login with Google.');
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Prevent login if email is not verified
  if (!user.isVerified) {
    throw new Error('Please verify your email first');
  }

  // Generate token
  const token = generateToken({ id: user._id });

  const userResponse = {
    id: user._id,
    email: user.email,
    username: user.username,
    profilePicture: user.profilePicture,
    isOnboarded: user.isOnboarded,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };

  return {
    user: userResponse,
    token,
  };
};

/**
 * Send/generate new OTP for verification
 * @param {string} email 
 */
const sendOtp = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (user.isVerified) {
    throw new Error('Email is already verified');
  }

  await sendOtpHelper(user);
  return { success: true };
};

/**
 * Resend OTP (alias to sendOtp with custom semantics)
 * @param {string} email 
 */
const resendOtp = async (email) => {
  return sendOtp(email);
};

/**
 * Verify OTP code
 * @param {Object} params - email, otp
 * @returns {Object} User and Token details
 */
const verifyOtp = async ({ email, otp }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (user.isVerified) {
    // If already verified, generate a token and log in directly
    const token = generateToken({ id: user._id });
    return {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        isOnboarded: user.isOnboarded,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  // Check if user has an active OTP
  if (!user.otpHash || !user.otpExpiry) {
    throw new Error('Invalid verification code');
  }

  // Check OTP expiry
  if (user.otpExpiry < new Date()) {
    throw new Error('Verification code has expired');
  }

  // Increment verification attempts
  user.otpAttemptsCount += 1;

  // Hash provided OTP for comparison
  const hashedProvidedOtp = hashOtp(otp);

  if (user.otpHash !== hashedProvidedOtp) {
    // If attempts reach 5, invalidate the OTP
    if (user.otpAttemptsCount >= 5) {
      user.otpHash = null;
      user.otpExpiry = null;
      user.otpAttemptsCount = 0;
      await user.save();
      throw new Error('Too many incorrect attempts. Please request a new verification code.');
    }
    await user.save();
    throw new Error('Invalid verification code');
  }

  // Set verified, clear OTP and rate limits
  user.isVerified = true;
  user.otpHash = null;
  user.otpExpiry = null;
  user.otpAttemptsCount = 0;
  user.otpSentCount = 0;
  user.otpLastSentAt = null;
  await user.save();

  const token = generateToken({ id: user._id });

  return {
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      isOnboarded: user.isOnboarded,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * Handle Google Sign-in / Sign-up
 * @param {string} idToken 
 * @returns {Object} User and Token details
 */
const googleLogin = async (idToken) => {
  const payload = await verifyGoogleToken(idToken);
  if (!payload || !payload.email) {
    throw new Error('Google authentication failed');
  }

  const { email, name, picture } = payload;

  let user = await User.findOne({ email });

  if (user) {
    // Make sure user is verified since Google has verified their email
    let updated = false;
    if (!user.isVerified) {
      user.isVerified = true;
      updated = true;
    }
    // Update profile picture if user doesn't have one
    if (picture && (!user.profilePicture || !user.profilePicture.url)) {
      user.profilePicture = { url: picture, publicId: '' };
      updated = true;
    }
    if (updated) {
      await user.save();
    }
  } else {
    // First login - Create user
    const defaultUsername = name || email.split('@')[0];
    user = await User.create({
      email,
      username: defaultUsername,
      profilePicture: {
        url: picture || '',
        publicId: '',
      },
      isVerified: true,
      isOnboarded: false,
    });
  }

  const token = generateToken({ id: user._id });

  const userResponse = {
    id: user._id,
    email: user.email,
    username: user.username,
    profilePicture: user.profilePicture,
    isOnboarded: user.isOnboarded,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };

  return {
    user: userResponse,
    token,
  };
};

module.exports = {
  signup,
  login,
  sendOtp,
  resendOtp,
  verifyOtp,
  googleLogin,
};
