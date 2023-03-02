module.exports = class ApplicationError extends Error {
  constructor(status = 500, message = 'Internal Error') {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;

    // чтобы в стектрейсинге на серевере была не общая ошибка Erorr а данные нашей кастомной ошибки
    Error.captureStackTrace(this, this.constructor);
  }
};
