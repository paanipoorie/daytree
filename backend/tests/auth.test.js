process.env.NODE_ENV = 'test';
process.env.RESEND_API_KEY = 'mock-key';
process.env.EMAIL_FROM = 'DayTree <noreply@yourdomain.com>';

global.lastSentOtp = null;

// Mock Resend SDK
jest.mock('resend', () => {
  const mockSend = jest.fn().mockImplementation(async (options) => {
    if (options.to && options.to.includes('fail')) {
      return { data: null, error: { message: 'Resend API failed' } };
    }
    const match = options.html ? options.html.match(/>\s*(\d{6})\s*</) : null;
    if (match) {
      global.lastSentOtp = match[1];
    }
    return { data: { id: 'mock-email-id' }, error: null };
  });

  global.mockSendFn = mockSend;

  return {
    Resend: jest.fn().mockImplementation(() => {
      return {
        emails: {
          send: mockSend,
        },
      };
    }),
  };
});

// Mock Cloudinary SDK
jest.mock('../src/config/cloudinary', () => {
  return {
    uploader: {
      upload_stream: jest.fn().mockImplementation((options, callback) => {
        const { Writable } = require('stream');
        const mockStream = new Writable({
          write(chunk, encoding, next) {
            next();
          },
          final(next) {
            callback(null, {
              secure_url: 'https://res.cloudinary.com/mock-cloud/image/upload/v12345/daytree_profiles/mock.png',
              public_id: 'daytree_profiles/mock',
            });
            next();
          }
        });
        return mockStream;
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  };
});

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const crypto = require('crypto');

describe('Auth API Integration Tests', () => {
  beforeAll(async () => {
    const testUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/daytree_test';
    await mongoose.connect(testUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    global.mockSendFn.mockClear();
    global.lastSentOtp = null;
  });

  describe('POST /api/v1/auth/signup', () => {
    it('successfully registers a user and hashes the OTP', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          username: 'newuser',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('newuser@example.com');
      
      const user = await User.findOne({ email: 'newuser@example.com' });
      expect(user.otpHash).toBeDefined();
      expect(user.otpHash).not.toBeNull();
      // Verify that it is hashed (not plaintext)
      expect(user.otpHash).not.toBe(global.lastSentOtp);
      
      const expectedHash = crypto.createHash('sha256').update(global.lastSentOtp).digest('hex');
      expect(user.otpHash).toBe(expectedHash);
    });

    it('fails signup and rolls back user creation if Resend fails', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'fail@example.com',
          password: 'password123',
          username: 'failuser',
        });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);

      // Verify user was rolled back/deleted
      const user = await User.findOne({ email: 'fail@example.com' });
      expect(user).toBeNull();
    });

    it('fails if the email is already registered', async () => {
      await User.create({
        email: 'existing@example.com',
        passwordHash: 'hashedpassword',
        username: 'existing',
        isVerified: true,
      });

      const res = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'existing@example.com',
          password: 'password123',
          username: 'different',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('fails if schema validation fails', async () => {
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'invalid-email',
          password: '123', // less than 6 chars
          username: 'a', // less than 2 chars
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create user using actual signup process or service helper to encrypt password
      await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'user@example.com',
          password: 'password123',
          username: 'user',
        });
      // Mark as verified for login test
      await User.updateOne({ email: 'user@example.com' }, { isVerified: true });
    });

    it('successfully logs in with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('user@example.com');
    });

    it('fails to log in with invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('fails to log in if email is not verified', async () => {
      // Create an unverified user
      await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'unverified@example.com',
          password: 'password123',
          username: 'unverified',
        });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'unverified@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Please verify your email first');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let token;

    beforeEach(async () => {
      const signupRes = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'user@example.com',
          password: 'password123',
          username: 'user',
        });
      token = signupRes.body.data.token;
      // Mark as verified for protected endpoint access
      await User.updateOne({ email: 'user@example.com' }, { isVerified: true });
    });

    it('returns user details for authenticated requests', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('user@example.com');
    });

    it('returns 401 if token is missing', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('OTP Verification System', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'otpuser@example.com',
          password: 'password123',
          username: 'otpuser',
        });
    });

    it('successfully sends OTP', async () => {
      global.mockSendFn.mockClear();
      const res = await request(app)
        .post('/api/v1/auth/send-otp')
        .send({ email: 'otpuser@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Verification code sent successfully');
      
      expect(global.mockSendFn).toHaveBeenCalled();
      expect(global.lastSentOtp).toBeDefined();
      expect(global.lastSentOtp.length).toBe(6);
    });

    it('successfully verifies user with valid OTP and renders OTP single-use', async () => {
      const validOtp = global.lastSentOtp;

      const res = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({
          email: 'otpuser@example.com',
          otp: validOtp,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.isVerified).toBe(true);

      const userAfter = await User.findOne({ email: 'otpuser@example.com' });
      expect(userAfter.isVerified).toBe(true);
      expect(userAfter.otpHash).toBeNull();
      expect(userAfter.otpExpiry).toBeNull();
    });

    it('fails to verify if OTP is incorrect', async () => {
      const res = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({
          email: 'otpuser@example.com',
          otp: '000000',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid verification code');
    });

    it('fails to verify if OTP is expired', async () => {
      // Mock OTP expiry to the past
      await User.updateOne(
        { email: 'otpuser@example.com' },
        { otpExpiry: new Date(Date.now() - 1000) }
      );

      const res = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({
          email: 'otpuser@example.com',
          otp: global.lastSentOtp,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Verification code has expired');
    });

    it('successfully resends OTP', async () => {
      const oldOtp = global.lastSentOtp;

      const res = await request(app)
        .post('/api/v1/auth/resend-otp')
        .send({ email: 'otpuser@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      expect(global.lastSentOtp).toBeDefined();
      expect(global.lastSentOtp).not.toBe(oldOtp);
    });

    it('enforces rate limit of max 3 OTP sends per 10 minutes', async () => {
      // Signup was 1st send
      // 2nd send
      const res2 = await request(app)
        .post('/api/v1/auth/send-otp')
        .send({ email: 'otpuser@example.com' });
      expect(res2.status).toBe(200);

      // 3rd send
      const res3 = await request(app)
        .post('/api/v1/auth/send-otp')
        .send({ email: 'otpuser@example.com' });
      expect(res3.status).toBe(200);

      // 4th send should fail
      const res4 = await request(app)
        .post('/api/v1/auth/send-otp')
        .send({ email: 'otpuser@example.com' });
      expect(res4.status).toBe(500);
      expect(res4.body.message).toBe('Too many verification codes sent. Please try again after 10 minutes.');
    });

    it('enforces limit of max 5 verification attempts before invalidation', async () => {
      // Send 4 incorrect attempts
      for (let i = 0; i < 4; i++) {
        const res = await request(app)
          .post('/api/v1/auth/verify-otp')
          .send({ email: 'otpuser@example.com', otp: '000000' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid verification code');
      }

      // 5th attempt invalidates OTP
      const res5 = await request(app)
          .post('/api/v1/auth/verify-otp')
          .send({ email: 'otpuser@example.com', otp: '000000' });
      expect(res5.status).toBe(400);
      expect(res5.body.message).toBe('Too many incorrect attempts. Please request a new verification code.');

      // Subsequent attempt with previously valid OTP fails
      const res6 = await request(app)
          .post('/api/v1/auth/verify-otp')
          .send({ email: 'otpuser@example.com', otp: global.lastSentOtp });
      expect(res6.status).toBe(400);
      expect(res6.body.message).toBe('Invalid verification code');
    });

    it('returns standard token if trying to verify an already verified email (duplicate verification)', async () => {
      const validOtp = global.lastSentOtp;

      // 1st verify (success)
      const res1 = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ email: 'otpuser@example.com', otp: validOtp });
      expect(res1.status).toBe(200);

      // 2nd verify (returns logged in details)
      const res2 = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({ email: 'otpuser@example.com', otp: validOtp });
      expect(res2.status).toBe(200);
      expect(res2.body.data.token).toBeDefined();
    });
  });

  describe('Google OAuth Login', () => {
    it('creates a new user on first login with Google mock token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/google')
        .send({ token: 'mock-google-token' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('googleuser@example.com');
      expect(res.body.data.user.isVerified).toBe(true);

      const user = await User.findOne({ email: 'googleuser@example.com' });
      expect(user).toBeDefined();
      expect(user.username).toBe('Google User');
      expect(user.passwordHash).toBeUndefined();
    });

    it('logs in an existing user on Google login', async () => {
      // Pre-create user (signed up normally first, then logging in with Google)
      await User.create({
        email: 'googleuser@example.com',
        username: 'Existing User',
        passwordHash: 'hashedpassword',
        isVerified: false,
      });

      const res = await request(app)
        .post('/api/v1/auth/google')
        .send({ token: 'mock-google-token' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.isVerified).toBe(true);

      const user = await User.findOne({ email: 'googleuser@example.com' });
      expect(user.isVerified).toBe(true);
      expect(user.profilePicture.url).toBe('https://example.com/picture.png');
    });
  });

  describe('Full Profile Setup and Onboarding Flow', () => {
    let token;
    let email = 'onboarduser@example.com';

    beforeEach(async () => {
      // 1. Signup
      await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email,
          password: 'password123',
          username: 'onboarduser',
        });

      // 2. Verify OTP to activate account
      const validOtp = global.lastSentOtp;
      const verifyRes = await request(app)
        .post('/api/v1/auth/verify-otp')
        .send({
          email,
          otp: validOtp,
        });
      token = verifyRes.body.data.token;
    });

    it('allows a verified user to complete profile setup with a new username and profile picture', async () => {
      // Create a dummy image buffer to upload
      const dummyBuffer = Buffer.from('fake-image-content');

      const res = await request(app)
        .post('/api/v1/users/setup-profile')
        .set('Authorization', `Bearer ${token}`)
        .attach('profilePicture', dummyBuffer, 'avatar.png')
        .field('username', 'new_username');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe('new_username');
      expect(res.body.data.user.profilePicture.url).toBeDefined();
      expect(res.body.data.user.isOnboarded).toBe(true);
      expect(res.body.data.user.isVerified).toBe(true);

      // Verify it's updated in database
      const dbUser = await User.findOne({ email });
      expect(dbUser.username).toBe('new_username');
      expect(dbUser.profilePicture.url).toBeDefined();
      expect(dbUser.isOnboarded).toBe(true);

      // Verify GET /auth/me returns the updated user (auth restore / page refresh)
      const meRes = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(meRes.status).toBe(200);
      expect(meRes.body.success).toBe(true);
      expect(meRes.body.data.user.username).toBe('new_username');
      expect(meRes.body.data.user.profilePicture.url).toBe(res.body.data.user.profilePicture.url);
      expect(meRes.body.data.user.isOnboarded).toBe(true);
      expect(meRes.body.data.user.isVerified).toBe(true);
    });
  });
});
