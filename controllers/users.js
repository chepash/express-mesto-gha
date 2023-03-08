const bcrypt = require('bcrypt');
const User = require('../models/user');
const UserNotFoundError = require('../errors/UserNotFoundError');
const {
  STATUS_OK,
  STATUS_OK_CREATED,
} = require('../utils/constants');

module.exports.getUser = (req, res, next) => {
  const { id } = req.params;
  // const id = req.user._id;

  return User.findById(id)
    .orFail(() => {
      throw new UserNotFoundError();
    })
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(next);
};

module.exports.getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(STATUS_OK).send({ data: users }))
  .catch(next);

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  return bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  })
    .then((user) => res.status(STATUS_OK_CREATED).send({ data: user }))
    .catch(next));
};

module.exports.updateUser = (req, res, next) => {
  // const { id } = req.params;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).orFail(() => {
    throw new UserNotFoundError();
  })
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch(next);
};
