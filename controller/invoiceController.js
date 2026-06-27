const queries = require('../lib/queries');
const { calculateTotalPaid } = require('../utils/calculateTotalPaid');
const { format, startOfWeek, endOfWeek } = require('date-fns');

async function allInvoice(req, res, next) {
  try {
    const { page, filter } = req.query;
    const currentPage = Number(!page ? 1 : page);

    const filterOptions = {};
    if (filter === '1') {
      // Get user current page and data filter if exist
      const { query, sortBy, dateStart, dateEnd } = req.query;

      // Set up options for filtering data
      const options = {
        where: {
          customerName: { contains: query, mode: 'insensitive' },
        },
        orderBy: { [sortBy]: 'asc' },
      };
      if (sortBy === 'amount') {
        delete options.orderBy;
      }

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

    // Get all invoice data and calculate
    const [invoices, invoiceCount] = await Promise.all([
      queries.allInvoice(currentPage, filterOptions),
      queries.countAllInvoice(filterOptions),
    ]);
    const result = invoices.map((invoice) => {
      const totalPaid = calculateTotalPaid(invoice.paymentDetails);
      return { ...invoice, totalPaid };
    });
    if (req.query.sortBy === 'amount') {
      result.sort((prev, next) => prev.amount[0].total - next.amount[0].total);
    }

    return res.status(200).json({ invoiceList: result, count: invoiceCount });
  } catch (error) {
    next(error);
  }
}

async function newInvoice(req, res, next) {
  try {
    const { allowMissmatch, selectedIds } = req.body;
    if (allowMissmatch) {
      const { printDetails } = req.body;
      const newInvoice = await queries.newInvoice(selectedIds, printDetails);
      return res.status(201).json(newInvoice);
    }

    /* 
    --------------------------------------------------------
    Check if all po has same customer name
    send confirmation for different customer name to client
    send price and total length of purchase order to client 
    ---------------------------------------------------------- 
    */

    let isSame = true;
    let ecoSolventPoLength = 0;
    let sublimPoLength = 0;
    const purchaseOrderList = await queries.getPoByIds(selectedIds);
    const customerName = [purchaseOrderList[0].customerName];
    const defaultPrice = {
      eco: 27000,
      sublim: 53000,
    };
    if (!allowMissmatch) {
      // Get 1 customer name from po to check across all po customer name

      for (const po of purchaseOrderList) {
        //Check for different customer name on each po
        if (po.customerName !== customerName[0]) {
          isSame = false;
          customerName.push(po.customerName);
        }

        po.fileList.forEach((file) => {
          const filename = file.filename.split('_');
          //Extract file length
          const fileDimension = Number(filename[2].split('x')[1]);
          //calculate each file total length and asign it to specific po type
          const printCount = Number(
            filename[filename.length - 1].toLowerCase().replace('x', ''),
          );
          const CM_TO_METER = 100;
          const totalFileLength = (fileDimension * printCount) / CM_TO_METER;
          if (po.poType === 'eco') {
            return (ecoSolventPoLength += totalFileLength);
          } else if (po.poType === 'sublim') {
            return (sublimPoLength += totalFileLength);
          }
        });
      }
    }

    const message = {
      needMissmatchConfirmation: false,
      customerName: customerName.join('_'),
      printDetails: {
        eco: {
          printLength: ecoSolventPoLength > 0 ? ecoSolventPoLength : null,
          price: defaultPrice.eco,
        },
        sublim: {
          printLength: sublimPoLength > 0 ? sublimPoLength : null,
          price: defaultPrice.sublim,
        },
      },
    };

    if (!isSame) {
      message.needMissmatchConfirmation = true;
    }

    return res.status(422).json(message);
  } catch (error) {
    next(error);
  }
}

async function payInvoice(req, res, next) {
  try {
    const id = Number(req.params.invoiceId);
    const invoice = await queries.getInvoiceById(id);
    // Check if the invoice is already paid, return error if the invoice already paid
    if (invoice.status === 'Paid') {
      return res.status(400).json('Invoice already paid');
    }
    // Pay invoice and calculate total payment on invoice
    const payInvoice = await queries.payInvoice(id, req.body);
    const totalPaid = calculateTotalPaid(payInvoice.paymentDetails);
    if (totalPaid === payInvoice.amount[0].total) {
      // For fully paid invoice, update invoice status
      const updatePaymentStatus = await queries.updatePaymentStatus(id, 'paid');
      return res.status(200).json({ ...updatePaymentStatus, totalPaid });
    }
    return res.status(200).json({ ...payInvoice, totalPaid });
  } catch (error) {
    next(error);
  }
}

async function cancelInvoice(req, res, next) {
  try {
    const { invoiceId } = req.params;
    const id = Number(invoiceId);
    const invoiceData = await queries.getInvoiceById(id);
    if (
      invoiceData.status === 'Paid' ||
      invoiceData.paymentDetails.length > 0
    ) {
      return res.status(400).json('Invoice sudah terbayar');
    }
    const invoice = await queries.cancelInvoice(id);
    return res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
}

module.exports = { allInvoice, newInvoice, payInvoice, cancelInvoice };
