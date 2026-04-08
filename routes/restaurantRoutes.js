const express = require('express');
const router = express.Router();

const { getAllRestaurants,
    createRestaurant,
    deleteRestaurant,
    updateRestaurant,
    getRestaurantById } = require('../controllers/restaurantControllers');

const {verifyToken, verifyAdmin} = require('../middleware/authMiddleware');

// public routes 
router.get("/restaurants", getAllRestaurants);
router.get('/restaurants/:id', getRestaurantById);

// protected routes - login + admin
router.post("/restaurants", verifyToken, verifyAdmin, createRestaurant);
router.delete("/restaurants/:id", verifyToken, verifyAdmin, deleteRestaurant);
router.put('/restaurants/:id', verifyToken, verifyAdmin, updateRestaurant);

module.exports = router;