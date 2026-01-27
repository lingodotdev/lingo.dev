const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config();
const app = require('./app');

// DB connection
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error('Missing DATABASE or DATABASE_PASSWORD environment variable');
  process.exit(1);
}
mongoose.connect(DB)
  .then(() => console.log('DB connection successful'))
  .catch(err => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });

// Start server 
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
