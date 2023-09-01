const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const UserModel = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Verifique se o usuário já existe
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Obtenha o número de rounds do .env
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    // Criptografe a senha usando o salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Crie um novo usuário
    const newUser = await UserModel.create({ email, password: hashedPassword });
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
    // Verifique se o usuário existe
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Verifique a senha criptografada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Gere o token JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, config.development.jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
