const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
  try {
    let users = await User.find({});
    res.status(200).json({ users: users });
  } catch (error) {
    return next(err);
  }
});

router.post('/signup', cors.corsWithOptions, async (req, res, next) => {
  try {
    console.log(
      'username: ' + req.body.username + '\npassword: ' + req.body.password
    );
    let user = await User.findOne({ username: req.body.username });
    if (user != null) {
      var error = new Error('User' + req.body.username + ' already exists');
      error.status = 403;
      next(error);
    } else {
      if (req.body.username.length < 3) {
        var error = new Error("Name can't be less than 3 characters");
        error.status = 403;
        next(error);
        return;
      } else if (req.body.password.length < 5) {
        var error = new Error("Password's length can't be less than 5");
        error.status = 403;
        next(error);
        return;
      }

      User.register(
        new User({ username: req.body.username }),
        req.body.password,
        async (error, user) => {
          if (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ error: error });
          } else {

            if (req.body.firstname)
              user.firstname = req.body.firstname;

            if (req.body.lastname)
              user.lastname = req.body.lastname;

            let userSave = await user.save();
            if (userSave) {
              passport.authenticate('local')(req, res, () => {
                res.status = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, message: 'User created succesfully' });
              });
            }
          }
        }
      );
    }
  } catch (error) {
    next(error);
  }
});

router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  var token = authenticate.generateToken({ _id: req.user._id });
  res.status = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, jwt: token, message: 'Logged In succesfully' });
});

router.get('/logout', cors.corsWithOptions, async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.body.username });

    if (user != null) {
      if (req.session) {
        req.session.destroy;
        res.clearCookie('session-id');
        res.redirect('/');
      } else {
        var error = new Error('User ' + req.body.username + " doesn't exist.");
        error.statusCode = 401;
        next(error);
      }
    } else {
      var error = new Error('User ' + req.body.username + " doesn't exist.");
      error.statusCode = 401;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
