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
