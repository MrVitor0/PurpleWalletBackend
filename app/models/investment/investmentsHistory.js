import sequelize from '../../../config/database.js';
import Sequelize from 'sequelize';

const investmentsHistoryModel = sequelize.define('tb_investments_history', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_investments: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  subtitle: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  aport: {
        type: Sequelize.DOUBLE,
        allowNull: false,
  },
  objective: {
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

export default investmentsHistoryModel;
