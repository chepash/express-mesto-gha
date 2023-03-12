const mongoose = require('mongoose');

const ApplicationError = require('../errors/ApplicationError');

const { ERR_STATUS_BAD_REQUEST } = require('./constants');

module.exports.appErrorHandler = (err, req, res, next) => {
  // в теории советуют работать именно с инстансами классов
  // а не c именами ошибок
  if (err instanceof mongoose.Error.CastError) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: err.message });
    return;
  }

  //
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
