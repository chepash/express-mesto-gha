const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = { _id: '63ff56fbe65a55e9b3e58e0a' };
  next();
});

app.use(routes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
