import Sequelize from 'sequelize';
import sequelize from '../../config/database.js';
import BankingBillsModel from './bankingBillsModel.js';
import BankingModel from './bankingModel.js';


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

export default User;
