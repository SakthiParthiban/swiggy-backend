const jwt = require('jsonwebtoken');

// Verify JWT Token
const verifyToken = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        // Check token existence
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const err = new Error("No token provided");
            err.statusCode = 401;
            return next(err);
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request
        req.user = decoded;

        next();

    } catch (err) {

        err.statusCode = 401;
        err.message = "Invalid or expired token";

        next(err);
    }
};

// Verify Admin Role
const verifyAdmin = (req, res, next) => {

    if (!req.user || req.user.role !== "admin") {

        const err = new Error("Admin access only");
        err.statusCode = 403;

        return next(err);
    }

    next();
};

module.exports = {
    verifyToken,
    verifyAdmin
};