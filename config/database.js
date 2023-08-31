const Sequelize = require('sequelize');
const config = require('./config.js'); // Arquivo de configuração com as credenciais do banco de dados

const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: 'mysql',
});

module.exports = sequelize;
