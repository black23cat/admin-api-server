const { validationResult } = require('express-validator');

async function validateInput(req, res, next) {
  // Validate user input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  next();
}

module.exports = { validateInput };
