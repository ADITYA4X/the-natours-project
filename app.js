/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const morgan = require('morgan');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1)GLOBAL MIDDLEWARE

// Helmet middleware: Set security HTTP headers
app.use(helmet());

// Morgan logging middleware: log all requests to the console
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting middleware: Limit requests from same API
const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 60 minutes
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser middleware: parse JSON request bodies-reading data from body to req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS protection
app.use(xss());

// Prevent parameter pollution: remove query string parameters that are not in the whitelist
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'price',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
    ],
  }),
);

// Serving static files from the public directory
app.use(express.static(`${__dirname}/public`));

// 2) TEST MIDDLEWARE
app.use((req, res, next) => {
  // adding current time to request
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);

  next();
});

// 3) ROUTES
// Mounting new router on rout:
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handling unhandled routes: all- Get, Post, Delete and Patch:
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error handling middleware: 500-internal server error, 400-fail
app.use(globalErrorHandler);

module.exports = app;
