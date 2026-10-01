# 🖼️ Image Processing Platform — Backend API

Welcome to the backend service for the **Image Processing Platform**. This service provides a RESTful API powering user authentication, image uploading/processing via Cloudinary, and image history management using Express and MongoDB.

---

## 📋 Table of Contents

- [Architecture & Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Environment Variables (.env)](#-environment-variables-env)
- [API Endpoints Reference](#-api-endpoints-reference)
  - [Health Check](#health-check)
  - [Authentication (`/api/auth`)](#authentication-apiauth)
  - [Image Management (`/api/images`)](#image-management-apiimages)
  - [History Management (`/api/history`)](#history-management-apihistory)
- [Available Scripts](#-available-scripts)

---

## 🛠 Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/) (v18+ recommended)
- **Web Framework:** [Express.js](https://expressjs.com/) (v5)
- **Database & ODM:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication & Security:** 
  - JWT (`jsonwebtoken`)
  - Password Hashing (`bcryptjs`)
  - HTTP Headers (`helmet`)
  - Cross-Origin Resource Sharing (`cors`)
  - Brute Force & Rate Limiting (`express-rate-limit`)
- **File Uploads & Media Storage:** [Multer](https://github.com/expressjs/multer) & [Cloudinary SDK](https://cloudinary.com/) (with `streamifier`)
- **Mailing:** [Nodemailer](https://nodemailer.com/) (for OTP email verification & password resets)
- **Validation:** `express-validator` & `zod`
- **Logging:** `morgan`

---

## 📁 Project Directory Structure

```text
backend/
├── .env                  # Local secret configuration (never commit to git!)
├── .env.example          # Template for required environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Node dependencies and project scripts
├── server.js             # Application entry point (initializes DB connection & starts server)
└── src/
    ├── app.js            # Express app configuration, middlewares, and route mounting
    ├── config/
    │   ├── db.js         # MongoDB connection setup
    │   └── cloudinary.js # Cloudinary SDK credentials configuration
    ├── controllers/
    │   ├── authcontroller.js    # Logic for sign up, sign in, OTP, and password reset
    │   ├── imagecontroller.js   # Logic for image upload, retrieval, export, and deletion
    │   └── historycontroller.js # Logic for retrieving and clearing image activity logs
    ├── middleware/
    │   ├── authmiddleware.js        # JWT verification (`protect` guard)
    │   ├── errormiddleware.js       # Centralized 404 and 500 error handlers
    │   ├── ratelimitermiddleware.js # Rate limiter on auth routes
    │   ├── uploadmiddleware.js      # Multer memory storage and file filter
    │   └── validationmiddleware.js  # Validation result evaluator
    ├── models/
    │   ├── user.js       # User schema (credentials, OTP fields, email verification)
    │   └── image.js      # Image metadata schema (Cloudinary ID/URL, size, format, status)
    ├── routes/
    │   ├── authroutes.js    # Routes mounted on /api/auth
    │   ├── imageroutes.js   # Routes mounted on /api/images
    │   └── historyroutes.js # Routes mounted on /api/history
    ├── services/         # Reusable business logic (e.g., mail sending, Cloudinary uploads)
    ├── utils/            # Helper utilities and formatters
    └── validations/      # Express-validator schemas for incoming requests
```

---

## ⚙️ Prerequisites

Before running the backend, make sure you have:
1. **Node.js** (v18.x or later) installed on your machine.
2. A running **MongoDB** instance (locally or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster).
3. A free **Cloudinary** account for image hosting and processing credentials.
4. An **SMTP / Email service** (e.g., Gmail App Password, Mailtrap, or SendGrid) for sending OTP emails.

---

## 🚀 Getting Started & Local Setup

1. **Open your terminal and navigate to the `backend` folder**:
   ```bash
   cd backend
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   # On Windows (PowerShell):
   copy .env.example .env

   # On Linux/macOS or Git Bash:
   cp .env.example .env
   ```

4. **Fill in your `.env` values** (see the [Environment Variables](#-environment-variables-env) section below).

5. **Start the development server with live reload**:
   ```bash
   npm run dev
   ```
   The server will start listening at: `http://localhost:3000`

---

## 🔑 Environment Variables (.env)

Your `.env` file must define the following variables:

| Variable | Description | Example / Note |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/imageforge` |
| `CLIENT_URL` | Frontend URL allowed by CORS | `http://localhost:5173` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Strong random string |
| `JWT_EXPIRES_IN` | Token expiration period | `7d` |
| `OTP_EXPIRES_MINUTES`| Duration for which verification/reset OTP is valid | `10` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefghijklmnopqrstuvwx` |
| `MAIL_HOST` | SMTP server host | `smtp.gmail.com` or `sandbox.smtp.mailtrap.io` |
| `MAIL_PORT` | SMTP port | `587` or `465` |
| `MAIL_SECURE` | Use TLS/SSL | `false` (for 587) or `true` (for 465) |
| `MAIL_USER` | SMTP username / email address | `your-email@example.com` |
| `MAIL_PASSWORD` | SMTP password / App password | `your-app-password` |
| `MAIL_FROM` | Sender display name & email | `"ImageForge" <no-reply@imageforge.com>` |

---

## 📡 API Endpoints Reference

Base URL: `http://localhost:3000`

### Health Check
- **`GET /`**
  - **Description:** Verifies server is online.
  - **Auth:** None
  - **Response:** `200 OK` `{ "success": true, "message": "ImageForge API is running" }`

---

### Authentication (`/api/auth`)
*Note: All POST routes under auth are rate-limited via `authLimiter`.*

| Method | Endpoint | Auth | Description | Payload |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user and dispatch verification OTP | `{ "name", "email", "password" }` |
| `POST` | `/api/auth/verify-email` | Public | Verify user's email via received OTP | `{ "email", "otp" }` |
| `POST` | `/api/auth/resend-verification` | Public | Resend email verification OTP | `{ "email" }` |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token | `{ "email", "password" }` |
| `POST` | `/api/auth/forgot-password` | Public | Send password reset OTP to email | `{ "email" }` |
| `POST` | `/api/auth/reset-password` | Public | Reset password using OTP | `{ "email", "otp", "newPassword" }` |
| `GET` | `/api/auth/me` | Bearer Token | Get current authenticated user profile | *None* |

> **Header for protected routes:** `Authorization: Bearer <your_jwt_token>`

---

### Image Management (`/api/images`)

| Method | Endpoint | Auth | Description | Payload / Params |
|---|---|---|---|---|
| `POST` | `/api/images/upload` | Bearer Token | Upload image to Cloudinary & store DB record | `multipart/form-data` with field `image` |
| `GET` | `/api/images/getimage/:imageId` | Bearer Token | Fetch details of a specific uploaded image | URL param `:imageId` |
| `DELETE`| `/api/images/deleteimage/:imageId` | Bearer Token | Remove image from Cloudinary and DB | URL param `:imageId` |
| `POST` | `/api/images/export/:id` | Bearer Token | Export processed image | URL param `:id` |

---

### History Management (`/api/history`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/history/gethistory` | Bearer Token | Fetch processing/upload history for logged-in user |
| `DELETE`| `/api/history/deletehistory`| Bearer Token | Clear user's image processing history |

---

## 📜 Available Scripts

In the `backend` directory, you can run:

- **`npm run dev`**: Starts server with `nodemon` for active development and auto-restarts on file changes.
- **`npm start`**: Runs the server in production mode using `node server.js`.
