# Swiggy Backend API 🍔

A production-ready REST API built with Node.js, Express, and MongoDB.

## 🚀 Live API
[Railway URL here]

## 🛠️ Tech Stack
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication
- Cloudinary (File Uploads)
- Nodemailer (Email/OTP)
- Bcrypt + SHA256 (Security)

## ✨ Features
- Full CRUD REST API
- JWT Authentication
- Role Based Access Control (Admin/User)
- Password Reset with OTP Email
- Image Upload to Cloudinary
- API Rate Limiting
- MVC Architecture

## 📁 Project Structure
```
swiggy-backend/
├── server.js
├── config/
│   ├── cloudinary.js
│   └── emailConfig.js
├── controllers/
│   ├── authController.js
│   └── restaurantController.js
├── middleware/
│   ├── authMiddleware.js
│   └── rateLimiter.js
├── models/
│   ├── User.js
│   └── Restaurant.js
└── routes/
    ├── authRoutes.js
    └── restaurantRoutes.js
```

## 🔐 API Endpoints

### Auth Routes
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/forgot-password | Public |
| POST | /api/auth/reset-password | Public |

### Restaurant Routes
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/restaurants | Public |
| GET | /api/restaurants/:id | Public |
| POST | /api/restaurants | Admin |
| PUT | /api/restaurants/:id | Admin |
| DELETE | /api/restaurants/:id | Admin |

## ⚙️ Environment Variables
```
MONGO_URI=
PORT=
JWT_SECRET=
JWT_EXPIRE=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

## 👨‍💻 Developer
Sakthi Parthiban— Backend Developer