require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
require('./utils/uncaught_exception_rejection');
require('./db/mongo_db');
const app = require('./app');

// Staring Server
const port = process.env.PORT;
app.listen(port, () => console.log('Server started listening on port:', port));
