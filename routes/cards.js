const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { validateDataWithJoi, validateRequiredCardDataWithJoi } = require('../utils/utils');

router.get('/', getCards);
router.post('/', validateRequiredCardDataWithJoi, createCard);
router.delete('/:cardId', validateDataWithJoi, deleteCard);
router.put('/:cardId/likes', validateDataWithJoi, likeCard);
router.delete('/:cardId/likes', validateDataWithJoi, dislikeCard);

module.exports = router;
