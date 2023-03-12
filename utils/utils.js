const mongoose = require('mongoose');

const ApplicationError = require('../errors/ApplicationError');

const { ERR_STATUS_BAD_REQUEST, ERR_STATUS_CONFLICT } = require('./constants');

module.exports.appErrorHandler = (err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: err.message });
    return;
  }
  if (err instanceof mongoose.Error.CastError) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: err.message });
    return;
  }

  if (err.code === 11000) {
    res.status(ERR_STATUS_CONFLICT).send({ message: 'User with this email already exist' });
    return;
  }

  if (err instanceof ApplicationError) {
    res.status(err.status).send({ message: err.message });
    return;
  }

  if (err) {
    const defautlError = new ApplicationError();
    res.status(defautlError.status).send({ message: defautlError.message });
    return;
  }

  next();
};
