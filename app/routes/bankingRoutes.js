import authMiddleware from '../middlewares/authMiddleware.js'

import express from 'express'
const router = express.Router();
import BankingController from '../controllers/bankingController.js'

router.get('/user/balance', authMiddleware, BankingController.getUserBalance);

//User transactions
router.post('/user/transaction/create', authMiddleware, BankingController.createTransaction);

export default router;