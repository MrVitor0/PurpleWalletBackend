import express from 'express'
const router = express.Router();
import AuthController from '../controllers/authController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

// Rota para cadastro de usuário
router.post('/register', AuthController.register);

// Rota para login
router.post('/login', AuthController.login);
router.post('/refresh-token', authMiddleware, AuthController.refresh);

export default router;
