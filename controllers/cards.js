const {
  STATUS_OK,
  STATUS_OK_CREATED,
} = require('../utils/constants');

const Card = require('../models/card');
const CardNotFoundError = require('../errors/CardNotFoundError');

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
    .catch(next);
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new CardNotFoundError();
    })
    .populate(['owner', 'likes'])
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
    throw new CardNotFoundError();
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
    throw new CardNotFoundError();
  })
  .populate(['owner', 'likes'])
  .then((card) => res.status(STATUS_OK).send({ data: card }))
  .catch(next);
