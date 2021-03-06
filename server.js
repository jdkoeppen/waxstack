;
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');

mongoose.Promise = global.Promise;

const app = express();
const {
  router: recordRouter
} = require('./record');
const {
  router: usersRouter
} = require('./users');
const {
  router: collectionRouter
} = require('./collection');
const {
  router: authRouter,
  localStrategy,
  jwtStrategy
} = require('./auth');
const {
  PORT,
  DATABASE_URL
} = require('./config');

app.use(morgan('common'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {
  session: false
});

app.use('/api/users/', usersRouter);
app.use('/api/records/', jwtAuth, recordRouter);
app.use('/api/auth/', authRouter);
app.use('/api/logout/', authRouter);
app.use('/api/collection/', jwtAuth, collectionRouter);

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.json('How did you get in here?');
});


app.use('*', (req, res) => res.status(404).json({
  message: "Not Found"
}));

let server;

function runServer(dbUrl = DATABASE_URL) {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbUrl, (err) => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', (err) => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  }));
}

if (require.main === module) {
  runServer().catch((err) => console.error(err));
}

module.exports = {
  app,
  runServer,
  closeServer
};