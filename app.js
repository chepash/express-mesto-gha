const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { PORT, DB_ADDRESS } = require('./config');

const { errorHandler } = require('./utils/utils');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const { ERR_STATUS_NOT_FOUND } = require('./utils/constants');

mongoose.connect(DB_ADDRESS, {
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
app.get('/', (req, res, next) => {
  res.send(
    ` <html>
        <body>
            <p>Сервер запущен</p>
        </body>
      </html>`,
  );
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(routes);
app.use(errorHandler);
app.use('*', (req, res) => { res.status(ERR_STATUS_NOT_FOUND).send({ message: 'URL not found' }); });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
