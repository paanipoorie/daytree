const env = require('./config/env');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = env.PORT || 5000;

const mongoose = require('mongoose');

// Connect to Database
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Graceful shutdown helper
  const shutdown = (signal) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

    // 1. Stop accepting new connections
    server.close(async () => {
      console.log('HTTP server closed.');

      // 2. Disconnect from database
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection cleanly closed.');
        process.exit(0);
      } catch (error) {
        console.error('Error during database disconnection:', error.message);
        process.exit(1);
      }
    });

    // Force close after 10s timeout
    setTimeout(() => {
      console.error('Forced shutdown: outstanding connections did not close within 10s.');
      process.exit(1);
    }, 10000);
  };

  // Register shutdown event listeners
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

}).catch((err) => {
  console.error('Failed to connect to database', err);
});
