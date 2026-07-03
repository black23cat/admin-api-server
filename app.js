const express = require('express');
const cors = require('cors');
const jwtAuthenticate = require('./middleware/jwtAuth.js');
// Import required Router
const loginRouter = require('./router/loginRouter.js');
const poRouter = require('./router/poRouter.js');
const invoiceRouter = require('./router/invoiceRouter.js');
const { PrismaClient, Prisma } = require('./generated/prisma/client');
const jobDataRouter = require('./router/jobDataRouter.js');

require('dotenv').config();
require('./config/passport-local');
require('./config/passport-jwt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    optionsSuccessStatus: 200,
    origin: '*',
  }),
);

app.get('/', (req, res) => {
  res.json('Hello');
});

app.use('/login', loginRouter);
app.use(jwtAuthenticate);
app.use('/purchase-order', poRouter);
app.use('/invoice', invoiceRouter);
app.use('/job-data', jobDataRouter);

// Express error catch
app.use((err, req, res, next) => {
  console.error(err);
  const prismaError = err instanceof Prisma.PrismaClientKnownRequestError;
  if (prismaError && (err.code.startsWith('P1') || err.code === 'P2024')) {
    return res.status(500).json('Internal Server Error');
  }
  if (prismaError && err.code === 'P2002') {
    return res.status(409).json('Data sudah ada di database');
  }
  if (prismaError && err.code === '2025') {
    return res.status(404).json('Data tidak ditemukan');
  }
  return res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server listening to PORT ${PORT}`);
});
