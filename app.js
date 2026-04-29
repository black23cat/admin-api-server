const express = require('express');
const cors = require('cors');
// Import required Router
const loginRouter = require('./router/loginRouter.js');

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

// Express error catch
app.use((err, req, res, next) => {
  return res.status(400).json();
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server listening to PORT ${PORT}`);
});
