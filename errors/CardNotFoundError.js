const ApplicationError = require('./ApplicationError');
const { ERR_STATUS_NOT_FOUND } = require('../utils/constants');

module.exports = class CardNotFoundError extends ApplicationError {
  constructor() {
    super(ERR_STATUS_NOT_FOUND, 'Card not found');
    this.name = 'CardNotFoundError';
  }
};
