const express = require('express');
const router = express.Router();

const {
    createReview,
    getRestaurantReviews,
    deleteReview
} = require('../controllers/reviewController');

const { verifyToken } = require('../middleware/authMiddleware');

// public route - anyone can read reviews
router.get('/restaurant/:restaurantId', getRestaurantReviews);

// protected routes - logging in is mandatory
router.post('/add', verifyToken, createReview);
router.delete('/:id', verifyToken, deleteReview);

module.exports = router;