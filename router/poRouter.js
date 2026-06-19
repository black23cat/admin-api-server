const { Router } = require('express');
const controller = require('../controller/poController');

const poRouter = Router();

poRouter.get('/', controller.purchaseOrder);
poRouter.post('/', controller.validatePoInput, controller.newPurchaseOrder);
poRouter.put(
  '/:poId',
  controller.validatePoInput,
  controller.updatePurchaseOrder,
);
poRouter.delete('/:poId', controller.deletePo);

module.exports = poRouter;
