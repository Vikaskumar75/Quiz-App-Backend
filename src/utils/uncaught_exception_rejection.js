// Handling unhandled Exception and Rejection
process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection 💥. Shutting down....');
  console.log(error.name, error.message);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception 💥. Shutting down....');
  console.log(error.name, error.message);
  process.exit(1);
});
