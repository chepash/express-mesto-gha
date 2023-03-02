const User = require('../models/user');
const UserNotFoundError = require('../errors/UserNotFoundError');

module.exports.getUser = (req, res) => {
  const { id } = req.params;
  // const id = req.user._id;

  return User.findById(id)
    .orFail(() => {
      throw new UserNotFoundError();
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof UserNotFoundError) {
        res.status(err.status).send({ message: err.message });
      } else {
        res.status(500).send({ message: `Internal server error: ${err}` });
      }
    });
};

module.exports.getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch((err) => res.status(500).send({ message: `Internal server error: ${err}` }));

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Error validating data for user create: ${err}` });
      } else {
        res.status(500).send({ message: `Internal server error: ${err}` });
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
    throw new UserNotFoundError();
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof UserNotFoundError) {
        res.status(err.status).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Error validating data user update: ${err}` });
      } else {
        res.status(500).send({ message: `Internal server error: ${err}` });
      }
    });
};
