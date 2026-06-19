const passport = require('passport');

const jwtAuthenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json('Unauthorized');
    return next();
  })(req, res, next);
};

module.exports = jwtAuthenticate;
