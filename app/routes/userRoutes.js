import authMiddleware from '../middlewares/authMiddleware.js'

import express from 'express'
const router = express.Router();
import UserController from '../controllers/userController.js'

router.get('/profile', authMiddleware, UserController.getUserProfile);
router.get('/list', authMiddleware, UserController.listUsers)

export default router;