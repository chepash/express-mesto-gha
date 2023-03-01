const User = require('../models/user');

module.exports.getUser = (req, res) => {
  // const { id } = req.params;
  const id = req.user._id;

  User.findById(id)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  // const { id } = req.params;
  const id = req.user._id;

  User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
