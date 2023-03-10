const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const routes = require('./routes');
const { PORT, DB_ADDRESS } = require('./config');

const { errorHandler } = require('./utils/utils');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const { ERR_STATUS_NOT_FOUND } = require('./utils/constants');
const { auth } = require('./middlewares/auth');

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const app = express();

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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(/^https?:\/\/.+/i),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth, routes);
app.use(errors());
app.use(errorHandler);

app.use('*', (req, res) => { res.status(ERR_STATUS_NOT_FOUND).send({ message: 'URL not found' }); });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
