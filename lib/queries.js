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

async function allPurchaseOrder() {
  const purchaseOrder = await prisma.purchaseOrder.findMany({
    include: { fileList: true },
  });
  return purchaseOrder;
}

async function getPoByIds(idList) {
  const purchaseOrderList = await prisma.purchaseOrder.findMany({
    where: { id: { in: idList } },
    include: { fileList: true },
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

async function allInvoice() {
  const invoices = await prisma.invoice.findMany({ include: { amount: true } });
  return invoices;
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
  return invoice;
}

module.exports = {
  getUser,
  allPurchaseOrder,
  getPoByIds,
  newPurchaseOrder,
  updatePo,
  deletePo,
  allInvoice,
  newInvoice,
};
