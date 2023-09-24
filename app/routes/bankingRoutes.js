const authMiddleware = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();
const BankingController = require('../controllers/bankingController');

router.get('/user/balance', authMiddleware, BankingController.getUserBalance);

module.exports = router;