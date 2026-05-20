const rateLimit = require('express-rate-limit');

// General Api limiter
const apiLimiter = rateLimit({
    windowMs: 15*60*1000,
    max:100,
    standardHeaders:true,
    legacyHeaders:false,

    message:{
        success:false,
        message:"too many request, please try again after 15 minutes"
        }
});

// Strict limiter - login/signup route
const authLimiter = rateLimit({
    windowMs: 15*60*1000,
    max:5,
    standardHeaders:true,
    legacyHeaders:false,

    message:{
        success:false,
        message:"too many login attempt, please try again after 15 minutes"
    }
})

module.exports = {apiLimiter,authLimiter};