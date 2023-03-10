const router = require('express').Router();
const {
  getUser,
  getUsers,
  updateUser,
  getMe,
} = require('../controllers/users');

const { validateUserDataPartial, validateUserId } = require('../utils/utils');

router.get('/', getUsers);

router.get('/me', getMe);
router.patch('/me', validateUserDataPartial, updateUser);
router.patch('/me/avatar', validateUserDataPartial, updateUser);

router.get('/:id', validateUserId, getUser);

module.exports = router;
