const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const User = require('../models/users');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async (req, res, next) => {

  try {
    let user = await User.findOne({ username: req.body.username });
    if (user != null) {
      var error = new Error('User' + req.body.username + ' already exists');
      error.status = 403;
      next(error);
    }
    else {
      if (req.body.username.length < 3) {
        var error = new Error('Name can\'t be less than 3 characters');
        error.status = 403;
        next(error);
        return;
      }
      else if (req.body.password.length < 5) {
        var error = new Error('Password\'s length can\'t be less than 5');
        error.status = 403;
        next(error);
        return;
      }
      let createUser = await User.create(req.body);
      res.status = 201;
      res.setHeader('Content-Type', 'application/json');
      res.json({ message: 'User created succesfully', user: createUser });
    }
  } catch (error) {
    next(error);
  }

});

router.post('/login', async (req, res, next) => {

  try {

    if (!req.session.user) {
      var username = req.body.username;
      var password = req.body.password;

      let user = await User.findOne({ username: req.body.username });

      if (user != null) {

        if (username != user.username) {
          var error = new Error('User' + username + ' doesn\'t exist. Please signup first');
          error.statusCode = 404;
          return next(error);
        }

        if (password != user.password) {
          var error = new Error('Password is incorrect');
          error.statusCode = 403;
          return next(error);
        }

        if (username === user.username && password === user.password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Conent-Type', 'text/plain');
          res.end('Logged in succesfully');
        }
      }
      else {
        var error = new Error('User ' + user.username + ' doesn\'t exist. Please signup first.');
        error.statusCode = 403;
        next(error);
        return;
      }

    }
    else {
      if (req.session.user === 'authenticated') {
        res.status = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You\'re already logged in');
      }
      else {
        var error = new Error('Wrong username or password');
        error.statusCode = 401;
        next(error);
      }
    }

  } catch (error) {
    next(error);
  }

});

router.get('/logout', async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.body.username });

    if (user != null) {

      if (req.session) {
        req.session.destroy;
        res.clearCookie('session-id');
        res.redirect('/');
      }
      else {
        var error = new Error('User ' + req.body.username + ' doesn\'t exist.');
        error.statusCode = 401;
        next(error);
      }

    }
    else {
      var error = new Error('User ' + req.body.username + ' doesn\'t exist.');
      error.statusCode = 401;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
