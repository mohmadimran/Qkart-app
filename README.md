# QKart — Full-Stack E-Commerce Web Application

**QKart** is a full-stack **MERN e-commerce application** that allows users to register and securely log in, browse and search products, manage their shopping cart, save shipping addresses, and complete the checkout process.

### 🌐 Live Application

**Live Demo:** https://qkart-app-seven.vercel.app/

**GitHub:** https://github.com/mohmadimran/Qkart-app

**Author:** Imrankhan Pathan

---

## ✨ Features

* User registration and login with client-side form validation.
* Secure authentication using **JWT** and hashed passwords.
* Persistent user sessions using `localStorage`.
* Product catalogue with **debounced keyword search**.
* Shopping cart management with quantity updates and item removal.
* Cart state shared between the product catalogue and checkout.
* Conditional rendering based on authentication and cart state.
* Saved shipping address management.
* Multi-step checkout workflow.
* Checkout validation for address and available balance.
* Responsive user interface using **Material UI Grid**.
* Protected API routes using Passport JWT authentication.
* Backend request validation using **Joi**.
* Unit and integration testing using **Jest**.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Material UI
* JavaScript
* HTML5
* CSS3
* localStorage

### Backend

* Node.js
* Express.js
* Mongoose
* Passport.js
* JWT
* Joi

### Database

* MongoDB Atlas

### Testing

* Jest
* Unit Testing
* Integration Testing

### Deployment

* Vercel — Frontend
* Render — Backend API
* MongoDB Atlas — Database

---

## 🏗️ Architecture

QKart follows a **layered backend architecture** that separates routing, request handling, business logic, and database operations.

```text
Client
  │
  ▼
Routes
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Models
  │
  ▼
MongoDB Atlas
```

### Request Flow

```text
Client Request
      ↓
Express Route
      ↓
Validation Middleware
      ↓
Authentication Middleware
      ↓
Controller
      ↓
Service
      ↓
Mongoose Model
      ↓
MongoDB
```

* **Routes** define API endpoints and connect requests to controllers.
* **Middleware** handles request validation and authentication.
* **Controllers** handle HTTP requests and responses.
* **Services** contain the application's business logic.
* **Models** define database schemas and interact with MongoDB.
* **Passport JWT Strategy** protects authenticated routes.

---

## 🔐 Authentication & Authorization

QKart uses **JWT-based authentication** for securing protected resources.

The authentication flow includes:

1. User registers with their account details.
2. Passwords are securely hashed before being stored.
3. User logs in with valid credentials.
4. The backend generates a JWT access token.
5. The frontend stores the token in `localStorage`.
6. The token is sent with protected API requests.
7. Passport's JWT strategy validates the token.
8. Authenticated users can access protected resources such as their profile and cart.

---

## 🔎 Product Search

The product catalogue includes **debounced keyword search** to reduce unnecessary API requests while the user is typing.

```text
User types keyword
       ↓
Debounce delay
       ↓
Search API request
       ↓
Filter products
       ↓
Display results
```

This improves the search experience and avoids sending an API request for every individual keystroke.

---

## 🛒 Shopping Cart

The cart provides complete shopping-cart functionality:

* Add products to cart.
* Increase or decrease product quantity.
* Remove products from the cart.
* View cart contents.
* Maintain cart state across product and checkout screens.
* Proceed to checkout with the selected products.

---

## 💳 Checkout

The checkout workflow supports:

* Shipping address management.
* Multi-step checkout.
* Address validation.
* Balance validation.
* Order placement.
* Clearing or updating cart data after successful checkout.

---

## 🔌 API Overview

| Method | Endpoint            | Description                                  |
| ------ | ------------------- | -------------------------------------------- |
| `POST` | `/v1/auth/register` | Create a new user account                    |
| `POST` | `/v1/auth/login`    | Authenticate user and receive JWT            |
| `GET`  | `/v1/users/:id`     | Fetch authenticated user details             |
| `GET`  | `/v1/cart`          | Get the user's cart                          |
| `POST` | `/v1/cart`          | Add a product to the cart                    |
| `PUT`  | `/v1/cart`          | Update quantity or remove an item            |
| `POST` | `/v1/cart/checkout` | Validate checkout details and place an order |

> **Note:** API endpoints should match the routes implemented in the backend source code.

---

## 📁 Project Structure

```text
Qkart-app/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── config/
│   └── package.json
│
├── public/
│   └── static assets
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── App.js
│
├── package.json
├── setup.sh
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* [Node.js](https://nodejs.org/) v16 or later
* npm
* MongoDB or a MongoDB Atlas account
* Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/mohmadimran/Qkart-app.git

cd Qkart-app
```

---

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=8082
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRATION_MINUTES=30
```

Start the backend server:

```bash
npm start
```

The API will run on:

```text
http://localhost:8082
```

---

### 3. Frontend Setup

Open a new terminal and navigate to the project root:

```bash
cd Qkart-app
```

Install frontend dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
REACT_APP_BASE_URL=http://localhost:8082/v1
```

Start the React application:

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

---

## 🧪 Testing

The backend includes **Jest unit and integration tests**, including tests around checkout functionality.

Run the backend test suite:

```bash
cd backend
npm test
```

---

## ☁️ Deployment

### Frontend — Vercel

The React frontend is deployed on **Vercel**.

SPA rewrite rules are configured so that direct navigation to application routes resolves correctly instead of returning a `404` response.

**Live Application:** https://qkart-app-seven.vercel.app/

### Backend — Render

The Express.js backend is deployed on **Render** and connected to **MongoDB Atlas**.

Environment-specific configuration such as database credentials and JWT secrets is managed through environment variables.

### Database — MongoDB Atlas

MongoDB Atlas is used as the cloud database for storing application data such as:

* Users
* Products
* Cart data
* Orders
* Addresses

---

## 🔒 Environment Variables

Environment variables are used to keep sensitive configuration outside the source code.

### Backend

```env
PORT=8082
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRATION_MINUTES=30
```

### Frontend

```env
REACT_APP_BASE_URL=http://localhost:8082/v1
```

> Never commit `.env` files or sensitive credentials to GitHub.

---

## 📚 What I Practiced

This project helped me strengthen my practical understanding of:

* MERN stack application development.
* React component-based architecture.
* React Router and protected routes.
* REST API integration.
* JWT authentication and authorization.
* Password hashing.
* Express.js middleware.
* Joi request validation.
* Layered backend architecture.
* Mongoose and MongoDB.
* Debounced API search.
* Shopping cart management.
* Multi-step checkout workflows.
* Jest unit and integration testing.
* Environment-based configuration.
* Vercel and Render deployment.

---

## 📄 License

This project was developed as a personal full-stack learning project and is available for educational and reference purposes.

No open-source license has been applied.
