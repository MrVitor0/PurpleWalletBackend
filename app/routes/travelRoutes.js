const authMiddleware = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();
const TravelController = require('../controllers/travelController');

router.post('/purchase/create', authMiddleware, TravelController.savePurchase);
router.get('/purchase/retrieve', authMiddleware, TravelController.retrievePurchases);


module.exports = router;