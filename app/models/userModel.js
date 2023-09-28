import Sequelize from 'sequelize';
import sequelize from '../../config/database.js';
import BankingModel from './banking/bankingModel.js';
import creditModel from './credit/creditModel.js';

const User = sequelize.define('tb_users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

User.hasMany(BankingModel, {
  foreignKey: 'id_user',
  as: 'banking',
});
User.hasMany(creditModel, {
  foreignKey: 'id_user',
  as: 'credit',
});

export default User;
