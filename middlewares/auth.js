const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const AuthorizationError = require('../errors/AuthorizationError');

// POST /signin
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthorizationError();
  }

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch {
    throw new AuthorizationError();
  }

  req.user = payload;
  console.log('AUTH req.user : ', req.user);
  next();
};
