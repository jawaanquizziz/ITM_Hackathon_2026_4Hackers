# PacPay - Gamified Finance Arcade PWA

Welcome to PacPay! This project is a gamified fintech application built with Next.js, Firebase, and Gemini AI.

## 🚀 Quick Setup

To get started with the project after pulling the code, follow these simple steps:

### 1. Install Dependencies
Run this command in the **root** folder to install all necessary packages for both the root and the app:
```bash
npm install && npm run install-all
```

### 2. Environment Variables
Create a `.env.local` file inside the `pacpay` directory and add your credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Razorpay
RAZORPAY_KEY_ID="your_razorpay_key"
RAZORPAY_KEY_SECRET="your_razorpay_secret"

# Gemini
GEMINI_API_KEY="your_gemini_api_key"
```

### 3. Run Development Server
Start the app directly from the root folder:
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠 Project Structure
- `/pacpay`: The main Next.js application.
- `package.json` (root): Shortcut scripts to manage the app from the top level.

## 🕹 Features
- **Real-time Finance**: Live balance and XP updates via Firestore.
- **AI Insights**: Spending analysis powered by Google Gemini.
- **Razorpay Integration**: Seamless wallet top-ups.
- **Arcade UI**: Fully themed Pac-Man interface with pixel fonts and neon maze effects.
