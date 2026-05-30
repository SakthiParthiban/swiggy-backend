const razorpay = require('../config/razorpay');

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
            options
        })
    }
    catch (err) {
        next(err);
    }
}

module.exports = { createOrder };