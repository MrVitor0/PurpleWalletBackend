import authMiddleware from '../middlewares/authMiddleware.js'
import express from 'express'
const router = express.Router();
import creditController from '../controllers/creditController.js'

//Credit Bill (Parent)
router.post('/user/bill/create', authMiddleware, creditController.generateCreditCardBill);
router.get('/user/bill/list', authMiddleware, creditController.getCreditCardBills);
router.put('/user/bill/pay/:id', authMiddleware, creditController.payCreditCardBill);


//Credit Purchases (Bill Child)
router.post('/user/bill/purchase/create', authMiddleware, creditController.generateCreditCardPurchase);
router.get('/user/bill/purchase/list', authMiddleware, creditController.getCreditCardPurchases);
router.delete('/user/bill/purchase/delete/:id', authMiddleware, creditController.deleteCreditCardPurchase);


export default router;