const ApplicationError = require('./ApplicationError');

module.exports = class UserNotFoundError extends ApplicationError {
  constructor() {
    super(404, 'User not found');
    this.name = 'UserNotFoundError';
  }
};
