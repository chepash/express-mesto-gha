const mongoose = require('mongoose');
const {
  STATUS_OK,
  STATUS_OK_CREATED,
} = require('../utils/constants');

const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const WrongCardOwnerError = require('../errors/WrongCardOwnerError');

// GET /cards
module.exports.getCards = (req, res, next) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(STATUS_OK).send({ data: cards }))
  .catch(next);

// POST /cards
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_OK_CREATED).send({ data: card }))
    .catch((err) => {
      // прошлый способ мне нравился больше, когда я использовал:
      // if (err instanceof mongoose.Error.ValidationError)
      // в централизованном обработчике ошибок.
      // А так получается приходится дублировать код в нескольких местах для валидации монги.
      if (err instanceof mongoose.Error.ValidationError) {
        const validationError = new BadRequestError();
        validationError.message = err.message;
        next(validationError);
      } else {
        next(err);
      }
    });
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  return Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError();
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        return card.deleteOne();
      }
      throw new WrongCardOwnerError();
    })
    .then((cards) => res.status(STATUS_OK).send({ data: cards }))
    .catch(next);
};

// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFoundError();
  })
  .populate(['owner', 'likes'])
  .then((card) => res.status(STATUS_OK).send({ data: card }))
  .catch(next);

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFoundError();
  })
  .populate(['owner', 'likes'])
  .then((card) => res.status(STATUS_OK).send({ data: card }))
  .catch(next);
