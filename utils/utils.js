const CastError = require('mongoose/lib/error/cast');
const ValidationError = require('mongoose/lib/error/validation');

const {
  ERR_STATUS_BAD_REQUEST,
  // ERR_STATUS_NOT_FOUND,
  ERR_STATUS_INTERNAL_SERVER,
  // STATUS_OK,
  // STATUS_OK_CREATED,
} = require('./constants');

module.exports.errorHandler = (req, res, err) => {
  if (err instanceof ValidationError) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: err.message });
  } else if (err instanceof CastError) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: err.message });
  } else {
    res.status(ERR_STATUS_INTERNAL_SERVER).send({ message: err.message });
  }
};
