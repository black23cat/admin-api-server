const { Router } = require('express');
const controller = require('../controller/invoiceController');

const invoiceRouter = Router();

invoiceRouter.get('/', controller.allInvoice);
invoiceRouter.post('/create', controller.newInvoice);

module.exports = invoiceRouter;
