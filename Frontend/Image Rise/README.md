# Image Rise

Image Rise is a modern AI-powered image workflow frontend built with React and Vite. It provides a polished landing page, user authentication flow, and a protected dashboard where users can upload images, analyze them, edit them, review recommendations, track history, and export results.

## Overview

This project is designed as a responsive web app for creative and AI-assisted image processing. The interface includes:

- Landing page and marketing sections
- Login, signup, forgot password, and email verification screens
- Protected dashboard routes for authenticated users
- Image upload and processing workflow pages
- AI analysis, recommendations, and output export sections

## Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS
- Lucide React icons
- ESLint for code quality

## Project Structure

```text
Image Rise/
├── public/
│   └── images/
├── src/
│   ├── api.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── assets/
│   ├── components/
│   │   ├── AppLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── ImageCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── QuickAction.jsx
│   │   └── Sidebar.jsx
│   └── pages/
│       ├── Landing.jsx
│       ├── Login.jsx
│       ├── Signup.jsx
│       ├── ForgotPassword.jsx
│       ├── ResetSuccess.jsx
│       ├── VerifyEmail.jsx
│       └── dashboard/
│           ├── AIAnalysis.jsx
│           ├── Analysis.jsx
│           ├── EditImage.jsx
│           ├── ExportImage.jsx
│           ├── History.jsx
│           ├── Home.jsx
│           ├── Recommendations.jsx
│           ├── Settings.jsx
│           └── Upload.jsx
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── package-lock.json
```

## Features

### Public Pages
- Landing page with hero section and product branding
- Signup and login interface
- Password recovery and email verification screens

### Dashboard
- Secure routed dashboard using protected route guards
- Home overview with quick actions and recent projects
- Upload flow for image handling
- Image edit workspace
- AI analysis and suggestions
- History tracking
- Export options
- User settings

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm or another package manager

### Installation

1. Open the project folder:

```bash
cd "Image Rise"
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
```
Starts the Vite development server.

```bash
npm run build
```
Builds the app for production.

```bash
npm run preview
```
Serves the production build locally.

```bash
npm run lint
```
Runs ESLint checks on the project.

## Environment Variables

The project includes an example environment file at `.env.example`. Copy it to `.env` and update any required values if your backend or APIs are connected.

## Notes

This repository is a frontend application focused on the user experience and UI flow for an AI image platform. If you are integrating real backend services, you will likely connect the existing API utilities and dashboard actions to your backend endpoints.

## License

This project is currently unlicensed unless you add a license file for your own deployment or distribution needs.
