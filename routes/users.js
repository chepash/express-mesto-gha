const router = require('express').Router();
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
} = require('../controllers/users');

const { validateUserId } = require('../utils/utils');

router.get('/:id', validateUserId);
router.get('/:id', getUser);
router.get('/', getUsers);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUser);

module.exports = router;
