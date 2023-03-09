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
router.get('/:id', validateUserId, getUser);
router.patch('/me/avatar', validateAvatarUrl, updateUser);

module.exports = router;
