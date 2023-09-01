require('dotenv').config(); // Carregar variáveis de ambiente do .env

module.exports = {
  development: {
    dialect: 'mysql',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
    jwtSecret: process.env.JWT_SECRET,
  },
  test: {
    // ...
  },
  production: {
    // ...
  },
};
