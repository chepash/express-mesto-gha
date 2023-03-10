const mongoose = require('mongoose');
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const ApplicationError = require('../errors/ApplicationError');

const { ERR_STATUS_BAD_REQUEST, ERR_STATUS_CONFLICT } = require('./constants');

module.exports.errorHandler = (err, req, res, next) => {
  console.log('err.constructor - ', err.constructor);
  console.log('err.constructor.name - ', err.constructor.name);
  console.log('err itself - ', err);
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

  next();
};

module.exports.validateUserId = celebrate({
  params: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
});

module.exports.validateCardId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.cardId)) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: 'Invalid card id' });
    return;
  }

  next();
};

module.exports.validateDataWithJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(/^https?:\/\/.+/i),
    link: Joi.string().uri().regex(/^https?:\/\/.+/i),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
  params: Joi.object().keys({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
});

// module.exports.validateAvatarUrl = celebrate({
//   body: Joi.object({
//     avatar: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
//   }),
// });

module.exports.validateCardUrl = (req, res, next) => {
  if (!validator.isURL(req.body.link)) {
    res.status(ERR_STATUS_BAD_REQUEST).send({ message: 'Invalid card url' });
    return;
  }

  next();
};
