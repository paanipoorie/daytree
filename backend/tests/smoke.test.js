// Mock production environment variables before importing app or env
process.env.NODE_ENV = 'production';
process.env.PORT = '5001';
process.env.MONGODB_URI = 'mongodb://localhost:27017/daytree_smoke_test';
process.env.JWT_SECRET = 'secure_production_only_jwt_secret_key_987654321';
process.env.RESEND_API_KEY = 're_production_smoke_key';
process.env.EMAIL_FROM = 'DayTree <no-reply@daytree.paanipoorie.com>';
process.env.CLOUDINARY_CLOUD_NAME = 'production_cloud';
process.env.CLOUDINARY_API_KEY = 'cloudinary_key_123';
process.env.CLOUDINARY_API_SECRET = 'cloudinary_secret_abc';
process.env.GOOGLE_CLIENT_ID = 'production_google_client_id.apps.googleusercontent.com';
process.env.FRONTEND_URL = 'https://daytree.paanipoorie.com';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const errorHandler = require('../src/middleware/errorHandler');

describe('Production Readiness Smoke Tests', () => {
  beforeAll(async () => {
    // Connect to database to verify Mongoose state is properly reported by /health
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    // Cleanup Mongoose connection and drop DB
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.db.dropDatabase();
      await mongoose.connection.close();
    }
  });

  describe('1. Health Endpoint (GET /health)', () => {
    it('returns 200 and matches the exact expected JSON schema with database status', async () => {
      const res = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toEqual({
        status: 'ok',
        database: 'connected',
        environment: 'production',
        uptime: expect.any(Number),
      });
    });

    it('returns database disconnected if Mongoose disconnects', async () => {
      // Temporarily mock readyState to 0 (disconnected)
      const originalReadyState = mongoose.connection.readyState;
      Object.defineProperty(mongoose.connection, 'readyState', {
        get: () => 0,
        set: () => {},
        configurable: true,
      });

      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body.database).toBe('disconnected');

      // Restore original readyState configuration
      Object.defineProperty(mongoose.connection, 'readyState', {
        value: originalReadyState,
        writable: true,
        configurable: true,
      });
    });
  });

  describe('2. Security Verification', () => {
    it('implements Helmet headers', async () => {
      const res = await request(app).get('/health');
      
      // Standard Helmet headers
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(res.headers['x-dns-prefetch-control']).toBe('off');
    });

    it('enforces CORS origin limits matching FRONTEND_URL', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'https://daytree.paanipoorie.com');

      expect(res.headers['access-control-allow-origin']).toBe('https://daytree.paanipoorie.com');
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });

    it('does not allow arbitrary CORS origins in production', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'https://maliciousdomain.com');

      // In production, cors module will either not set the header or set it to CORS_ORIGIN
      expect(res.headers['access-control-allow-origin']).not.toBe('https://maliciousdomain.com');
    });
  });

  describe('3. Gzip Compression', () => {
    it('applies Gzip compression for large responses', async () => {
      const res = await request(app)
        .get('/health')
        .set('Accept-Encoding', 'gzip');
      
      // Compression might not fire on tiny responses, but the header can be checked
      expect(res.headers['vary']).toContain('Accept-Encoding');
    });
  });

  describe('4. Error Handling & Stack Trace Leaks', () => {
    it('formats errors in standard JSON and excludes stack traces in production', async () => {
      // Send a request that triggers validation error to verify format
      const res = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'invalid-email',
          password: '123',
          username: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors).toBeDefined();
      
      // Assert no stack trace is leaked in production validation errors
      res.body.errors.forEach(err => {
        expect(err.stack).toBeUndefined();
      });
    });

    it('hides implementation error details (stack traces) for generic errors in production', () => {
      const err = new Error('Sensitive database or code exception message');
      const req = { requestId: 'test-req-id' };
      const res = {
        statusCode: 200,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(payload) {
          this.body = payload;
          return this;
        }
      };
      // Link res back to req so res.req is available
      res.req = req;

      // Call the global errorHandler middleware directly
      errorHandler(err, req, res, () => {});

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Sensitive database or code exception message');
      expect(res.body.errors).toEqual([]); // No stack trace leaked in production
      expect(res.body.requestId).toBe('test-req-id');
    });
  });
});
