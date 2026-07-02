const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

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

  // Create user
  const defaultUsername = username || email.split('@')[0];
  const user = await User.create({
    email,
    passwordHash,
    username: defaultUsername,
  });

  // Generate token
  const token = generateToken({ id: user._id });

  // Format user output (exclude passwordHash)
  const userResponse = {
    id: user._id,
    email: user.email,
    username: user.username,
    profilePicture: user.profilePicture,
    isOnboarded: user.isOnboarded,
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

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken({ id: user._id });

  const userResponse = {
    id: user._id,
    email: user.email,
    username: user.username,
    profilePicture: user.profilePicture,
    isOnboarded: user.isOnboarded,
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
};
