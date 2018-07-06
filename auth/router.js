'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {
  Collection
} = require('../collection/models')

const config = require('../config');
const router = express.Router();


const createAuthToken = function (user) {
  return jwt.sign({
    user
  }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {
  session: false
});


router.use(bodyParser.json());
router.post('/login', localAuth, (req, res) => {

  const authToken = createAuthToken(req.user.serialize());


  Collection.findOne({
      userId: req.user._id
    })
    .exec()
    .then(function (col) {
      if (!col) {
        console.log('Collection Created')
        return Collection.create({
          userId: req.user._id
        })
      }
      return col
    })
    .then(function (col) {
      res.json({
        authToken, user: req.user, id: col._id
      })
    })
    
    .catch(function (err) {
      console.log(err)
    })
});


const jwtAuth = passport.authenticate('jwt', {
  session: false
});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({
    authToken
  });
});

router.post('/logout', (req, res) => {
  req.logout();
  req.redirect('/');
});

module.exports = {
  router
};