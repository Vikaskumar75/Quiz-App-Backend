require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
require('./db/mongo_db');
const express = require('express');
const morgan = require('morgan');
const { handleError } = require('./utils/error');
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

app.use('*', handleError);

const port = process.env.PORT;
app.listen(port, () => {
  console.log('Server started listening on port:', port);
});
