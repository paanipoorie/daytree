const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/errorHandler');
const env = require('./config/env');
const requestTracer = require('./middleware/requestTracer');

const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Request Tracing (runs first to generate requestId)
app.use(requestTracer);

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === 'production' ? env.CORS_ORIGIN : true,
  credentials: true
}));

// Apply general rate limiting to all api endpoints
app.use('/api', generalLimiter);

// Logging Middleware
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers with size limits (prevents Denial of Service via large payloads)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Sanitize inputs to prevent MongoDB Operator Injection
app.use(mongoSanitize());

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Import Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const habitRoutes = require('./routes/habit.routes');
const tallyRoutes = require('./routes/tally.routes');

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/habits', habitRoutes);
app.use('/api/v1/tally', tallyRoutes);

// Placeholder error handler registration (routes will be added here in future phases)
app.use(errorHandler);

module.exports = app;
