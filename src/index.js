require('./utils/uncaught_exception_rejection');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
require('./db/mongo_db');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/app_error');
const globalErrorHandler = require('./controller/error_controller');
const userRouter = require('./router/user_router');

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

// Handling unexpected route
app.all('*', (req, _, next) => {
  next(new AppError(404, `Requested url ${req.originalUrl} is not defined.`));
});

// Error handeling middleware
app.use(globalErrorHandler);

// Staring Server
const port = process.env.PORT;
const server = app.listen(port, () =>
  console.log('Server started listening on port:', port)
);
