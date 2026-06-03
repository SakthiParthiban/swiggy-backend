const express = require('express');
const router = express.Router();

const {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require('../controllers/cartController');

const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken); 

// Endpoints Mapping
router.post('/add', addToCart);
router.get('/', getCart);
router.put('/update', updateCartItem);
router.delete('/remove/:menuId', removeCartItem);
router.delete('/clear', clearCart);

module.exports = router;