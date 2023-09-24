import config from '../../config/config.js';
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Authorization denied' });
  }
  // Remova o prefixo "Bearer " do token
  const tokenWithoutBearer = token.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(tokenWithoutBearer, config.development.jwtSecret);
    console.log('decoded', decoded);
    req.user = decoded.user;
    req.token = tokenWithoutBearer;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;


