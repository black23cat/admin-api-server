const bcrypt = require('bcryptjs');

const salt = 10;

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function comparePassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

module.exports = {
  hashPassword,
  comparePassword,
};
