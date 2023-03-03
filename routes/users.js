const router = require('express').Router();
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
} = require('../controllers/users');

const { validateUserId, validateAvatarUrl } = require('../utils/utils');

router.get('/:id', validateUserId, getUser);
router.get('/', getUsers);
router.post('/', validateAvatarUrl, createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', validateAvatarUrl, updateUser);

module.exports = router;
