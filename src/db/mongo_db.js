const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('successfuly connected to database...'))
  .catch((error) => {
    console.log({
      message: "can't connect to database💥💥💥.",
      error,
    });
  });
