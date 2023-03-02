const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { validateCardId } = require('../utils/utils');

router.get('/', getCards);
router.post('/', createCard);

router.delete('/:cardId', validateCardId);
router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', validateCardId);
router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', validateCardId);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
