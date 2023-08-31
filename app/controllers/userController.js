const UserModel = require('../models/userModel');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Envie os detalhes do usuário na resposta
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
