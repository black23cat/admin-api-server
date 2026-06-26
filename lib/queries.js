const { prisma } = require('./prisma');

async function getUser(username, email = null) {
  if (username === null && email === null) {
    throw new Error('Email or username must not be empty');
  }

  let user;
  if (username === null) {
    user = await prisma.user.findUnique({
      where: { email: email },
    });
  } else if (email === null) {
    user = await prisma.user.findUnique({
      where: { username: username },
    });
  }
  return user;
}

async function allPurchaseOrder(page, options = null) {
  const take = 25;
  const skip = (page - 1) * take;
  const takeOptions = {
    include: { fileList: true },
    orderBy: { createdAt: 'asc' },
    take: take,
    skip: skip,
  };

  const findOptions =
    options === null ? takeOptions : { ...options, ...takeOptions };

  const purchaseOrder = await prisma.purchaseOrder.findMany(findOptions);
  return purchaseOrder;
}

async function countAllPurchaseOrder(options = null) {
  const countOptions = options === null ? {} : options;
  const poCount = await prisma.purchaseOrder.count(countOptions);
  return poCount;
}

async function getPoByIds(idList) {
  const purchaseOrderList = await prisma.purchaseOrder.findMany({
    where: { id: { in: idList } },
    include: { fileList: true },
    orderBy: { createdAt: 'asc' },
  });
  return purchaseOrderList;
}

async function newPurchaseOrder(poData) {
  const po = await prisma.purchaseOrder.create({
    data: {
      customerName: poData.customerName,
      poType: poData.poType,
      fileList: {
        createMany: { data: poData.fileList },
      },
    },
  });
  return po;
}

async function updatePo(poId, poData) {
  const deletePoFile = await prisma.file.deleteMany({ where: { poId: poId } });
  const updatePo = await prisma.purchaseOrder.update({
    where: { id: poId },
    data: {
      customerName: poData.customerName,
      poType: poData.poType,
      fileList: {
        createMany: { data: poData.fileList },
      },
    },
    include: { fileList: true },
  });
  return updatePo;
}

async function deletePo(poId) {
  const purchaseOrder = await prisma.purchaseOrder.findUnique({
    where: { id: poId },
  });
  if (purchaseOrder.invoiceId !== null) {
    throw 'This po is already invoiced';
  }
  const deletedPo = await prisma.purchaseOrder.delete({ where: { id: poId } });
  return deletedPo;
}

async function allInvoice(page, options = null) {
  const take = 25;
  const skip = (page - 1) * take;
  const takeOptions = {
    include: { amount: true, paymentDetails: true },
    take: take,
    skip: skip,
  };

  const findOptions =
    options === null || Object.entries(options).length === 0
      ? takeOptions
      : { ...options, ...takeOptions };

  const invoices = await prisma.invoice.findMany(findOptions);
  return invoices;
}

async function countAllInvoice(options = null) {
  const countOptions = options === null ? {} : options;
  delete options.orderBy;
  const invoiceCount = await prisma.invoice.count(countOptions);

  return invoiceCount;
}

async function newInvoice(poIds, printDetails) {
  const ecoSolventAmount =
    printDetails.eco.printLength * printDetails.eco.price;
  const sublimAmount =
    printDetails.sublim.printLength * printDetails.sublim.price;

  const invoice = await prisma.invoice.create({
    data: {
      customerName: printDetails.customerName,
      amount: {
        create: {
          ecoSolvent: ecoSolventAmount,
          sublim: sublimAmount,
          total: ecoSolventAmount + sublimAmount,
        },
      },
    },
  });
  const updatePo = await prisma.purchaseOrder.updateMany({
    where: { id: { in: poIds } },
    data: { invoiceId: invoice.id },
  });

  return { updatedPoId: poIds, invoice };
}

async function payInvoice(invoiceId, paymentDetails) {
  const updateInvoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      paymentDetails: {
        create: {
          method: paymentDetails.paymentMethods,
          amountPaid: Number(paymentDetails.amount),
        },
      },
    },
  });
  const updatedInvoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { amount: true, paymentDetails: true },
  });
  return updatedInvoice;
}

async function updatePaymentStatus(invoiceId, status) {
  if (status === 'paid') {
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'Paid' },
      include: { paymentDetails: true, amount: true },
    });
    return invoice;
  }
  if (status === 'cancel') {
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'Cancelled' },
      include: { paymentDetails: true, amount: true },
    });
    return invoice;
  }
}

async function getInvoiceById(invoiceId) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });
  return invoice;
}

module.exports = {
  getUser,
  allPurchaseOrder,
  countAllPurchaseOrder,
  getPoByIds,
  newPurchaseOrder,
  updatePo,
  deletePo,
  allInvoice,
  countAllInvoice,
  newInvoice,
  payInvoice,
  updatePaymentStatus,
  getInvoiceById,
};
