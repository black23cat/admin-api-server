const queries = require('../lib/queries');
const { validateInput } = require('../validator/inputValidation.js');
const { newPoValidator } = require('../validator/authValidator.js');
const { matchedData } = require('express-validator');

async function purchaseOrder(req, res) {
  try {
    const purchaseOrder = await queries.allPurchaseOrder();
    return res.json(purchaseOrder);
  } catch (error) {
    next(error);
  }
}

async function newPurchaseOrder(req, res, next) {
  try {
    const { customerName, poType, fileList } = matchedData(req);

    const newPo = await queries.newPurchaseOrder({
      customerName,
      poType,
      fileList,
    });
    return res.status(201).json('Created');
  } catch (error) {
    next(error);
  }
}

async function updatePurchaseOrder(req, res, next) {
  try {
    const { customerName, poType, fileList } = matchedData(req);
    const { poId } = req.params;

    const updatePo = await queries.updatePo(Number(poId), {
      customerName,
      poType,
      fileList,
    });
    return res.status(200).json(updatePo);
  } catch (error) {
    next(error);
  }
}

async function deletePo(req, res, next) {
  try {
    const { poId } = req.params;
    const deletedPo = await queries.deletePo(Number(poId));
    return res.status(200).json(deletedPo);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  purchaseOrder,
  validatePoInput: [newPoValidator, validateInput],
  newPurchaseOrder,
  updatePurchaseOrder,
  deletePo,
};
