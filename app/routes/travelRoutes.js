const authMiddleware = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();
const TravelController = require('../controllers/travelController');

router.post('/purchase/create', authMiddleware, TravelController.savePurchase);
router.get('/purchase/retrieve', authMiddleware, TravelController.retrievePurchases);
router.get('/purchase/retrieve/debts', authMiddleware, TravelController.retrieveUserDebts);
router.get('/purchase/retrieve/receives', authMiddleware, TravelController.retrieveEarnings);


router.delete('/purchase/delete/:id', authMiddleware, TravelController.deletePurchase);

module.exports = router;