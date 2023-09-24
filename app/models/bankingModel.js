const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const userModel = require('./userModel');
const BankingBillsModel = require('./bankingBillsModel');
const bankingModel = sequelize.define('tb_banking', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_user: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  balance: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

// Defina o relacionamento com userModel
bankingModel.belongsTo(userModel, {
    foreignKey: 'id_user',
    targetKey: 'id',
    as: 'user'
});

// No modelo BankingModel
bankingModel.hasMany(BankingBillsModel, {
    foreignKey: 'id_banking',
    as: 'banking', 
});
  

module.exports = bankingModel;
