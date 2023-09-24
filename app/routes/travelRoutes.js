import authMiddleware from '../middlewares/authMiddleware.js'

import express from 'express'
const router = express.Router();;
import TravelController from '../controllers/travelController.js'

router.post('/purchase/create', authMiddleware, TravelController.savePurchase);
router.get('/purchase/retrieve', authMiddleware, TravelController.retrievePurchases);
router.get('/purchase/retrieve/debts', authMiddleware, TravelController.retrieveUserDebts);
router.get('/purchase/retrieve/receives', authMiddleware, TravelController.retrieveEarnings);


router.delete('/purchase/delete/:id', authMiddleware, TravelController.deletePurchase);

export default router;