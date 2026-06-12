const { Router } = require('express');
const passport = require('passport');
const controller = require('../controller/poController');

const poRouter = Router();

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json('Unauthorized');
    return next();
  })(req, res, next);
};

poRouter.use(authenticate);
poRouter.get('/', controller.purchaseOrder);
poRouter.post(
  '/create',
  controller.validatePoInput,
  controller.newPurchaseOrder,
);
poRouter.put(
  '/:poId',
  controller.validatePoInput,
  controller.updatePurchaseOrder,
);

module.exports = poRouter;
