# 🖼️ Image Processing Platform — Backend API

Welcome to the backend service for the **Image Processing Platform**. This service provides a robust RESTful API built with **Node.js**, **Express 5**, and **MongoDB (Mongoose)**. It orchestrates user authentication, media asset storage via **Cloudinary**, transactional email delivery using **Brevo**, and communicates directly with an external **FastAPI / Python ML microservice** for image processing, quality analysis, and enhancement recommendations.

---

## 🌐 Live Production Deployment

- **Production API Base URL:** [`https://image-processing-platform-iylj.onrender.com`](https://image-processing-platform-iylj.onrender.com)
- **Deployment Platform:** [Render](https://render.com)
- **Live Health Status:** [`https://image-processing-platform-iylj.onrender.com/`](https://image-processing-platform-iylj.onrender.com/)
- **Live ML Service Health:** [`https://image-processing-platform-iylj.onrender.com/api/analysis/health`](https://image-processing-platform-iylj.onrender.com/api/analysis/health)

> **Render Free Tier Note:** Render web services may spin down after a period of inactivity. If the service is sleeping, the first request may take ~30–50 seconds to cold start.

---

## 📋 Table of Contents

- [Live Production Deployment](#-live-production-deployment)
- [Architecture & Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Deployment Configuration (Render)](#-deployment-configuration-render)
- [Environment Variables (.env)](#-environment-variables-env)
- [Authentication & Security Architecture](#-authentication--security-architecture)
- [API Endpoints Reference & Examples](#-api-endpoints-reference--examples)
  - [1. Server Root / Health](#1-server-root--health)
  - [2. Authentication Routes (`/api/auth`)](#2-authentication-routes-apiauth)
  - [3. Image Management Routes (`/api/images`)](#3-image-management-routes-apiimages)
  - [4. ML & Image Analysis Routes (`/api/analysis`)](#4-ml--image-analysis-routes-apianalysis)
  - [5. History Management Routes (`/api/history`)](#5-history-management-routes-apihistory)
- [Standard Response & Error Formats](#-standard-response--error-formats)
- [Quick Start cURL Testing Workflow (Local & Live)](#-quick-start-curl-testing-workflow-local--live)
- [Available Scripts](#-available-scripts)

---

## 🛠 Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/) (v18+ recommended)
- **Web Framework:** [Express.js](https://expressjs.com/) (`v5.2.1`)
- **Database & ODM:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) (`v9.10.2`)
- **Authentication & Security:** 
  - JSON Web Tokens (`jsonwebtoken`)
  - Password Hashing with salt factor 12 (`bcryptjs`)
  - Cryptographic 6-digit OTP generation and SHA-256 storage (`crypto`)
  - HTTP Security Headers (`helmet`)
  - Cross-Origin Resource Sharing (`cors`)
  - Rate Limiting (`express-rate-limit` — 20 requests per 15 minutes on auth routes)
- **File Uploads & Media Storage:**
  - In-memory upload buffer handling (`multer` with 25MB file limit and `image/*` filter)
  - Cloud hosting and automated folder allocation (`cloudinary` SDK with `streamifier`)
- **Microservice Integration:**
  - HTTP client (`axios`) with multipart/form-data streaming (`form-data`) communicating with the external ML microservice
- **Email Service:**
  - [Brevo](https://www.brevo.com/) Transactional Emails SDK (`@getbrevo/brevo` `v6.0.3`)
- **Validation & Parsing:** `express-validator` and `zod`
- **Request Logging:** `morgan` (`dev` format)

---

## 📁 Project Directory Structure

```text
backend/
├── .env                          # Local secrets and configuration (git-ignored)
├── .env.example                  # Template of required environment variables
├── .gitignore                    # Git ignore file
├── package.json                  # Dependencies, metadata, and scripts
├── package-lock.json             # Locked dependency tree
├── server.js                     # Application entry point (connects DB & boots server)
└── src/
    ├── app.js                    # Express app initialization, middlewares & route mounting
    ├── config/
    │   ├── db.js                 # MongoDB connection logic via Mongoose
    │   └── cloudinary.js         # Cloudinary SDK credentials configuration
    ├── controllers/
    │   ├── authcontroller.js     # Register, login, OTP verify/resend, password reset, me
    │   ├── imagecontroller.js    # Upload, get by id, delete, export, stats
    │   ├── historycontroller.js  # Get user history, clear history & Cloudinary assets
    │   └── analysiscontroller.js # ML health, process image, analyze image, recommendations
    ├── middleware/
    │   ├── authmiddleware.js     # JWT bearer authentication verification (`protect`)
    │   ├── errormiddleware.js    # Centralized 404 handler and 500/duplicate error handler
    │   ├── ratelimitermiddleware.js # Auth limiter (20 req / 15 min) and API limiter
    │   ├── uploadmiddleware.js   # Multer memory storage (25MB limit, image/* filter)
    │   └── validationmiddleware.js # Express-validator error formatting middleware
    ├── models/
    │   ├── user.js               # User schema (credentials, OTP hashes, expiry timestamps)
    │   └── image.js              # Image schema (Cloudinary URLs, dimensions, status, results)
    ├── routes/
    │   ├── authroutes.js         # Routes mounted on /api/auth
    │   ├── imageroutes.js        # Routes mounted on /api/images
    │   ├── historyroutes.js      # Routes mounted on /api/history
    │   └── analysisroutes.js     # Routes mounted on /api/analysis
    ├── services/
    │   ├── cloudinaryservice.js  # Buffer stream upload to Cloudinary & asset removal
    │   ├── mailservice.js        # Brevo transactional email client for OTP delivery
    │   ├── mlservice.js          # Microservice client communicating with ML service
    │   └── imageprocessingservice.js # Orchestrator for image status and ML execution
    ├── utils/
    │   ├── otp.js                # Cryptographic 6-digit OTP generator & SHA-256 hasher
    │   ├── response.js           # Standard success and error response helper builders
    │   └── token.js              # JWT generator helper
    └── validations/
        └── authvalidation.js     # Express-validator schemas for authentication requests
```

---

## ⚙️ Prerequisites

Before launching the backend locally or deploying to the cloud, ensure you have:
1. **Node.js** (v18.x or later) and **npm** installed.
2. A running **MongoDB** database (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas)).
3. A **Cloudinary** account (Cloud Name, API Key, API Secret).
4. A **Brevo (formerly Sendinblue)** account with an API Key and verified sender email for sending OTPs.
5. An active **ML Microservice** instance (FastAPI / Python) reachable at your configured `ML_BASE_URL`.

---

## 🚀 Getting Started & Local Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to create your local `.env`:
   ```bash
   # On Windows (PowerShell):
   copy .env.example .env

   # On Linux / macOS / Git Bash:
   cp .env.example .env
   ```

4. **Populate `.env`** with your credentials (see the next section).

5. **Run in Development Mode (with hot-reload via Nodemon)**:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`.

6. **Run in Production Mode**:
   ```bash
   npm start
   ```

---

## ☁️ Deployment Configuration (Render)

This backend is deployed on **Render** as a Web Service:
- **Service URL:** `https://image-processing-platform-iylj.onrender.com`
- **Environment:** `Node`
- **Root Directory:** `backend` (if deploying from root monorepo) or repository root
- **Build Command:** `npm install`
- **Start Command:** `npm start` (which executes `node server.js`)

### Required Render Environment Variables:
Set the following under **Environment** in the Render Dashboard:
```text
PORT=10000 (Render provides PORT automatically or defaults to 3000)
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/imagerise?retryWrites=true&w=majority
CLIENT_URL=https://<your-frontend-domain>.vercel.app (or frontend URL)
JWT_SECRET=your_production_secure_jwt_secret
JWT_EXPIRES_IN=7d
OTP_EXPIRES_MINUTES=10
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxx
BREVO_FROM_EMAIL=your-verified-brevo-email@domain.com
BREVO_FROM_NAME=ImageRise
ML_BASE_URL=https://<your-ml-service-url>.onrender.com
```

---

## 🔑 Environment Variables (.env)

| Variable | Required | Description | Example / Default |
|---|---|---|---|
| `PORT` | Optional | Port on which Express server listens | `3000` (Local) / auto-assigned on Render |
| `MONGO_URI` | **Yes** | MongoDB connection URI | `mongodb://127.0.0.1:27017/imagerise` or Atlas URI |
| `CLIENT_URL` | Optional | Frontend URL allowed for CORS requests | `http://localhost:5173` or production frontend URL |
| `JWT_SECRET` | **Yes** | Secret string for signing JSON Web Tokens | `your_long_random_jwt_secret_key` |
| `JWT_EXPIRES_IN` | Optional | Expiration timeframe for JWT tokens | `7d` |
| `OTP_EXPIRES_MINUTES` | Optional | Validity duration for verification/reset OTP | `10` |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary account Cloud Name | `my-cloud-name` |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API Secret | `abcdefghijklmnopqrstuvwxyz` |
| `BREVO_API_KEY` | **Yes** | Brevo Transactional API Key (`xkeysib-...`) | `xkeysib-xxxxxxxxxxxxxxxxxxxx` |
| `BREVO_FROM_EMAIL` | **Yes** | Verified sender email configured in Brevo | `no-reply@yourdomain.com` |
| `BREVO_FROM_NAME` | Optional | Sender display name | `ImageRise` |
| `ML_BASE_URL` | **Yes** | Base URL of the external Python/FastAPI ML service | `http://localhost:8000` or deployed ML URL |

---

## 🛡️ Authentication & Security Architecture

1. **Password Protection:** Passwords are encrypted using `bcryptjs` with 12 salt rounds and never returned in queries (`select: false`).
2. **OTP Generation & Verification:** 
   - A random 6-digit numeric code is generated using Node's cryptographic PRNG (`crypto.randomInt`).
   - Only the **SHA-256 hash** of the OTP is stored in the database with an expiration timestamp (`OTP_EXPIRES_MINUTES`, default 10 min).
   - Once verified, the hash and expiration fields are purged.
3. **Email Verification Requirement:** Accounts must complete email verification before logging in. Attempts to log in with an unverified email receive `403 Forbidden`.
4. **JWT Bearer Authentication:** Protected routes expect an HTTP header:
   ```http
   Authorization: Bearer <your_jwt_token>
   ```
5. **Rate Limiting:** Auth endpoints (`/api/auth/*`) are protected by `express-rate-limit` allowing up to **20 requests per 15 minutes** per IP address.

---

## 📡 API Endpoints Reference & Examples

### Base URLs
- **Production URL:** `https://image-processing-platform-iylj.onrender.com`
- **Local Development URL:** `http://localhost:3000`

---

### 1. Server Root / Health

#### `GET /`
Health check endpoint confirming that the backend API is online and functional.

- **Endpoint:** `GET https://image-processing-platform-iylj.onrender.com/`
- **Auth:** Public
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "ImageForge API is running"
}
```

---

### 2. Authentication Routes (`/api/auth`)

#### `POST /api/auth/register`
Registers a new user account, stores hashed credentials, generates a 6-digit verification OTP, and emails it using Brevo.

- **Endpoint:** `POST https://image-processing-platform-iylj.onrender.com/api/auth/register`
- **Auth:** Public (Rate-limited: 20 req / 15 min)
- **Validation:** 
  - `name`: 2–80 characters
  - `email`: Valid email format
  - `password`: Minimum 8 characters
- **Request Body:**
```json
{
  "name": "Ayush kumar",
  "email": "ayush123@example.com",
  "password": "ayush123!"
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "message": "Account created. Verification OTP sent to your email.",
  "data": {
    "userId": "674f1b2c3d4e5f6789012345",
    "email": "ayush123@example.com"
  }
}
```

---

#### `POST /api/auth/verify-email`
Verifies the user's account using the 6-digit OTP sent to their email.

- **Endpoint:** `POST https://image-processing-platform-iylj.onrender.com/api/auth/verify-email`
- **Auth:** Public (Rate-limited)
- **Request Body:**
```json
{
  "email": "ayush123@example.com",
  "otp": "492018"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": null
}
```

---

#### `POST /api/auth/resend-verification`
Generates a fresh 6-digit OTP and resends it to the user's email if not already verified.

- **Endpoint:** `POST https://image-processing-platform-iylj.onrender.com/api/auth/resend-verification`
- **Auth:** Public (Rate-limited)
- **Request Body:**
```json
{
  "email": "ayush123@example.com"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Verification OTP sent",
  "data": null
}
```

---

#### `POST /api/auth/login`
Authenticates user email and password. Requires the email to be verified. Returns a signed JWT token.

- **Endpoint:** `POST https://image-processing-platform-iylj.onrender.com/api/auth/login`
- **Auth:** Public (Rate-limited)
- **Request Body:**
```json
{
  "email": "ayush123@example.com",
  "password": "ayush123!"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzRmMWIyYzNkNGU1ZjY3ODkwMTIzNDUiLCJlbWFpbCI6ImFsZXhAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDk1Nzg0MDAsImV4cCI6MTcwOTY2NDgwMH0...",
    "user": {
      "id": "674f1b2c3d4e5f6789012345",
      "name": "Ayush kumar",
      "email": "ayush123@example.com",
      "isEmailVerified": true
    }
  }
}
```

---

#### `POST /api/auth/forgot-password`
Initiates the password reset process by generating a 6-digit reset OTP and emailing it to the user.

- **Endpoint:** `POST https://image-processing-platform-iylj.onrender.com/api/auth/forgot-password`
- **Auth:** Public (Rate-limited)
- **Request Body:**
```json
{
  "email": "ayush123@example.com"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "If an account exists for this email, a password reset OTP has been sent.",
  "data": null
}
```

---

#### `POST /api/auth/reset-password`
Resets the user's account password after verifying the 6-digit reset OTP.

- **Endpoint:** `POST https://image-processing-platform-iylj.onrender.com/api/auth/reset-password`
- **Auth:** Public (Rate-limited)
- **Request Body:**
```json
{
  "email": "ayush123@example.com",
  "otp": "837492",
  "newPassword": "NewBrandNewPassword123!"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": null
}
```

---

#### `GET /api/auth/me`
Fetches the current authenticated user profile from their JWT token.

- **Endpoint:** `GET https://image-processing-platform-iylj.onrender.com/api/auth/me`
- **Auth:** Bearer Token
- **Headers:** `Authorization: Bearer <your_jwt_token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Current user",
  "data": {
    "user": {
      "id": "674f1b2c3d4e5f6789012345",
      "name": "Ayush kumar",
      "email": "ayush123@example.com",
      "isEmailVerified": true
    }
  }
}
```

---

### 3. Image Management Routes (`/api/images`)

#### `POST /api/images/upload`
Uploads an image file to Cloudinary under the directory `image-processing-platform/{userId}` and creates an Image document in MongoDB.

- **Endpoint:** `POST https://image-processing-platform-iylj.onrender.com/api/images/upload`
- **Auth:** Bearer Token
- **Headers:** 
  - `Authorization: Bearer <your_jwt_token>`
  - `Content-Type: multipart/form-data`
- **Form Field:** `image` (File binary, max 25MB)
- **Response:** `201 Created`
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "image": {
      "_id": "674f201a4e5f6a7b8c9d0e1f",
      "user": "674f1b2c3d4e5f6789012345",
      "originalName": "sample_portrait.png",
      "cloudinaryPublicId": "image-processing-platform/674f1b2c3d4e5f6789012345/d8fk29slakdn201",
      "cloudinaryUrl": "http://res.cloudinary.com/demo/image/upload/v1/image-processing-platform/sample_portrait.png",
      "secureUrl": "https://res.cloudinary.com/demo/image/upload/v1/image-processing-platform/sample_portrait.png",
      "mimeType": "image/png",
      "format": "png",
      "size": 524288,
      "width": 1920,
      "height": 1080,
      "status": "uploaded",
      "processingResult": null,
      "analysisResult": null,
      "exportedAt": null,
      "createdAt": "2026-10-04T09:00:00.000Z",
      "updatedAt": "2026-10-04T09:00:00.000Z"
    }
  }
}
```

---

#### `GET /api/images/getimage/:imageId`
Retrieves an image's metadata and processing status by its MongoDB ID.

- **Endpoint:** `GET https://image-processing-platform-iylj.onrender.com/api/images/getimage/:imageId`
- **Auth:** Bearer Token
- **Headers:** `Authorization: Bearer <your_jwt_token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "image": {
      "_id": "674f201a4e5f6a7b8c9d0e1f",
      "user": "674f1b2c3d4e5f6789012345",
      "originalName": "sample_portrait.png",
      "secureUrl": "https://res.cloudinary.com/demo/image/upload/v1/image-processing-platform/sample_portrait.png",
      "format": "png",
      "size": 524288,
      "width": 1920,
      "height": 1080,
      "status": "processed",
      "processingResult": {
        "enhanced": true
      },
      "analysisResult": {
        "brightness": 128.4
      }
    }
  }
}
```

---

#### `GET /api/images/stats`
Calculates dashboard statistics for the logged-in user: count of processed images and count of images analyzed by AI.

- **Endpoint:** `GET https://image-processing-platform-iylj.onrender.com/api/images/stats`
- **Auth:** Bearer Token
- **Headers:** `Authorization: Bearer <your_jwt_token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "imagesProcessed": 14,
    "aiAnalyses": 9
  }
}
```

---

#### `POST /api/images/export/:id`
Sets the `exportedAt` timestamp on an image, signaling that the user exported or downloaded the asset.

- **Endpoint:** `POST https://image-processing-platform-iylj.onrender.com/api/images/export/:id`
- **Auth:** Bearer Token
- **Headers:** `Authorization: Bearer <your_jwt_token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Image is ready for export",
  "data": {
    "imageId": "674f201a4e5f6a7b8c9d0e1f",
    "url": "https://res.cloudinary.com/demo/image/upload/v1/image-processing-platform/sample_portrait.png",
    "exportedAt": "2026-10-04T09:30:00.000Z"
  }
}
```

---

#### `DELETE /api/images/deleteimage/:imageId`
Deletes an image from Cloudinary via its public ID and deletes the MongoDB document.

- **Endpoint:** `DELETE https://image-processing-platform-iylj.onrender.com/api/images/deleteimage/:imageId`
- **Auth:** Bearer Token
- **Headers:** `Authorization: Bearer <your_jwt_token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

### 4. ML & Image Analysis Routes (`/api/analysis`)

The analysis routes interact with the external ML microservice located at `ML_BASE_URL`.

#### `GET /api/analysis/health`
Proxies a health check directly to the ML microservice (`GET ${ML_BASE_URL}/health`).

- **Endpoint:** `GET https://image-processing-platform-iylj.onrender.com/api/analysis/health`
- **Auth:** Public
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "image-ml-service",
    "version": "1.0.0"
  }
}
```

---

#### `POST /api/analysis/process`
Fetches a stored image by `imageId`, marks its status as `processing`, streams the image buffer and custom settings to the ML microservice (`POST ${ML_BASE_URL}/process`), updates status to `processed` (or `failed` upon error), and saves the results.

> **Note on Binary Responses:** If the ML service returns a binary image buffer, the endpoint sets `Content-Type: image/jpeg` and returns the binary image stream directly. Otherwise, it returns JSON.

- **Endpoint:** `POST https://image-processing-platform-iylj.onrender.com/api/analysis/process`
- **Auth:** Bearer Token
- **Headers:** 
  - `Authorization: Bearer <your_jwt_token>`
  - `Content-Type: application/json`
- **Request Body:**
```json
{
  "imageId": "674f201a4e5f6a7b8c9d0e1f",
  "brightness": 1.2,
  "contrast": 1.1,
  "sharpness": 1.5,
  "denoise": true
}
```
- **Response (JSON case):** `200 OK`
```json
{
  "success": true,
  "message": "Image processed successfully",
  "data": {
    "processed": true,
    "appliedFilters": ["brightness", "contrast", "sharpness", "denoise"]
  }
}
```
- **Response (Binary image buffer case):** `200 OK` with `Content-Type: image/jpeg`.

---

#### `POST /api/analysis/analyze`
Finds the user's image by `imageId`, downloads its buffer, and sends it to the ML microservice (`POST ${ML_BASE_URL}/analyze`). Automatically saves the returned analysis to `image.analysisResult`.

- **Endpoint:** `POST https://image-processing-platform-iylj.onrender.com/api/analysis/analyze`
- **Auth:** Bearer Token
- **Headers:** 
  - `Authorization: Bearer <your_jwt_token>`
  - `Content-Type: application/json`
- **Request Body:**
```json
{
  "imageId": "674f201a4e5f6a7b8c9d0e1f"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "brightness": 134.2,
    "contrast": 48.7,
    "sharpness": 112.9,
    "entropy": 7.42,
    "noise_level": "low",
    "color_distribution": {
      "red_mean": 120.1,
      "green_mean": 138.4,
      "blue_mean": 142.0
    }
  }
}
```

---

#### `POST /api/analysis/recommend`
Fetches the user's image by `imageId` and requests algorithmic recommendations and filter presets from the ML microservice (`POST ${ML_BASE_URL}/recommend`).

- **Endpoint:** `POST https://image-processing-platform-iylj.onrender.com/api/analysis/recommend`
- **Auth:** Bearer Token
- **Headers:** 
  - `Authorization: Bearer <your_jwt_token>`
  - `Content-Type: application/json`
- **Request Body:**
```json
{
  "imageId": "674f201a4e5f6a7b8c9d0e1f"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "recommended_actions": [
      {
        "filter": "denoise",
        "strength": 0.4,
        "reason": "Slight high-frequency grain detected in background"
      },
      {
        "filter": "contrast",
        "factor": 1.15,
        "reason": "Dynamic range can be expanded for better clarity"
      }
    ],
    "suggested_preset": "vibrant_clean"
  }
}
```

---

### 5. History Management Routes (`/api/history`)

#### `GET /api/history/gethistory`
Retrieves all images uploaded by the authenticated user, sorted in descending order by `createdAt` (newest first).

- **Endpoint:** `GET https://image-processing-platform-iylj.onrender.com/api/history/gethistory`
- **Auth:** Bearer Token
- **Headers:** `Authorization: Bearer <your_jwt_token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "History fetched successfully",
  "data": {
    "history": [
      {
        "_id": "674f201a4e5f6a7b8c9d0e1f",
        "user": "674f1b2c3d4e5f6789012345",
        "originalName": "sample_portrait.png",
        "secureUrl": "https://res.cloudinary.com/demo/image/upload/v1/image-processing-platform/sample_portrait.png",
        "status": "processed",
        "format": "png",
        "size": 524288,
        "createdAt": "2026-10-04T09:00:00.000Z"
      }
    ]
  }
}
```

---

#### `DELETE /api/history/deletehistory`
Permanently clears the authenticated user's processing history: iterates through all image documents, deletes each corresponding asset from Cloudinary, and removes all database records.

- **Endpoint:** `DELETE https://image-processing-platform-iylj.onrender.com/api/history/deletehistory`
- **Auth:** Bearer Token
- **Headers:** `Authorization: Bearer <your_jwt_token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "History cleared successfully"
}
```

---

## 📦 Standard Response & Error Formats

### 1. Successful JSON Response
```json
{
  "success": true,
  "message": "Human readable message (optional)",
  "data": { ... }
}
```

### 2. Validation Failure (`400 Bad Request`)
Produced by `express-validator` and `validationmiddleware.js`:
```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "value": "bad-email",
      "msg": "Please enter a valid email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### 3. Application Errors (`400`, `401`, `403`, `404`, `409`, `429`, `500`)
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

### HTTP Status Codes Reference
| Status Code | Meaning | Typical Occasion |
|---|---|---|
| `200 OK` | Successful request | Fetching resources, updating data, processing completed |
| `201 Created` | Resource created | Successful registration or image upload |
| `400 Bad Request` | Invalid input | Validation errors, missing `imageId`, expired OTP |
| `401 Unauthorized` | Auth missing or invalid | Invalid JWT, missing `Authorization: Bearer` header |
| `403 Forbidden` | Access forbidden | Attempting to login before email verification is complete |
| `404 Not Found` | Resource not found | Invalid endpoint URL or image ID not found |
| `409 Conflict` | Duplicate resource | Registering an email that already exists |
| `429 Too Many Requests` | Rate limit exceeded | Exceeding 20 auth requests in a 15-minute window |
| `500 Internal Error` | Server execution error | Cloudinary network error, Brevo failure, or ML failure |

---

## 🧪 Quick Start cURL Testing Workflow (Local & Live)

You can run these tests against either local (`http://localhost:3000`) or the live deployment by setting the base URL variable:

```bash
# To test against the live deployment:
API_URL="https://image-processing-platform-iylj.onrender.com"

# Or to test locally:
# API_URL="http://localhost:3000"
```

### 1. Check API Health
```bash
curl -X GET $API_URL/
```

### 2. Register a New Account
```bash
curl -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Developer",
    "email": "jane@example.com",
    "password": "Password123!"
  }'
```

### 3. Verify Email with Received OTP
Check your email (sent via Brevo) for the 6-digit OTP:
```bash
curl -X POST $API_URL/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "otp": "123456"
  }'
```

### 4. Log In to Receive JWT Token
```bash
curl -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "Password123!"
  }'
```
*Save the `token` from the JSON response and replace `<TOKEN>` in subsequent commands.*

### 5. Upload an Image
```bash
curl -X POST $API_URL/api/images/upload \
  -H "Authorization: Bearer <TOKEN>" \
  -F "image=@/path/to/local/photo.jpg"
```
*Note the returned `_id` as `<IMAGE_ID>`.*

### 6. Run ML Image Analysis
```bash
curl -X POST $API_URL/api/analysis/analyze \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"imageId": "<IMAGE_ID>"}'
```

### 7. Request ML Recommendations
```bash
curl -X POST $API_URL/api/analysis/recommend \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"imageId": "<IMAGE_ID>"}'
```

### 8. Process Image with ML Service
```bash
curl -X POST $API_URL/api/analysis/process \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "imageId": "<IMAGE_ID>",
    "brightness": 1.2,
    "contrast": 1.1
  }'
```

### 9. View Image Dashboard Statistics
```bash
curl -X GET $API_URL/api/images/stats \
  -H "Authorization: Bearer <TOKEN>"
```

### 10. View Activity History
```bash
curl -X GET $API_URL/api/history/gethistory \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 📜 Available Scripts

From within the `backend/` directory:

- **`npm run dev`**: Starts the application using `nodemon server.js` for development with automatic restarts on file changes.
- **`npm start`**: Runs the server in production mode using Node.js (`node server.js`).
