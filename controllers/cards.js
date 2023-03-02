const {
  ERR_STATUS_BAD_REQUEST,
  ERR_STATUS_NOT_FOUND,
  ERR_STATUS_INTERNAL_SERVER,
  STATUS_OK,
  STATUS_OK_CREATED,
} = require('../utils/constants');

const Card = require('../models/card');
// const CardNotFoundError = require('../errors/CardNotFoundError');

module.exports.getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(STATUS_OK).send({ data: cards }))
  .catch((err) => res.status(ERR_STATUS_INTERNAL_SERVER).send({ message: `Internal server error ${err}` }));

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_OK_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_STATUS_BAD_REQUEST).send({ message: `Error validating data for card create: ${err}` });
      } else {
        res.status(ERR_STATUS_INTERNAL_SERVER).send({ message: `Internal server error ${err}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove(cardId)
    .populate(['owner', 'likes'])
    .then((cards) => res.status(STATUS_OK).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_STATUS_NOT_FOUND).send({ message: 'Card not found' });
      } else if (err.name === 'ValidationError') {
        res.status(ERR_STATUS_BAD_REQUEST).send({ message: `Error validating data for card create: ${err}` });
      } else {
        res.status(ERR_STATUS_INTERNAL_SERVER).send({ message: `Internal server error ${err}` });
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((card) => res.status(STATUS_OK).send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERR_STATUS_NOT_FOUND).send({ message: 'Card not found' });
    } else if (err.name === 'ValidationError') {
      res.status(ERR_STATUS_BAD_REQUEST).send({ message: `Error validating data for card like/dislike: ${err}` });
    } else {
      res.status(ERR_STATUS_INTERNAL_SERVER).send({ message: `Internal server error ${err}` });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((card) => res.status(STATUS_OK).send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERR_STATUS_NOT_FOUND).send({ message: 'Card not found' });
    } else if (err.name === 'ValidationError') {
      res.status(ERR_STATUS_BAD_REQUEST).send({ message: `Error validating data for card like/dislike: ${err}` });
    } else {
      res.status(ERR_STATUS_INTERNAL_SERVER).send({ message: `Internal server error ${err}` });
    }
  });
