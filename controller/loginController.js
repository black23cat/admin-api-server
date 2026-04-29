require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const loginValidation = require('../validator/authValidator').loginValidator;
const { validationResult } = require('express-validator');

async function loginPost(req, res, next) {
  // Validate user input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  next();
}

async function handleLoginAuth(req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return next(err);
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
        return res.json(token);
      },
    );
  })(req, res, next);
}

module.exports = {
  loginValidation: [loginValidation, loginPost],
  loginAuth: handleLoginAuth,
};
