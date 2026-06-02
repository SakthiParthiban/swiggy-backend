const express = require('express');
const router = express.Router();

const {
    createMenuItem,
    getMenuByRestaurant,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/menuController');

const {
    verifyToken,
    verifyAdmin
} = require('../middleware/authMiddleware');

const { upload } = require('../config/cloudinary');

// Public Routes
router.get('/restaurant/:restaurantId', getMenuByRestaurant);
router.get('/:menuId', getMenuItemById);

// Protected Routes
router.post(
    '/',
    verifyToken,
    verifyAdmin,
    upload.single('image'),
    createMenuItem
);

router.put(
    '/:menuId',
    verifyToken,
    verifyAdmin,
    upload.single('image'),
    updateMenuItem
);

router.delete(
    '/:menuId',
    verifyToken,
    verifyAdmin,
    deleteMenuItem
);

module.exports = router;