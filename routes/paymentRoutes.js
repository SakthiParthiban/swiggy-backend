const express = require('express');
const router = express.Router();

const {createOrder} = require('../controllers/paymentController');
const {verifyToken} = require('../middleware/authMiddleware');

router.post('/create-order',verifyToken,createOrder);

module.exports = router;