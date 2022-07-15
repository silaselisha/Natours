process.on('uncaughtException', (err) => {
  console.log(colors.magenta.inverse(err.message))
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
    console.log(colors.green.inverse('Successfully connected to database...'));
  }).catch(err => {
    console.log(colors.red.inverse(err.message))
  })
 

const server = app.listen(PORT, () => {
  console.log(`Listening http://${localhsot}:${PORT}`);
});

process.on('unhandledRejection', () => {
  server.close(() => {
    console.log(colors.red.inverse('Server shutting down...'))
    process.exit(1);
  });
});
