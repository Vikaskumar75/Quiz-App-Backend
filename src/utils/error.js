const handleError = (error, req, res, next) => {
  console.log(typeof error);
  const errorObject = {
    status: false,
    error: error.message,
  };
  if (process.env.NODE_ENV === 'development') {
    errorObject.stack_trace = error;
  }
  res.status(400).send(errorObject);
};

module.exports = { handleError };
