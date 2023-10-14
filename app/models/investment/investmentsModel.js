import sequelize from '../../../config/database.js';
import Sequelize from 'sequelize';
import investmentsHistoryModel from '../investment/investmentsHistory.js';

const investmentModel = sequelize.define('tb_investments', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_user: {
    type: Sequelize.BIGINT,
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
  
investmentModel.hasMany(investmentsHistoryModel, {
    foreignKey: 'id_investments',
    as: 'investments',
});


export default investmentModel;
