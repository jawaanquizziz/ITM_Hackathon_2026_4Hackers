# PacPay Technical Workflow & Architecture

This document outlines the core logic and operational flow of the PacPay Platform.

## 1. Authentication & Security Flow
- **Standard Lock-In**: The application is protected by a `ClientWrapper` that enforces a mandatory `Splash Screen -> Login -> Dashboard` flow.
- **Unauthorized Guard**: Any attempt to access protected routes (`/`, `/arena`, `/leaderboard`) without a valid session results in an immediate redirect to `/login`.

## 2. The AI Agent Manager (Chatbot)
The AI Assistant acts as a financial orchestration layer.
- **Frontend**: A persistent floating component (`AgentChatbot.js`) provided via `ClientWrapper`. It maintains a local dialogue state and communicates with the backend via the `/api/chat` route.
- **Backend Orchestration**:
  1. Receives user message + context (XP, level, balance).
  2. Builds a strategic prompt injecting the user's financial profile.
  3. **AI Core**: Utilizes Google Gemini-1.5-Flash to generate analytical responses.
  4. **Scoped Logic**: The agent is hard-coded to only discuss finance and PacPay stats.

## 3. Cyberpunk Trading Arena (Gaming Engine)
- **Live Preview Engine**: A CSS/Framer-Motion component (`ArcadePreview.js`) simulates high-fidelity gameplay on the dashboard without the performance cost of video files.
- **Arena Logic**: 
  - `gameStore.js` (Zustand) manages the virtual economy.
  - Mocked market vectors provide 60fps price updates.
  - **Recharts Integration**: Real-time Area charts visualize stock volatility.

## 4. Financial Systems
- **Debt Tracker**: Real-time Firestore sync with client-side sorting to ensure zero-latency index-free queries.
- **Vault Management**: Atomic transactions handle XP gain and balance updates to prevent race conditions.
- **Spending Limiter**: A user-defined threshold in Settings that triggers a "Rank Demotion" if exceeded.

## 5. Mobile Responsiveness
- **PWA Ready**: Configured with `next-pwa` for "Add to Home Screen" support.
- **Responsive Grids**: All layouts use Tailwind `grid-cols-12` with responsive breakpoints to shift from desktop sidebars to mobile stacks.
