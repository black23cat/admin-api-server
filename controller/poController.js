const queries = require('../lib/queries');
const { validateInput } = require('../validator/inputValidation.js');
const { newPoValidator } = require('../validator/authValidator.js');
const { matchedData } = require('express-validator');
const { startOfWeek, endOfWeek } = require('date-fns');

async function purchaseOrder(req, res, next) {
  try {
    const { page, filter } = req.query;
    const currentPage = Number(!page ? 1 : page);
    const filterOptions = {};

    if (filter === '1') {
      const { query, dateStart, dateEnd } = req.query;

      // Set up options for filtering data
      const options = {
        where: { customerName: { contains: query, mode: 'insensitive' } },
      };

      //Check if there's any date provided
      if (dateStart !== '' && dateEnd !== '') {
        options.where.AND = {
          createdAt: { gte: new Date(dateStart), lte: new Date(dateEnd) },
        };
      } else if (dateStart !== '' && dateEnd === '') {
        options.where.AND = {
          createdAt: { gte: new Date(dateStart) },
        };
      } else if (dateStart === '' && dateEnd !== '') {
        options.where.AND = {
          createdAt: { gte: new Date(dateEnd) },
        };
      }

      filterOptions.where = options.where;
      filterOptions.orderBy = options.orderBy;
    }

    const [purchaseOrder, poCount] = await Promise.all([
      queries.allPurchaseOrder(currentPage, filterOptions),
      queries.countAllPurchaseOrder(filterOptions),
    ]);

    return res.status(200).json({ purchaseOrder, count: poCount });
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
    const id = Number(poId);
    const [po] = await queries.getPoByIds([id]);

    if (po.invoiceId !== null) {
      return res.status(400).json({ msg: 'Invoice untuk po ini sudah dibuat' });
    }

    const updatePo = await queries.updatePo(id, {
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
