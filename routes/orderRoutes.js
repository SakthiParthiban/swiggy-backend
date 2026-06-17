const express = require('express');
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
    getAllOrders
} = require('../controllers/orderController');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// secure all order routes
router.use(verifyToken);

// admin routes
router.put('/:id/status', verifyAdmin, updateOrderStatus);
router.get('/admin/all', verifyAdmin, getAllOrders);

// user routes
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

module.exports = router;