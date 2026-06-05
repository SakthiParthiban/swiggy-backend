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

// user routes
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// admin routes
router.put('/:id/status', verifyAdmin, updateOrderStatus);
router.get('/admin/all', verifyAdmin, getAllOrders);

module.exports = router;