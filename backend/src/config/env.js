const dotenv = require('dotenv');
const path = require('path');

// Helper function to clean process.env keys and values (trim leading/trailing spaces/carriage returns)
const cleanEnvKeys = () => {
  Object.keys(process.env).forEach((key) => {
    const trimmedKey = key.trim();
    const value = process.env[key];
    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      if (trimmedKey !== key || trimmedValue !== value) {
        if (trimmedKey !== key) {
          delete process.env[key];
        }
        process.env[trimmedKey] = trimmedValue;
      }
    }
  });
};

// First pass: clean OS environment variables
cleanEnvKeys();

// Load environment variables from .env file ONLY in non-production environments
let dotenvResult = { parsed: {} };
if (process.env.NODE_ENV !== 'production') {
  dotenvResult = dotenv.config({ path: path.join(__dirname, '../../.env') });
  // Second pass: clean any variables loaded from .env
  cleanEnvKeys();
}

console.log('[ENV DEBUG] Environment variables parsed from .env by dotenv:', dotenvResult.parsed ? Object.keys(dotenvResult.parsed) : 'None (.env file missing/empty/skipped)');
console.log('[ENV DEBUG] All process.env keys present at startup (sorted):', Object.keys(process.env).sort());


const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/daytree',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_daytree_jwt_key_123!',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'default_cloud',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'default_api_key',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'default_api_secret',
  NODE_ENV: process.env.NODE_ENV || 'development',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  AUTH_RATE_LIMIT_WINDOW_MS: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
  AUTH_RATE_LIMIT_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '15', 10),
  CORS_ORIGIN: process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:5173',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'DayTree <no-reply@daytree.paanipoorie.com>',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
};

// Temporarily log JWT_SECRET diagnostics
console.log('typeof process.env.JWT_SECRET:', typeof process.env.JWT_SECRET);
console.log('process.env.JWT_SECRET?.length:', process.env.JWT_SECRET?.length);
console.log('typeof env.JWT_SECRET:', typeof env.JWT_SECRET);
console.log('env.JWT_SECRET?.length:', env.JWT_SECRET?.length);

// Validate that critical env variables are present in production/production-like environments
if (env.NODE_ENV === 'production') {
  const missing = [];
  if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
  if (!process.env.JWT_SECRET) {
    missing.push('JWT_SECRET');
  }
  if (!process.env.RESEND_API_KEY) missing.push('RESEND_API_KEY');
  if (!process.env.EMAIL_FROM) missing.push('EMAIL_FROM');
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'default_cloud') {
    missing.push('CLOUDINARY_CLOUD_NAME');
  }
  if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === 'default_api_key') {
    missing.push('CLOUDINARY_API_KEY');
  }
  if (!process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET === 'default_api_secret') {
    missing.push('CLOUDINARY_API_SECRET');
  }
  if (!process.env.GOOGLE_CLIENT_ID) missing.push('GOOGLE_CLIENT_ID');
  if (!process.env.FRONTEND_URL && !process.env.CORS_ORIGIN) {
    missing.push('FRONTEND_URL/CORS_ORIGIN');
  }
  if (missing.length > 0) {
    throw new Error(`Missing critical production environment variables: ${missing.join(', ')}`);
  }
} else {
  // Warn if missing in dev (ignore during test runs to prevent cluttering test output)
  if (!process.env.RESEND_API_KEY && env.NODE_ENV !== 'test') {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️  WARNING: RESEND_API_KEY is missing. OTP email delivery will fail.');
  }
}

module.exports = env;
