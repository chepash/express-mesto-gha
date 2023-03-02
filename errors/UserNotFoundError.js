const ApplicationError = require('./ApplicationError');
const { ERR_STATUS_NOT_FOUND } = require('../utils/constants');

module.exports = class UserNotFoundError extends ApplicationError {
  constructor() {
    super(ERR_STATUS_NOT_FOUND, 'User not found');
    this.name = 'UserNotFoundError';
  }
};
