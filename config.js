require('dotenv').config();

const { JWT_SECRET = '3639eb56b2b25ffaa712df68aa92173c5abfab3b4c6f6ea8b42e93c2cbab0124' } = process.env;
const { PORT = '3005' } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

module.exports = {
  JWT_SECRET,
  PORT,
  DB_ADDRESS,
};
