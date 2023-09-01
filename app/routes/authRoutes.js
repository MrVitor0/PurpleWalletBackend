const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para cadastro de usuário
router.post('/register', AuthController.register);

// Rota para login
router.post('/login', AuthController.login);
router.post('/refresh-token', authMiddleware, AuthController.refresh);

module.exports = router;
