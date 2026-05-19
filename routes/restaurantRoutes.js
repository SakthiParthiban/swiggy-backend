const express = require('express');
const router = express.Router();

const {
    getAllRestaurants,
    createRestaurant,
    deleteRestaurant,
    updateRestaurant,
    getRestaurantById
} = require('../controllers/restaurantControllers');

const {
    verifyToken,
    verifyAdmin
} = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Protected Routes (Admin Only)
router.post('/',verifyToken,verifyAdmin,createRestaurant);
router.put('/:id',verifyToken,verifyAdmin,updateRestaurant);
router.delete('/:id',verifyToken,verifyAdmin,deleteRestaurant);

module.exports = router;