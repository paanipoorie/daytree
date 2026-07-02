const env = require('./config/env');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to database', err);
});
