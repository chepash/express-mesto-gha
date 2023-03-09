const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { ERR_STATUS_UNAUTHORIZED } = require('../utils/constants');

// POST /signin
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(ERR_STATUS_UNAUTHORIZED).send({ message: 'Please authorise' });
  }

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    res.status(ERR_STATUS_UNAUTHORIZED).send({ message: 'Please authorise' });
  }

  req.user = payload;
  next();
};
