const express = require('express');
const router = express.Router();

const { getAllRestaurants,
    createRestaurant, deleteRestaurant, updateRestaurant} = require('../controllers/restaurantControllers');

router.get("/restaurants", getAllRestaurants);
router.post("/restaurants", createRestaurant);
router.delete("/restaurants/:id", deleteRestaurant);
router.put('/restaurants/:id', updateRestaurant);
module.exports = router;