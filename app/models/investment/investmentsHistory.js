import sequelize from '../../../config/database.js';
import Sequelize from 'sequelize';
import investmentsModel from '../investment/investmentsModel.js';


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

// Defina o relacionamento com investmentsModel
investmentsHistoryModel.belongsTo(investmentsModel, {
    foreignKey: 'id_investments',
    targetKey: 'id',
    as: 'investments'
});


export default investmentsHistoryModel;
