const { Router } = require('express');
const controller = require('../controller/invoiceController');

const invoiceRouter = Router();

invoiceRouter.get('/', controller.allInvoice);
invoiceRouter.get('/payment', controller.getPaymentData);
invoiceRouter.post('/create', controller.newInvoice);
invoiceRouter.put('/pay/:invoiceId', controller.payInvoice);
invoiceRouter.put('/cancel/:invoiceId', controller.cancelInvoice);

module.exports = invoiceRouter;
