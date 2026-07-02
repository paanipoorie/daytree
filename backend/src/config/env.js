const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

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
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

// Validate that critical env variables are present in production/production-like environments
if (env.NODE_ENV === 'production') {
  const missing = [];
  if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
  if (missing.length > 0) {
    throw new Error(`Missing critical production environment variables: ${missing.join(', ')}`);
  }
}

module.exports = env;
