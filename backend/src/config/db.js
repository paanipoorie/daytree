// Database connection configuration and initialization (triggered nodemon restart)
const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const rawUri = env.MONGODB_URI;
    const sanitizedUri = rawUri ? rawUri.replace(/:([^@]+)@/, ':****@') : 'undefined';
    console.log(`MongoDB connection URI: ${sanitizedUri}`);

    const conn = await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });
    
    console.log(`MongoDB Connected Host: ${conn.connection.host}`);
    console.log(`MongoDB Database Name: ${conn.connection.name}`);
    console.log(`MongoDB connection.readyState: ${conn.connection.readyState}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
