require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const express = require('express');

const app = express();

app.use('/', (req, res) => {
  res.send('server is up and running! 😃');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server started listening on port:', port);
});
