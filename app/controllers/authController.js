import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../config/config.js'
import BankingModel from '../models/bankingModel.js'
import UserModel from '../models/userModel.js'

const exports = {};
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Verifique se o usuário já existe
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Obtenha o número de rounds do .env
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
    // Criptografe a senha usando o salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Crie um novo usuário
    const user = await UserModel.create({name, email, password: hashedPassword });
    //also create a banking account for the user
    const banking = await BankingModel.create({
      id_user: user.id,
      balance: 0
    });
    // Gere o token JWT
    const payload = { user: { id: user.id, name: user.name, email: email} };
    const token = jwt.sign(payload, config.development.jwtSecret, { expiresIn: '1h' });
    res.json({ 
      message: 'Login successful',
      token: token,
    });
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
    const payload = { user: { id: user.id, name: user.name, email: email } };
    const token = jwt.sign(payload, config.development.jwtSecret, { expiresIn: '1h' });
    res.json({ 
      message: 'Login successful',
      token: token,
     });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.refresh = async (req, res) => {
  try {
    // Verify if the user exists
    const user = await UserModel.findByPk(req.user.id);
    if (!user && !req.token) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Verify if the old token is valid
    jwt.verify(req.token, config.development.jwtSecret, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token has expired, please log in again' });
        } else {
          return res.status(401).json({ message: 'Invalid token' });
        }
      }
      // Generate a new token with the same user information
      const payload = { user: { id: user.id, name: user.name, email: user.email } };
      const newToken = jwt.sign(payload, config.development.jwtSecret, { expiresIn: '1h' });
      res.json({ token: newToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


export default exports;