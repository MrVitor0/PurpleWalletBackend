import express from 'express'
const router = express.Router();
import InvestmentController from '../controllers/investmentController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

// Rota para cadastro de usuário
router.get('/wallet/list', authMiddleware, InvestmentController.getInvestments);
router.get('/wallet/list/all', authMiddleware, InvestmentController.getInvestmentsAll);
router.post('/wallet/create', authMiddleware, InvestmentController.createWallet);


router.post('/create', authMiddleware, InvestmentController.createInvestment);
router.put('/edit/:id', authMiddleware, InvestmentController.editInvestment);
router.delete('/delete/:id', authMiddleware, InvestmentController.deleteInvestment);


export default router;
