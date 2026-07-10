const { body } = require('express-validator');
const { matchFilename } = require('../utils/regexPattern');

const loginValidator = [
  // Validate and sanitize user login forms
  body('username')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Email or Username must be filled.'),
  body('password').notEmpty().withMessage('Please fill the password field.'),
];

const newPoValidator = [
  body('customerName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Nama Customer tidak boleh kosong')
    .isLength({ max: 20 })
    .withMessage('Nama Customer harus terdiri dari 20karakter'),
  body('poType')
    .trim()
    .escape()
    .custom((value) => {
      return value === 'eco' ||
        value === 'ecoBahan' ||
        value === 'sublim' ||
        value === 'sublimPress'
        ? true
        : false;
    }),
  body('fileList')
    .custom((values, { req }) => {
      const files = req.body.fileList;
      let isValid = true;
      for (let i = 0; i < files.length; i++) {
        const matchFile = matchFilename(files[i].filename);
        if (!matchFile) {
          isValid = false;
          break;
        }
      }
      return isValid;
    })
    .withMessage('Filename tidak sesuai format'),
];

module.exports = { loginValidator, newPoValidator };
