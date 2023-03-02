const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const CastError = require('mongoose/lib/error/cast');
const ValidationError = require('mongoose/lib/error/validation');
const routes = require('./routes');
const {
  ERR_STATUS_BAD_REQUEST,
  // ERR_STATUS_NOT_FOUND,
  ERR_STATUS_INTERNAL_SERVER,
  // STATUS_OK,
  // STATUS_OK_CREATED,
} = require('./utils/constants');

const errorHandler = require('./utils/utils');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const app = express();

app.use(express.json());

/// //////////////////////////////////////////////////////////////////////////////
// app.use((req, res, next) => {
//   console.log('request : ', req);
//   next();
// });

app.use((req, res, next) => {
  req.user = { _id: '63ff56fbe65a55e9b3e58e0a' };
  next();
});
app.get('/', (req, res) => {
  res.send(
    ` <html>
        <body>
            <p>Сервер запущен</p>
        </body>
      </html>`,
  );
});
app.use(routes);
app.use((err, req, res, next) => {
  console.log(true);
  if (err instanceof ValidationError) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: err.message });
  } else if (err instanceof CastError) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: err.message });
  } else {
    res.status(ERR_STATUS_INTERNAL_SERVER).send({ message: err.message });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
