const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

process.env.NODE_ENV = 'test';

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
  });

  describe('POST /api/v1/auth/signup', () => {
    it('successfully registers a user with valid details', async () => {
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
      expect(res.body.data.user.username).toBe('newuser');
    });

    it('fails if the email is already registered', async () => {
      await User.create({
        email: 'existing@example.com',
        passwordHash: 'hashedpassword',
        username: 'existing',
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
});
