const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

const usersRoutes = require('./users');
const cardsRoutes = require('./cards');

router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);

router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

router.use('*', (req, res, next) => {
  const err = new NotFoundError();
  err.message = 'Page not found';
  next(err);
});

module.exports = router;
