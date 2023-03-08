require('dotenv').config();

const { JWT_SECRET = 'JWT_SECRET_IF_NOT_FOUND_IN_.env' } = process.env;
const { PORT = '3000' } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

module.exports = {
  JWT_SECRET,
  PORT,
  DB_ADDRESS,
};
