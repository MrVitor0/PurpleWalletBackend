const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const userModel = require('./userModel');
const travelPurchaseModel = require('./travelPurchaseModel');

const travelDebtsModel = sequelize.define('tb_trl_debts', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_user: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  id_trv_purchase: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  amount: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  }
});

// Defina o relacionamento com userModel
travelDebtsModel.belongsTo(userModel, {
    foreignKey: 'id_user',
    targetKey: 'id',
    as: 'user'
});

// // Defina o relacionamento com travelPurchaseModel
travelDebtsModel.belongsTo(travelPurchaseModel, {
  foreignKey: 'id_trv_purchase',
  targetKey: 'id',
  as: 'travelPurchase'
});


module.exports = travelDebtsModel;
