import authMiddleware from '../middlewares/authMiddleware.js'

import express from 'express'
const router = express.Router();
import BankingController from '../controllers/bankingController.js'

router.get('/user/balance', authMiddleware, BankingController.getUserBalance);

//User transactions
router.post('/user/transaction/create', authMiddleware, BankingController.createTransaction);
router.get('/user/transaction/list/:id?', authMiddleware, BankingController.getTransaction);
router.put('/user/transaction/update/:id', authMiddleware, BankingController.updateTransaction);
router.delete('/user/transaction/delete/:id', authMiddleware, BankingController.deleteTransaction);

//Transactions Utils
router.get('/user/transaction/monthly/:month/:year', authMiddleware, BankingController.getMonthlyTransactions);
router.get('/user/transaction/yearly/:year', authMiddleware, BankingController.getYearlyTransactions);


export default router;