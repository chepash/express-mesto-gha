const Card = require('../models/card');
const CardNotFoundError = require('../errors/CardNotFoundError');

module.exports.getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(200).send({ data: cards }))
  .catch((err) => res.status(500).send({ message: `Internal server error ${err}` }));

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .populate(['owner', 'likes'])
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(500).send({ message: `Internal server error ${err}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove(cardId)
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(500).send({ message: `Internal server error ${err}` });
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    } else if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
    } else {
      res.status(500).send({ message: `Internal server error ${err}` });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new CardNotFoundError();
  })
  .populate(['owner', 'likes'])
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err instanceof CardNotFoundError) {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    } else if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
    } else {
      res.status(500).send({ message: `Internal server error ${err}` });
    }
  });
