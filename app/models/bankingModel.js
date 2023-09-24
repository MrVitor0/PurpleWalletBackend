import sequelize from '../../config/database.js';
import Sequelize from 'sequelize';
import BankingBillsModel from './bankingBillsModel.js';

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

// No modelo BankingModel
bankingModel.hasMany(BankingBillsModel, {
    foreignKey: 'id_banking',
    as: 'banking', 
});
  
export default bankingModel;
