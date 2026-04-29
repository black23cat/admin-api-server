const { body } = require('express-validator');

const loginValidator = [
  // Validate and sanitize user login forms
  body('username')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email or Username must be filled.'),
  body('password').notEmpty().withMessage('Please fill the password field.'),
];

module.exports = { loginValidator };
