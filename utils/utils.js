const CastError = require('mongoose/lib/error/cast');
const ValidationError = require('mongoose/lib/error/validation');
const ObjectId = require('mongoose');
const ApplicationError = require('../errors/UserNotFoundError');

const {
  ERR_STATUS_BAD_REQUEST,
  ERR_STATUS_NOT_FOUND,
  ERR_STATUS_INTERNAL_SERVER,
  // STATUS_OK,
  // STATUS_OK_CREATED,
} = require('./constants');

module.exports.errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: err.message });
  } else if (err instanceof CastError) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: err.message });
  } else if (err instanceof ApplicationError) {
    res.status(ERR_STATUS_NOT_FOUND).send({ message: err.message });
  } else {
    res.status(ERR_STATUS_INTERNAL_SERVER).send({ message: err.message });
  }

  next();
};

module.exports.validateUserId = (req, res, next) => {
  if (!ObjectId.isValidObjectId(req.params.id)) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: 'Invalid user id' });
    return;
  }

  next();
};

module.exports.validateCardId = (req, res, next) => {
  if (!ObjectId.isValidObjectId(req.params.cardId)) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: 'Invalid card id' });
    return;
  }

  next();
};
