const router = require('express').Router();
const {
  getUser,
  getUsers,
  updateUser,
  getMe,
} = require('../controllers/users');

const { validateDataWithJoi } = require('../utils/utils');

router.get('/', getUsers);

router.get('/me', getMe);
router.patch('/me', validateDataWithJoi, updateUser);
router.patch('/me/avatar', validateDataWithJoi, updateUser);

router.get('/:id', validateDataWithJoi, getUser);

module.exports = router;
