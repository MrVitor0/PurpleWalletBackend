const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const userModel = require('./userModel');

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
  payerId: {
    type: Sequelize.BIGINT,
    defaultValue: false
  }
});
// Defina o relacionamento com travelPurchaseModel
travelPurchaseModel.belongsTo(userModel, {
  foreignKey: 'payerId',
  targetKey: 'id',
  as: 'payer'
});



module.exports = travelPurchaseModel;
