const express = require('express');
const router = express.Router();

const {createOrder,verifyPayment,getMyPayments} = require('../controllers/paymentController');
const {verifyToken} = require('../middleware/authMiddleware');

router.post('/create-order',verifyToken,createOrder);
router.post('/verify-payment',verifyToken,verifyPayment);
router.get('/history',verifyToken,getMyPayments);

module.exports = router;