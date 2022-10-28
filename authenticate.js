const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const jwt = require('jsonwebtoken');

const config = require('./config/config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

exports.generateToken = (user) => {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin === true) {
    next();
    return;
  }
  else {
    var err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
  }
}
