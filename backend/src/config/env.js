const dotenv = require('dotenv');
const path = require('path');

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

cleanEnvKeys();

const NODE_ENV = process.env.NODE_ENV || 'production';

if (NODE_ENV === 'development') {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
  cleanEnvKeys();
}

console.log('[ENV DEBUG] NODE_ENV:', NODE_ENV);
console.log('[ENV DEBUG] MONGODB_URI present:', !!process.env.MONGODB_URI);
console.log('[ENV DEBUG] JWT_SECRET present:', !!process.env.JWT_SECRET);

const env = {
  NODE_ENV,
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  AUTH_RATE_LIMIT_WINDOW_MS: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10),
  AUTH_RATE_LIMIT_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '15', 10),
  CORS_ORIGIN: process.env.FRONTEND_URL || process.env.CORS_ORIGIN,
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
};

if (NODE_ENV === 'production') {
  const missing = [];
  if (!env.MONGODB_URI) missing.push('MONGODB_URI');
  if (!env.JWT_SECRET) missing.push('JWT_SECRET');
  if (!env.RESEND_API_KEY) missing.push('RESEND_API_KEY');
  if (!env.EMAIL_FROM) missing.push('EMAIL_FROM');
  if (!env.CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!env.CLOUDINARY_API_KEY) missing.push('CLOUDINARY_API_KEY');
  if (!env.CLOUDINARY_API_SECRET) missing.push('CLOUDINARY_API_SECRET');
  if (!env.GOOGLE_CLIENT_ID) missing.push('GOOGLE_CLIENT_ID');
  if (!env.CORS_ORIGIN) missing.push('FRONTEND_URL/CORS_ORIGIN');
  if (missing.length > 0) {
    throw new Error(`Missing critical production environment variables: ${missing.join(', ')}`);
  }
} else {
  if (!env.MONGODB_URI) env.MONGODB_URI = 'mongodb://localhost:27017/daytree';
  if (!env.JWT_SECRET) env.JWT_SECRET = 'super_secret_daytree_jwt_key_123!';
  if (!env.CLOUDINARY_CLOUD_NAME) env.CLOUDINARY_CLOUD_NAME = 'default_cloud';
  if (!env.CLOUDINARY_API_KEY) env.CLOUDINARY_API_KEY = 'default_api_key';
  if (!env.CLOUDINARY_API_SECRET) env.CLOUDINARY_API_SECRET = 'default_api_secret';
  if (!env.CORS_ORIGIN) env.CORS_ORIGIN = 'http://localhost:5173';
  if (!env.EMAIL_FROM) env.EMAIL_FROM = 'DayTree <no-reply@daytree.paanipoorie.com>';
}

module.exports = env;