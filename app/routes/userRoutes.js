const authMiddleware = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/profile', authMiddleware, UserController.getUserProfile);


module.exports = router;