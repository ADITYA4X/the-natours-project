const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARE
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // adding current time to request: define property on request object
  req.requestTime = new Date().toISOString();

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
