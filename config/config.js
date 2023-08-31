require('dotenv').config(); // Carregar variáveis de ambiente do .env

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    jwtSecret: process.env.JWT_SECRET,
  },
  test: {
    // ...
  },
  production: {
    // ...
  },
};
