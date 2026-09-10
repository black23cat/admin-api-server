const { id } = require('date-fns/locale');
const { prisma } = require('../lib/prisma');
const { hashPassword } = require('../validator/passwordServices');

const userData = {
  firstName: 'Admin',
  lastName: 'User',
  username: 'admin',
  email: 'admin@email.com',
  password: 'admin123',
  role: 'Admin',
};

async function main() {
  const hashedPassword = await hashPassword(userData.password);
  const seedDb = [
    prisma.user.create({
      data: { ...userData, password: hashedPassword },
    }),

    prisma.purchaseOrder.create({
      data: {
        customerName: 'Customer 1',
        poType: 'eco',
        fileList: {
          createMany: {
            data: [
              { filename: 'testfile_26-30_130x200_Hitam_2x' },
              { filename: 'testfile2_26-30_130x200_Hitam_2x' },
            ],
          },
        },
      },
    }),
    prisma.purchaseOrder.create({
      data: {
        customerName: 'Customer 2',
        poType: 'sublim',
        fileList: {
          createMany: {
            data: [
              { filename: 'testfile_26-30_110x150_Hitam_5x' },
              { filename: 'testfile_31-35_110x200_Hijau_2x' },
            ],
          },
        },
      },
    }),
  ];

  const [user, purchaseOrder] = await Promise.all(seedDb);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
