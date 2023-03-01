const User = require('../models/user');

class UserNotFoundError extends Error { }

module.exports.getUser = (req, res) => {
  // const { id } = req.params;
  const id = req.user._id;

  return User.findById(id)
    .orFail(() => {
      throw new UserNotFoundError('Пользователь по указанному _id не найден.');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof UserNotFoundError) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch((err) => res.status(500).send({ message: err.message }));

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.updateUser = (req, res) => {
  // const { id } = req.params;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).orFail(() => {
    throw new UserNotFoundError('Пользователь по указанному _id не найден.');
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof UserNotFoundError) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
