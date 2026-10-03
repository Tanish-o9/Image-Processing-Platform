# 🖼️ Image Processing Platform — Backend API

Welcome to the backend service for the **Image Processing Platform**. This service provides a RESTful API powering user authentication, secure image storage & management via Cloudinary, AI/ML-driven image processing and quality analysis via an external ML microservice, and user processing history tracking using Express and MongoDB.

---

## 📋 Table of Contents

- [Architecture & Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Environment Variables (.env)](#-environment-variables-env)
- [Authentication & Security Flow](#-authentication--security-flow)
- [API Endpoints Reference & Examples](#-api-endpoints-reference--examples)
  - [1. Health Check](#1-health-check)
  - [2. Authentication (`/api/auth`)](#2-authentication-apiauth)
  - [3. Image Management (`/api/images`)](#3-image-management-apiimages)
  - [4. ML & Image Analysis (`/api/analysis`)](#4-ml--image-analysis-apianalysis)
  - [5. History Management (`/api/history`)](#5-history-management-apihistory)
- [Standard Response & Error Formats](#-standard-response--error-formats)
- [Testing Endpoints with cURL](#-testing-endpoints-with-curl)
- [Available Scripts](#-available-scripts)

---

## 🛠 Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/) (v18+ recommended)
- **Web Framework:** [Express.js](https://expressjs.com/) (v5)
- **Database & ODM:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication & Security:** 
  - JWT (`jsonwebtoken`)
  - Password Hashing (`bcryptjs` with salt cost 12)
  - HTTP Security Headers (`helmet`)
  - Cross-Origin Resource Sharing (`cors`)
  - Brute-Force & Rate Limiting (`express-rate-limit` on auth endpoints)
- **File Uploads & Media Storage:** [Multer](https://github.com/expressjs/multer) (in-memory buffer, 25MB limit) & [Cloudinary SDK](https://cloudinary.com/) (stream upload via `streamifier`)
- **HTTP Client / Microservice Communication:** [Axios](https://axios-http.com/) (for integrating with the Python/FastAPI ML service)
- **Email Service:** [Nodemailer](https://nodemailer.com/) (6-digit OTP delivery for email verification and password reset)
- **Validation:** `express-validator`
- **HTTP Request Logging:** `morgan`

---

## 📁 Project Directory Structure

```text
backend/
├── .env                  # Local secret configuration (git-ignored)
├── .env.example          # Template for required environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Node dependencies and project scripts
├── server.js             # Application entry point (connects DB & starts HTTP listener)
└── src/
    ├── app.js            # Express app configuration, middlewares, and route mounting
    ├── config/
    │   ├── db.js         # MongoDB connection setup
    │   └── cloudinary.js # Cloudinary SDK credentials configuration
    ├── controllers/
    │   ├── authcontroller.js       # Register, login, OTP verification, password reset, get profile
    │   ├── imagecontroller.js      # Upload, single fetch, export, delete
    │   ├── historycontroller.js    # Fetch user history, clear history & Cloudinary assets
    │   └── analysiscontroller.js   # ML health proxy, stored image processing, direct analysis/recommendation
    ├── middleware/
    │   ├── authmiddleware.js        # JWT verification (`protect` guard)
    │   ├── errormiddleware.js       # Centralized 404 and 500 error handlers
    │   ├── ratelimitermiddleware.js # Rate limiter on auth routes (15 min window, 10 requests)
    │   ├── uploadmiddleware.js      # Multer memory storage and image/* mime filter (max 25MB)
    │   └── validationmiddleware.js  # Express-validator results formatter
    ├── models/
    │   ├── user.js       # User schema (credentials, hashed OTPs, expiration timestamps)
    │   └── image.js      # Image metadata schema (Cloudinary ID/URL, size, format, status, processingResult, analysisResult)
    ├── routes/
    │   ├── authroutes.js       # Mounted on /api/auth
    │   ├── imageroutes.js      # Mounted on /api/images
    │   ├── historyroutes.js    # Mounted on /api/history
    │   └── analysisroutes.js   # Mounted on /api/analysis
    ├── services/
    │   ├── cloudinaryservice.js        # Buffer stream upload and asset deletion
    │   ├── mailservice.js              # HTML email templates and Nodemailer transport
    │   ├── mlservice.js                # Axios client communicating with external ML service
    │   └── imageprocessingservice.js   # Workflow orchestrating image status & ML pipeline
    ├── utils/
    │   ├── otp.js            # 6-digit cryptographic OTP generation & SHA-256 hashing
    │   ├── response.js       # Standardized success/error JSON response builders
    │   └── token.js          # JWT signing utility
    └── validations/
        └── authvalidation.js # Express-validator rules for auth payloads
```

---

## ⚙️ Prerequisites

Before running the backend, make sure you have:
1. **Node.js** (v18.x or later) and **npm** installed.
2. A running **MongoDB** instance (locally or via [MongoDB Atlas](https://www.mongodb.com/atlas)).
3. A free **Cloudinary** account (Cloud Name, API Key, API Secret).
4. An **SMTP Service** (e.g., Gmail App Password, Mailtrap, or SendGrid) for sending OTP emails.
5. An **ML Microservice** running (e.g. FastAPI on `http://localhost:8000`) for processing and enhancement endpoints.

---

## 🚀 Getting Started & Local Setup

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   # On Windows (PowerShell):
   copy .env.example .env

   # On Linux/macOS or Git Bash:
   cp .env.example .env
   ```

4. **Populate `.env`** with your credentials (see table below).

5. **Start the development server with hot-reload**:
   ```bash
   npm run dev
   ```
   The server will start listening at: `http://localhost:3000`

---

## 🔑 Environment Variables (.env)

| Variable | Required | Description | Example / Default |
|---|---|---|---|
| `PORT` | Optional | Express server port | `3000` |
| `MONGO_URI` | **Yes** | MongoDB connection string | Atlas URI |
| `CLIENT_URL` | Optional | Frontend origin permitted by CORS | `http://localhost:5173` |
| `JWT_SECRET` | **Yes** | Secret key for signing JSON Web Tokens | `your_super_secret_jwt_key_here` |
| `JWT_EXPIRES_IN` | Optional | Expiration timeframe for JWT tokens | `7d` |
| `OTP_EXPIRES_MINUTES`| Optional | Expiration window for 6-digit OTP | `10` |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary account cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API secret | `abcdefghijklmnopqrstuvwx` |
| `MAIL_HOST` | **Yes** | SMTP server hostname | `smtp.gmail.com` or `sandbox.smtp.mailtrap.io` |
| `MAIL_PORT` | **Yes** | SMTP server port | `587` (TLS) or `465` (SSL) |
| `MAIL_SECURE` | Optional | Use TLS/SSL directly | `false` for 587, `true` for 465 |
| `MAIL_USER` | **Yes** | SMTP username / sender account email | `your-email@example.com` |
| `MAIL_PASSWORD` | **Yes** | SMTP password / App password | `your-app-password` |
| `MAIL_FROM` | Optional | Sender display name & email | `"ImageRise" <no-reply@imagerise.com>` |
| `ML_BASE_URL` | **Yes** | Base URL of the ML microservice | `http://localhost:8000` |

---

## 🛡️ Authentication & Security Flow

1. **Registration:**
   User posts `{ name, email, password }`. Backend hashes password with bcrypt (cost 12), generates a 6-digit OTP, stores a SHA-256 hash of the OTP with a 10-minute expiry, and emails the code.
2. **Email Verification:**
   User sends `{ email, otp }`. Once verified, `isEmailVerified` is flipped to `true`.
3. **Login:**
   Unverified accounts receive `403 Forbidden`. Successful login issues a signed JWT.
4. **Authorized Requests:**
   Send the JWT in the HTTP Authorization header:
   ```http
   Authorization: Bearer <your_jwt_token>
   ```
5. **Rate Limiting:**
   Auth endpoints (`/api/auth/*`) allow up to 10 requests per 15 minutes per IP to safeguard against brute-force attacks.

---

## 📡 API Endpoints Reference & Examples

### Base URL
```text
http://localhost:3000
```

---

### 1. Health Check

#### `GET /`
Verifies that the backend API server is healthy and accepting connections.

- **Auth:** None (Public)
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "ImageForge API is running"
}
```

---

### 2. Authentication (`/api/auth`)

#### `POST /api/auth/register`
Creates an account and sends a 6-digit verification code to the user's email.

- **Auth:** Public (Rate-limited)
- **Request Body:**
```json
{
  "name": "Ayush",
  "email": "ayush123@gamil.com",
  "password": "Password123!"
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "message": "Account created. Verification OTP sent to your email.",
  "data": {
    "userId": "674ef0a12b34567890abcd12",
    "email": "ayush123@example.com"
  }
}
```

---

#### `POST /api/auth/verify-email`
Validates the 6-digit OTP sent via email and activates the account.

- **Auth:** Public (Rate-limited)
- **Request Body:**
```json
{
  "email": "jane@gmail.com",
  "otp": "482910"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

#### `POST /api/auth/resend-verification`
Generates and sends a new verification OTP.

- **Auth:** Public (Rate-limited)
- **Request Body:**
```json
{
  "email": "ayush123@gmail.com"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Verification OTP sent"
}
```

---

#### `POST /api/auth/login`
Authenticates credentials and returns a JWT access token.

- **Auth:** Public (Rate-limited)
- **Request Body:**
```json
{
  "email": "ayush123@gmail.com",
  "password": "Password123!"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "674ef0a12b34567890abcd12",
      "name": "Ayush",
      "email": "ayush@gmail.com",
      "isEmailVerified": true
    }
  }
}
```

---

#### `POST /api/auth/forgot-password`
Sends a 6-digit password reset OTP to the specified email address.

- **Auth:** Public (Rate-limited)
- **Request Body:**
```json
{
  "email": "ayush123@gmail.com"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "If an account exists for this email, a password reset OTP has been sent."
}
```

---

#### `POST /api/auth/reset-password`
Resets user password upon providing a valid reset OTP.

- **Auth:** Public (Rate-limited)
- **Request Body:**
```json
{
  "email": "ayush123@gmail.com",
  "otp": "918234",
  "newPassword": "NewStrongPassword123!"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

#### `GET /api/auth/me`
Retrieves current authenticated user's profile.

- **Auth:** Bearer Token
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Current user",
  "data": {
    "user": {
      "id": "674ef0a12b34567890abcd12",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "isEmailVerified": true
    }
  }
}
```

---

### 3. Image Management (`/api/images`)

#### `POST /api/images/upload`
Uploads an image file to Cloudinary in a user-specific folder (`image-platform/{userId}`) and saves its metadata record in MongoDB.

- **Auth:** Bearer Token
- **Content-Type:** `multipart/form-data`
- **Form Data Field:** `image` (binary file, max 25MB, MIME `image/*`)
- **Response:** `201 Created`
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "image": {
      "_id": "674f1b2c3d4e5f6789012345",
      "user": "674ef0a12b34567890abcd12",
      "originalName": "scenery.jpg",
      "cloudinaryPublicId": "image-platform/674ef0a12b34567890abcd12/abc123xyz",
      "cloudinaryUrl": "http://res.cloudinary.com/demo/image/upload/v1/image-platform/scenery.jpg",
      "secureUrl": "https://res.cloudinary.com/demo/image/upload/v1/image-platform/scenery.jpg",
      "mimeType": "image/jpeg",
      "format": "jpg",
      "size": 245120,
      "width": 1920,
      "height": 1080,
      "status": "uploaded",
      "processingResult": null,
      "analysisResult": null,
      "exportedAt": null,
      "createdAt": "2026-10-03T15:30:00.000Z",
      "updatedAt": "2026-10-03T15:30:00.000Z"
    }
  }
}
```

---

#### `GET /api/images/getimage/:imageId`
Retrieves image metadata and processing details by image ID.

- **Auth:** Bearer Token
- **URL Parameters:** `:imageId` (MongoDB ObjectId)
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "image": {
      "_id": "674f1b2c3d4e5f6789012345",
      "user": "674ef0a12b34567890abcd12",
      "originalName": "scenery.jpg",
      "secureUrl": "https://res.cloudinary.com/demo/image/upload/v1/image-platform/scenery.jpg",
      "status": "processed",
      "format": "jpg",
      "size": 245120,
      "width": 1920,
      "height": 1080,
      "processingResult": {
        "enhancedUrl": "https://res.cloudinary.com/demo/image/upload/v1/image-platform/scenery_enhanced.jpg",
        "appliedOperations": ["denoise", "auto-contrast", "sharpen"]
      }
    }
  }
}
```

---

#### `POST /api/images/export/:id`
Marks an image record as exported with a timestamp.

- **Auth:** Bearer Token
- **URL Parameters:** `:id` (MongoDB ObjectId)
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Image is ready for export",
  "data": {
    "imageId": "674f1b2c3d4e5f6789012345",
    "url": "https://res.cloudinary.com/demo/image/upload/v1/image-platform/scenery.jpg",
    "exportedAt": "2026-10-03T16:00:00.000Z"
  }
}
```

---

#### `DELETE /api/images/deleteimage/:imageId`
Deletes the image asset from Cloudinary and deletes its record from MongoDB.

- **Auth:** Bearer Token
- **URL Parameters:** `:imageId` (MongoDB ObjectId)
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

### 4. ML & Image Analysis (`/api/analysis`)

#### `GET /api/analysis/health`
Checks the availability and status of the external ML microservice.

- **Auth:** Public
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "image-processing-ml",
    "version": "1.0.0"
  }
}
```

---

#### `POST /api/analysis/process`
Fetches a user's uploaded image by `imageId`, sends its Cloudinary URL and processing parameters to the ML service, updates image status (`processing` -> `processed` or `failed`), and saves the returned result.

- **Auth:** Bearer Token
- **Request Body:**
```json
{
  "imageId": "674f1b2c3d4e5f6789012345",
  "tasks": ["denoise", "sharpen", "super_resolution"],
  "scale": 2,
  "denoise_strength": 0.5
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Image processed successfully",
  "data": {
    "image": {
      "_id": "674f1b2c3d4e5f6789012345",
      "status": "processed",
      "processingResult": {
        "output_url": "https://res.cloudinary.com/demo/image/upload/v2/enhanced.png",
        "metrics": {
          "psnr": 34.2,
          "ssim": 0.94
        }
      }
    },
    "result": {
      "output_url": "https://res.cloudinary.com/demo/image/upload/v2/enhanced.png",
      "metrics": {
        "psnr": 34.2,
        "ssim": 0.94
      }
    }
  }
}
```

---

#### `POST /api/analysis/analyze`
Passes image options directly to the ML microservice to assess quality, noise, brightness, contrast, and histogram distributions.

- **Auth:** Bearer Token
- **Request Body:**
```json
{
  "imageUrl": "https://res.cloudinary.com/demo/image/upload/v1/image-platform/scenery.jpg",
  "features": ["brightness", "sharpness", "noise_level", "color_palette"]
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "brightness": 0.62,
    "contrast": 1.15,
    "sharpness_score": 78.4,
    "noise_level": "low",
    "dominant_colors": ["#1A365D", "#2B6CB0", "#E2E8F0"]
  }
}
```

---

#### `POST /api/analysis/recommend`
Requests algorithmic recommendations from the ML microservice for optimal enhancement parameters based on image traits.

- **Auth:** Bearer Token
- **Request Body:**
```json
{
  "imageUrl": "https://res.cloudinary.com/demo/image/upload/v1/image-platform/scenery.jpg",
  "targetUse": "web_display"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "recommendations": [
      { "operation": "denoise", "parameters": { "strength": 0.3 } },
      { "operation": "sharpen", "parameters": { "amount": 1.2 } },
      { "operation": "format_conversion", "parameters": { "targetFormat": "webp", "quality": 85 } }
    ],
    "estimatedSavingsBytes": 124000
  }
}
```

---

### 5. History Management (`/api/history`)

#### `GET /api/history/gethistory`
Retrieves chronological history of all images uploaded and processed by the authenticated user (sorted newest first).

- **Auth:** Bearer Token
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "History fetched successfully",
  "data": {
    "history": [
      {
        "_id": "674f1b2c3d4e5f6789012345",
        "originalName": "scenery.jpg",
        "secureUrl": "https://res.cloudinary.com/demo/image/upload/v1/image-platform/scenery.jpg",
        "status": "processed",
        "format": "jpg",
        "size": 245120,
        "createdAt": "2026-10-03T15:30:00.000Z"
      }
    ]
  }
}
```

---

#### `DELETE /api/history/deletehistory`
Permanently clears all images for the logged-in user: deletes each corresponding asset from Cloudinary and removes all records from MongoDB.

- **Auth:** Bearer Token
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "History cleared successfully"
}
```

---

## 📦 Standard Response & Error Formats

### Successful Response Format
```json
{
  "success": true,
  "message": "Human readable confirmation message (optional)",
  "data": { ... }
}
```

### Validation Error Format (`400 Bad Request`)
```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Please enter a valid email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Standard Error Format (`401`, `403`, `404`, `500`)
```json
{
  "success": false,
  "message": "Detailed error explanation here"
}
```

### Common HTTP Status Codes
| Status Code | Meaning | Typical Trigger |
|---|---|---|
| `200 OK` | Request succeeded | Successful GET, standard update/delete |
| `201 Created` | Resource created | Successful registration or image upload |
| `400 Bad Request` | Invalid input | Validation failures, missing required fields, expired OTP |
| `401 Unauthorized` | Missing / invalid token | Expired token or unauthenticated request |
| `403 Forbidden` | Access denied | Attempting to login before email verification |
| `404 Not Found` | Not found | Invalid image ID or route doesn't exist |
| `409 Conflict` | Duplicate resource | Email already registered in system |
| `429 Too Many Requests` | Rate limit hit | More than 10 requests within 15 minutes on auth routes |
| `500 Internal Error` | Server error | Cloudinary error, unhandled exception, DB failure |

---

## 🧪 Testing Endpoints with cURL

Here is a quick walkthrough to test the core flow using cURL in your terminal:

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"astitv","email":"astitv@gmail.com","password":"SecretPassword123!"}'
```

### 2. Verify Email with Received OTP
```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email":"astitiv@gmail.com","otp":"123456"}'
```

### 3. Log In to Receive JWT
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"astitv@gmail.com","password":"SecretPassword123!"}'
```
*Copy the returned `token` from the response.*

### 4. Upload an Image
```bash
curl -X POST http://localhost:3000/api/images/upload \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -F "image=@/path/to/local/sample.jpg"
```

### 5. Trigger ML Processing
```bash
curl -X POST http://localhost:3000/api/analysis/process \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"imageId":"<IMAGE_ID_FROM_UPLOAD_RESPONSE>","tasks":["denoise","sharpen"]}'
```

### 6. View User History
```bash
curl -X GET http://localhost:3000/api/history/gethistory \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## 📜 Available Scripts

In the `backend` directory, you can run:

- **`npm run dev`**: Starts server with `nodemon` for active development and auto-restarts on code changes.
- **`npm start`**: Runs the server in production mode using standard `node server.js`.
