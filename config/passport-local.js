const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const queries = require('../lib/queries.js');
const { comparePassword } = require('../validator/passwordServices');

const verifyCallback = async (username, password, done) => {
  try {
    // Match email pattern to check if user is using email or username
    const pattern = new RegExp(
      /^.+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]*[a-zA-Z]{2,}$/,
    );
    const email = pattern.test(username) ? username : null;
    if (email !== null) {
      username = null;
    }
    // Check if the user exists in database
    const getUser = await queries.getUser(username, email);
    if (getUser === null) {
      return done(null, false, { message: errorMessage });
    }
    const match = await comparePassword(password, getUser.password);
    if (!match) {
      return done(null, false, { message: errorMessage });
    }
    return done(null, getser);
  } catch (err) {
    return done(err);
  }
};

passport.use(new LocalStrategy(verifyCallback));
