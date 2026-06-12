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

module.exports = { getUser, allPurchaseOrder, newPurchaseOrder, updatePo };
