import sequelize from '../../../config/database.js';
import Sequelize from 'sequelize';
const bankingModel = './bankingModel.js';

const bankingBillsModel = sequelize.define('tb_banking_bills', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_banking: {
    type: Sequelize.INTEGER,
    allowNull: false,
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
  referenceAt: {
    type: Sequelize.DATE,
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


export default bankingBillsModel;
