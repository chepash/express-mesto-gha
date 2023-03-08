const mongoose = require('mongoose');
const validator = require('validator');

const ApplicationError = require('../errors/ApplicationError');

const { ERR_STATUS_BAD_REQUEST } = require('./constants');

module.exports.errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: err.message });
    return;
  }
  if (err instanceof mongoose.Error.CastError) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: err.message });
    return;
  }
  if (err instanceof ApplicationError) {
    res.status(err.status).send({ message: err.message });
    return;
  }

  next();
};

module.exports.validateUserId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: 'Invalid user id' });
    return;
  }

  next();
};

module.exports.validateCardId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.cardId)) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: 'Invalid card id' });
    return;
  }

  next();
};

module.exports.validateAvatarUrl = (req, res, next) => {
  if (!validator.isURL(req.body.avatar)) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: 'Invalid avatar url' });
    return;
  }

  next();
};

module.exports.validateCardUrl = (req, res, next) => {
  if (!validator.isURL(req.body.link)) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: 'Invalid card url' });
    return;
  }

  next();
};
