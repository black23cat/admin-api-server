const queries = require('../lib/queries');
const { calculateTotalPaid } = require('../utils/calculateTotalPaid');

async function allInvoice(req, res, next) {
  try {
    // Get all invoice data and calculate
    const invoices = await queries.allInvoice();
    const result = invoices.map((invoice) => {
      const totalPaid = calculateTotalPaid(invoice.paymentDetails);
      return { ...invoice, totalPaid };
    });

    return res.status(200).json(result);
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

module.exports = { allInvoice, newInvoice, payInvoice };
