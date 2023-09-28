import sequelize from '../../../config/database.js';
import Sequelize from 'sequelize';
import creditPurchasesModel from './creditPurchasesModel.js';

const creditModel = sequelize.define('tb_credits', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_user: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  isClosed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  isPaid: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  amount: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  reference: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    validate: {
        isUniqueMonth: async function () {
            //create iso date in format 2023-09-01 00:00:00
            let date = new Date(this.reference)
            const existingRecord = await creditModel.findOne({
            where: {
                id_user: this.id_user,
                reference: date,
            },
            });
            if (existingRecord) {
             throw new Error('Você já possui um crédito para este mês e ano.');
            }
        },
        },
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

// No modelo creditModel
creditModel.hasMany(creditPurchasesModel, {
    foreignKey: 'id_credit',
    as: 'credit', 
});
  
export default creditModel;
