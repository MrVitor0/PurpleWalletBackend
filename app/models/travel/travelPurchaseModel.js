import sequelize from '../../../config/database.js';
import Sequelize from 'sequelize';
import userModel from '../userModel.js';

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



export default travelPurchaseModel;