const express = require('express');
const router = express.Router();

const { getAllRestaurants,
    createRestaurant, deleteRestaurant, updateRestaurant, getRestaurantById} = require('../controllers/restaurantControllers');

router.get("/restaurants", getAllRestaurants);
router.post("/restaurants", createRestaurant);
router.delete("/restaurants/:id", deleteRestaurant);
router.put('/restaurants/:id', updateRestaurant);
router.get('/restaurants/:id', getRestaurantById);
module.exports = router;