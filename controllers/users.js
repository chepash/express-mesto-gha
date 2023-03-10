const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const {
  STATUS_OK,
  STATUS_OK_CREATED,
} = require('../utils/constants');

// GET /users/:id
module.exports.getUser = (req, res, next) => {
  const { id } = req.params;
  // const id = req.user._id;

  return User.findById(id)
    .orFail(() => {
      // в версии mongoose 7.0.0+ логика orFail поменялась,
      // теперь метод только 404 возвращает при неудавшемся поиске
      // поэтому валидацию данных перед поиском провожу
      throw new NotFoundError();
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(next);
};

// GET /users
module.exports.getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(STATUS_OK).send({ data: users }))
  .catch(next);

// POST /signup
module.exports.createUser = (req, res, next) => {
  const { password } = req.body;
  return bcrypt.hash(password, 10).then((hash) => User.create({
    ...req.body, password: hash,
  })
    .then((user) => res.status(STATUS_OK_CREATED).send({
      data:
      { // высылаем в ответ всё кроме хэша пароля
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    }))
    .catch(next));
};

// GET /users/me
module.exports.getMe = (req, res, next) => {
  const id = req.user._id;

  return User.findById(id)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(next);
};

// PATCH /users/me
// PATCH /users/me/avatar
module.exports.updateUser = (req, res, next) => {
  // const { id } = req.params;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).orFail(() => {
    throw new NotFoundError();
  })
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch(next);
};
