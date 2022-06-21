const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/app_error');
const globalErrorHandler = require('./controller/error_controller');
const userRouter = require('./router/user_router');
const emailRouter = require('./router/email_router');
const categoryRouter = require('./router/category_router');
const quizRouter = require('./router/quiz_router');

const app = express();
app.use(express.json());

// Logging the request for development request only
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Adding requestTime to each and every request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const version = process.env.VERSION;
// registering routers
app.use(version, userRouter);
app.use(version, emailRouter);
app.use(version, categoryRouter);
app.use(version, quizRouter);

// Handling unexpected route
app.all('*', (req, _, next) => {
  next(new AppError(404, `Requested url ${req.originalUrl} is not defined.`));
});

// Error handeling middleware
app.use(globalErrorHandler);

module.exports = app;
