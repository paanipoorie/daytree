// Database connection configuration and initialization (triggered nodemon restart)
const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const rawUri = env.MONGODB_URI;
    const sanitizedUri = rawUri ? rawUri.replace(/:([^@]+)@/, ':****@') : 'undefined';
    console.log(`MongoDB connection URI: ${sanitizedUri}`);

    // Register connection status listeners
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected! Retrying connection...');
    });
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully!');
    });
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    const conn = await mongoose.connect(rawUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });
    
    console.log(`MongoDB Connected Host: ${conn.connection.host}`);
    console.log(`MongoDB Database Name: ${conn.connection.name}`);
    console.log(`MongoDB connection.readyState: ${conn.connection.readyState}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('💡 TIP 1: If connecting to MongoDB Atlas is failing/timing out, check your internet connection or ensure your IP is whitelisted on Atlas.');
    console.error('💡 TIP 2: Alternatively, you can run a local MongoDB service. If you have Docker installed, you can start the configured local MongoDB container by running: \n\n   docker start daytree-mongo\n');
    process.exit(1);
  }
};

module.exports = connectDB;
