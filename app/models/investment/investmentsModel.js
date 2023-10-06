import sequelize from '../../../config/database.js';
import Sequelize from 'sequelize';

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
  
export default investmentModel;
