process.on('uncaughtException', (err) => {
  console.log(err.message)
  process.exit(1);
});

const mongoose = require('mongoose');
const colors = require('colors')
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const PORT = process.env.PORT || 3000;
const localhsot = '127.0.0.1';

const dataBase = process.env.DATABASE_URI.replace(
  '<password>',
  process.env.DATABASE_PASSCODE
);

mongoose
  .connect(dataBase, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Successfully connected to database...');
  }).catch(err => {
    console.log(err.message)
  })
 

const server = app.listen(PORT, () => {
  console.log(`Listening: ${PORT}`);
});

process.on('unhandledRejection', () => {
  console.log('Server shutting down...')

  server.close(() => {
    process.exit(1);
  });
});
