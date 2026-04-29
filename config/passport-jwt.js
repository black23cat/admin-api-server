const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();

// Configure how the token is extracted from
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // REQUIRED FOR TOKEN SIGNATURE
};

function verify(jwt_payload, done) {
  // Get user data from decoded JWT payload
  const user = jwt_payload.user;
  if (!user) {
    return done(null, false);
  }
  return done(null, user);
}

passport.use(new JwtStrategy(options, verify));
