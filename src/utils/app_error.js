class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // This parameter will tell us that the error is created within our code
    // and not in some third party packages or something like that
    // Since, error thrown by those packages will not conatin `isOperational` property
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
