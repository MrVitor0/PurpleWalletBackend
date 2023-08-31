const jwt = require('jsonwebtoken');
const config = require('../../config/config'); // Importe suas configurações de JWT
const UserModel = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifique se o usuário já existe
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Crie um novo usuário
    const newUser = await UserModel.create({ email, password });

    // Gere o token JWT
    const payload = { user: { id: newUser.id } };
    const token = jwt.sign(payload, config.development.jwtSecret, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Faça a autenticação do usuário (exemplo simples)
    const user = await UserModel.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Gere o token JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
