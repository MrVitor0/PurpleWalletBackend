import sequelize from '../../config/database.js';
import Sequelize from 'sequelize';
import travelPurchaseModel from './travelPurchaseModel.js';
import userModel from './userModel.js';

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

export default travelDebtsModel;