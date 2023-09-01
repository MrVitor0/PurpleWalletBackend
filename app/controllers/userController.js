const UserModel = require('../models/userModel');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //remove the password from the user object before sending it to the client
    delete user.dataValues.password;

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


exports.listUsers = async (req, res) => {
  try {
    //get just name and id from the user
    const users = await UserModel.findAll({
      attributes: ['id', 'name'],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};