const router = require('express').Router();
const {
  getUser,
  getUsers,
  updateUser,
  getMe,
} = require('../controllers/users');

const { validateUserId, validateAvatarUrl } = require('../utils/utils');

router.get('/', getUsers);

router.get('/me', getMe);
router.patch('/me', updateUser);
router.patch('/me/avatar', validateAvatarUrl, updateUser);
router.get('/:id', validateUserId, getUser);

module.exports = router;
