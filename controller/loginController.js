require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const loginValidation = require('../validator/authValidator').loginValidator;
const { validateInput } = require('../validator/inputValidation.js');

async function handleLoginAuth(req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).json('User tidak ditemukan');
    }
    // SIGN JWT Token for succes user login
    const secret = process.env.JWT_SECRET;
    const currentTime = new Date().getHours();
    // Set custom expired time
    const expired =
      currentTime >= 9 && currentTime <= 20 ? 20 - currentTime : 1;
    jwt.sign(
      { user },
      secret,
      { expiresIn: `${expired}h` },
      function (err, token) {
        if (err) {
          return next(err);
        }
        return res.status(200).json(token);
      },
    );
  })(req, res, next);
}

module.exports = {
  loginValidation: [loginValidation, validateInput],
  loginAuth: handleLoginAuth,
};
