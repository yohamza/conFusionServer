const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config/config');

const User = require('../models/users');

module.exports = function (passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secretKey;

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      console.log('JWT payload: ', jwt_payload);
      try {
        let user = await User.findOne({ _id: jwt_payload._id });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(err, false);
      }
    })
  );

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
