const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const bankingModel = require('./bankingModel');

const bankingBillsModel = sequelize.define('tb_banking_bills', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type_transaction: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  type_payment: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
   amount: {
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

module.exports = bankingBillsModel;
