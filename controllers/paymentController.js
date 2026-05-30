const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');

// create order
const createOrder = async (req, res, next) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            const err = new Error("Valid Amount Required");
            err.statusCode = 400;
            return next(err)
        }
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            order
        })
    }
    catch (err) {
        next(err);
    }
}

// payment verification
const verifyPayment = async (req, res, next) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            const err = new Error("All feilds are required");
            err.statusCode = 400;
            return next(err);
        }

        // genrate signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        // compare signature
        if (expectedSignature !== razorpay_signature) {
            const err = new Error("Payment verification failed");
            err.statusCode = 400;
            return next(err);
        }

        // Fetch order details
        const order = await razorpay.orders.fetch(
            razorpay_order_id
        );

        const existingPayment = await Payment.findOne({
            paymentId: razorpay_payment_id
        });

        if (existingPayment) {
            const err = new Error("Payment already recorded");
            err.statusCode = 400;
            return next(err);
        }
        
        // save payment
        const payment = await Payment.create({
            userId: req.user.userId,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount: order.amount / 100,
            currency: order.currency,
            status: 'success'
        });
        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            payment
        })
    }
    catch (err) {
        next(err);
    }
}
// payment history
const getMyPayments = async (req, res, next) => {
    try {

        const payments = await Payment.find({
            userId: req.user.userId
        })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (err) {
        next(err);
    }
};

module.exports = { createOrder, verifyPayment, getMyPayments };