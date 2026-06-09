const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

// 1. Create a new review
const createReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { restaurantId, rating, comment } = req.body;

        // check if restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            const err = new Error("Restaurant not found");
            err.statusCode = 404;
            return next(err);
        }

        // create review (compound index prevents duplicates)
        const review = await Review.create({
            userId,
            restaurantId,
            rating,
            comment
        });

        return res.status(201).json({ success: true, data: review });
    } catch (err) {
        // handle mongo duplicate key error (code 11000) smoothly
        if (err.code === 11000) {
            const error = new Error("You have already reviewed this restaurant");
            error.statusCode = 400;
            return next(error);
        }
        next(err);
    }
};

// 2. Get all reviews for a specific restaurant
const getRestaurantReviews = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;

        const reviews = await Review.find({ restaurantId })
            .populate('userId', 'name') // only get reviewer name
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (err) {
        next(err);
    }
};

// 3. Delete a review
const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            const err = new Error("Review not found");
            err.statusCode = 404;
            return next(err);
        }

        // ownership check: only the author can delete their review
        if (review.userId.toString() !== req.user.id) {
            const err = new Error("Not authorized to delete this review");
            err.statusCode = 403;
            return next(err);
        }

        await review.deleteOne();
        return res.status(200).json({ success: true, message: "Review deleted" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createReview,
    getRestaurantReviews,
    deleteReview
};