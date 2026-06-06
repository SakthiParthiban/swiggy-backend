# Swiggy Backend API 🍔

A production-ready REST API built with Node.js, Express, and MongoDB, replicating real-world food delivery app mechanics.

## 🚀 Live API
[Railway URL here]

## 🛠️ Tech Stack
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication
- Cloudinary (File Uploads)
- Razorpay Payment Gateway Integration
- Nodemailer (Email/OTP)
- Bcrypt + SHA256 (Security)

## ✨ Features
- Full CRUD REST API
- JWT Authentication & Role-Based Access Control (Admin/User)
- Password Reset via Secure Email OTP
- Image Upload Architecture with Cloudinary Integration
- Multi-Restaurant Cart Management (Strict Single-Restaurant Ordering Constraints)
- Backend Price Recalculation Engine (Failsafe against Front-end Price Tampering)
- Snapshot Pattern Order Placement (Locks item prices at time of order)
- API Rate Limiting & Helmet Security Headers
- Modular MVC Architecture

## 📁 Project Structure
swiggy-backend/
├── server.js
├── config/
│   ├── db.js
│   ├── cloudinary.js
│   ├── emailConfig.js
│   └── razorpay.js
├── controllers/
│   ├── authController.js
│   ├── restaurantController.js
│   ├── menuController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── paymentController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── rateLimiter.js
│   └── errorMiddleware.js
├── models/
│   ├── User.js
│   ├── Restaurant.js
│   ├── Menu.js
│   ├── Cart.js
│   ├── Order.js
│   └── Payment.js
└── routes/
├── authRoutes.js
├── restaurantRoutes.js
├── menuRoutes.js
├── cartRoutes.js
├── orderRoutes.js
└── paymentRoutes.js


## 🔐 API Endpoints

### Auth Routes
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/forgot-password | Public |
| POST | /api/auth/reset-password | Public |

### Restaurant & Menu Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/restaurants | Public | Get all with filter, search, & pagination |
| GET | /api/restaurants/:id | Public | Get restaurant details |
| POST | /api/restaurants | Admin | Create with Cloudinary upload |
| PUT / DELETE | /api/restaurants/:id | Admin | Update / Delete restaurant |
| GET | /api/menu/restaurant/:id | Public | Get menu items by restaurant |
| POST / PUT / DELETE | /api/menu... | Admin | Manage menu items |

### Cart Routes (Authenticated)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/cart/add | User | Add item to cart (Enforces single-restaurant rule) |
| GET | /api/cart | User | Get logged-in user's cart (With Mongoose Populate) |
| PUT | /api/cart/update | User | Update item quantity in cart |
| DELETE | /api/cart/remove/:menuId | User | Remove single item from cart |
| DELETE | /api/cart/clear | User | Clear cart entirely |

### Order Routes (Authenticated)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/orders | User | Place order from cart & snapshot prices |
| GET | /api/orders | User | Get personal order history |
| GET | /api/orders/:id | User | Get single order details |
| PUT | /api/orders/:id/cancel | User | Cancel order (Only if status is 'Placed') |
| PUT | /api/orders/:id/status | Admin | Update delivery lifecycle status |
| GET | /api/orders/admin/all | Admin | Monitor all system orders |

### Payment Routes (Authenticated)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/payment/create | User | Generate Razorpay transaction order |
| POST | /api/payment/verify | User | Cryptographic signature verification & recording |
| GET | /api/payment/history | User | View personal payment logs |

## ⚙️ Environment Variables
MONGO_URI=
PORT=
JWT_SECRET=
JWT_EXPIRE=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=


## 👨‍💻 Developer
Sakthi Parthiban — Full-Stack/Backend Developer