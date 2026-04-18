# PacPay: Cyberpunk Finance & Arcade Arena

**PacPay** is a high-performance, gamified fintech platform designed for the 2026 Summer Hacks. It combines precision financial management with an immersive cyberpunk arcade experience.

## ✨ Core Features

### 🤖 AI Agent Manager
A persistent financial guardian that analyzes your metrics and provides real-time strategic advice.
- Powered by **Google Gemini 1.5**.
- Mobile-responsive chat interface.
- Context-aware: Knows your XP, Level, and Portfolio.

### 🕹️ Cyberpunk Trading Arena
A full-scale trading simulation native to the dashboard.
- **Live Video Preview**: A high-fidelity CSS-animated preview engine.
- **Real-time Trading**: Buy/Sell virtual stocks with Pac-Tokens.
- **Dynamic Charts**: Interactive market analytics powered by Recharts.

### ⚖️ Financial Suite
- **Debt Matrix**: Real-time tracker for person-to-person ledgers.
- **Vault Analytics**: Track XP, behavior scores, and weekly spending.
- **Spending Guard**: Automated limiters that protect your Arcade Rank.

### 🏆 Social Gamification
- **Global Leaderboard**: Compete with players worldwide for the top rank.
- **Arcade Passport**: Generate and share high-fidelity rank cards on Instagram and WhatsApp.

## 🛠️ Tech Stack
- **Framework**: Next.js 16.2.4 (App Router)
- **Styling**: Tailwind CSS 4 + Framer Motion
- **Database**: Firebase Firestore
- **State**: Zustand
- **AI**: Gemini Pro API
- **Charts**: Recharts + Chart.js

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_FIREBASE_CONFIG={...}
   NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_here
   ```
4. **Run Development**:
   ```bash
   npm run dev
   ```

## 📜 Repository Structure
- `/src/app`: Application routes and Page logic.
- `/src/components`: UI Design system and Chatbot components.
- `/src/services`: AI backend and Transaction logic.
- `/src/store`: Global state management.

---

*Built for the Future of Finance.*
