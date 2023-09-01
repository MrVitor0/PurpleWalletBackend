const authMiddleware = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();
const TravelController = require('../controllers/travelController');

router.post('/purchase/create', authMiddleware, TravelController.savePurchase);



module.exports = router;