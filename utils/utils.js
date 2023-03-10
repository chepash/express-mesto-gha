const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

const ApplicationError = require('../errors/ApplicationError');

const { ERR_STATUS_BAD_REQUEST, ERR_STATUS_CONFLICT } = require('./constants');

module.exports.errorHandler = (err, req, res, next) => {
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
    cardId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
});

module.exports.validateRequiredCardData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri().regex(/^https?:\/\/.+/i),
  }),
});

module.exports.validateSignInData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateSignUpData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(/^https?:\/\/.+/i),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
