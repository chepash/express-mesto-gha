const helmet = require('helmet');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const celebrate = require('celebrate');

const routes = require('./routes');
const { PORT, DB_ADDRESS } = require('./config');

const { appErrorHandler } = require('./utils/utils');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const { ERR_STATUS_NOT_FOUND } = require('./utils/constants');
const { auth } = require('./middlewares/auth');
const { validateSignInData, validateSignUpData } = require('./utils/utils');

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const app = express();

app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000'] }));
app.use(express.json());

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

app.post('/signin', validateSignInData, login);
app.post('/signup', validateSignUpData, createUser);

app.use(auth, routes);
app.use(celebrate.errors());
app.use(appErrorHandler);

app.use('*', (req, res) => { res.status(ERR_STATUS_NOT_FOUND).send({ message: 'URL not found' }); });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
