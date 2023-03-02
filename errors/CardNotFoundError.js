const ApplicationError = require('./ApplicationError');

module.exports = class CardNotFoundError extends ApplicationError {
  constructor() {
    super(404, 'Card not found');
    this.name = 'CardNotFoundError';
  }
};
