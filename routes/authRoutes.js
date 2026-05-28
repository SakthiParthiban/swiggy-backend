const express = require('express');
const router = express.Router();

const { signup,login,forgotPassword,resetPassword} = require('../controllers/authController');
const {authLimiter} = require('../middleware/rateLimiter')

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);
router.get('/test', (req, res) => {
   res.json({ message: "Auth route working" });
});
module.exports = router;