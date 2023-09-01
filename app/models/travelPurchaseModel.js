const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const travelPurchaseModel = sequelize.define('tb_trl_purchases', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.BIGINT,
    allowNull: true,
  },
  amount: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  isPaid: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = travelPurchaseModel;
