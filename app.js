const express = require('express');
const cors = require('cors');
// Import required Router

require('dotenv').config();

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

// Express error catch
app.use((err, req, res, next) => {
  if (err) {
    return res.json(err);
  }
});

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  }
  console.log(`Server listening to PORT ${PORT}`);
});
