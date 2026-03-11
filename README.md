<div align="center">

<img src="https://img.shields.io/badge/MockMate-Interview%20Practice%20Platform-4A90D9?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek0xMiAxN2MtMi43NiAwLTUtMi4yNC01LTVzMi4yNC01IDUtNSA1IDIuMjQgNSA1LTIuMjQgNS01IDV6Ii8+PC9zdmc+" />

# MockMate

### A Real-Time Interview Practice Network — Built for Engineers, by an Engineer

**Find your mock interview partner. Practice together. Get hired.**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Netlify-00C7B7?style=flat-square)](https://dazzling-griffin-af4d6f.netlify.app/)
[![Frontend](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=flat-square&logo=react)](https://github.com/kaushalShinde/MockMate/frontend)
[![Backend](https://img.shields.io/badge/Backend-Node.js-339933?style=flat-square&logo=node.js)](https://github.com/kaushalShinde/MockMate/backend)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb)](https://github.com/kaushalShinde/MockMate)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## 📌 Problem Statement

During college, finding peers willing to practice mock interviews was nearly impossible. Coding groups were non-existent, and scheduling even a single practice session with a friend felt like an uphill task. Platforms like Pramp exist, but they lack the social layer — the ability to find someone *you* trust, build rapport first, and then practice together.

> **MockMate** bridges that gap — combining a social networking layer with real-time communication tools so engineers can find practice partners organically, connect, and interview each other, all in one place.

---

## 💡 Solution

MockMate is a **full-stack social platform** purpose-built for interview preparation. Users can post their practice requirements (e.g., *"Looking for a DSA mock interview partner this weekend"*), discover like-minded peers, connect via friend requests, and collaborate through **real-time chat and video calls** — without ever leaving the platform.

---

## ✨ Features

### 👤 User Profiles & Authentication
- Secure **JWT-based authentication** (1-day token expiry)
- **OTP email verification** via Brevo (mandatory on signup)
- Rich user profiles: profile picture, contact info, and work/education details

### 📝 Posts & Discovery
- Create posts with a **title + body** to broadcast your practice needs
- Posts display **like/dislike counts**, **view counts**, and **timestamps**
- Engage with the community by liking or reacting to posts

### 🔔 Real-Time Notifications
- Instant notifications via **Socket.io** for:
  - 👍 Someone liked your post
  - 🤝 Incoming friend requests

### 💬 Chat System
- **Real-time messaging** powered by Socket.io
- Rich media support: send **images, videos, audio, and files**
- Persistent chat history

### 📹 Video Calls
- **Peer-to-peer video calls** using **ZegoCloud SDK + WebRTC**
- One-click call initiation from the chat interface

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
│                                                                     │
│   ┌──────────────────────────────────────────────────────────┐      │
│   │              React.js  +  Material UI                    │      │
│   │           (Netlify — CDN Global Deployment)              │      │
│   └──────────┬──────────────────────┬────────────────────────┘      │
│              │  Axios (REST)        │  Socket.io Client              │
└──────────────┼──────────────────────┼───────────────────────────────┘
               │                      │
               ▼                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          SERVER LAYER                               │
│                                                                     │
│   ┌──────────────────────────────────────────────────────────┐      │
│   │           Node.js  +  Express.js  (REST API)             │      │
│   │           Socket.io Server (WebSocket Gateway)           │      │
│   │              (Render — Backend Deployment)               │      │
│   └────┬──────────────┬──────────────┬────────────────┬──────┘      │
│        │              │              │                │             │
│        ▼              ▼              ▼                ▼             │
│   ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐      │
│   │ MongoDB │  │  Redis   │  │  Brevo    │  │  ZegoCloud   │      │
│   │  Atlas  │  │ (Upstash)│  │  (Email/  │  │  SDK + WebRTC│      │
│   │  (DB)   │  │  Cache   │  │   OTP)    │  │  (Video Call)│      │
│   └─────────┘  └──────────┘  └───────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow — Real-Time Events
```
User Action (like post / send message / friend request)
       │
       ▼
  Socket.io Event Emitted (Client → Server)
       │
       ├──► Persisted to MongoDB Atlas
       │
       ├──► Redis Cache Invalidated / Updated
       │
       └──► Socket.io Broadcast → Target Client(s)
                    │
                    ▼
           Notification / Message Rendered in UI
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js | UI framework |
| **UI Library** | Material UI (MUI) | Component library |
| **HTTP Client** | Axios | REST API communication |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MongoDB Atlas | Persistent data store |
| **Cache** | Redis (Upstash) | Reduce DB load, faster reads |
| **Real-Time** | Socket.io | WebSocket communication |
| **Video Call** | ZegoCloud SDK + WebRTC | P2P video calling |
| **Auth** | JWT (JSON Web Tokens) | Stateless session management |
| **Email / OTP** | Brevo | Transactional email delivery |
| **Frontend Deploy** | Netlify | CDN-based deployment |
| **Backend Deploy** | Render | Cloud backend hosting |

---

## ⚡ Performance & Scalability

### Redis Caching Strategy (Upstash)
- Frequently accessed resources (posts, user profiles, notifications) are cached in **Redis via Upstash**
- Cache-aside pattern: on cache miss → fetch from MongoDB → populate cache
- Significantly reduces MongoDB Atlas read pressure under traffic spikes
- TTL-based cache expiry ensures data consistency

### Socket.io Architecture
- Dedicated WebSocket connections per authenticated user
- Room-based event broadcasting for targeted notification delivery (no broadcast storms)
- Handles concurrent connections for chat, notifications, and presence updates

### Token-Based Auth
- **JWT tokens** with 1-day expiry — stateless, scalable, no server-side session storage
- OTP-gated account activation via Brevo to prevent spam accounts

---

## 📁 Project Structure

```
MockMate/
├── frontend/                   # React.js Application
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components (MUI-based)
│       ├── pages/              # Route-level page components
│       ├── context/            # React Context (auth, socket, notifications)
│       ├── hooks/              # Custom React hooks
│       ├── services/           # Axios API service layer
│       └── utils/              # Helper functions
│
└── backend/                    # Node.js + Express API
    ├── controllers/            # Route handler logic
    ├── models/                 # Mongoose schemas (User, Post, Message, etc.)
    ├── routes/                 # Express route definitions
    ├── middleware/             # Auth middleware, error handlers
    ├── socket/                 # Socket.io event handlers
    ├── config/                 # DB, Redis, Brevo config
    └── utils/                  # Shared utilities (JWT, OTP, etc.)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18.x`
- npm or yarn
- MongoDB Atlas account
- Upstash Redis account
- Brevo account (for email OTP)
- ZegoCloud account (for video calls)

### Environment Variables

**Backend — `.env`**
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

REDIS_URL=your_upstash_redis_url
REDIS_TOKEN=your_upstash_redis_token

BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_verified_sender_email

ZEGO_APP_ID=your_zegocloud_app_id
ZEGO_SERVER_SECRET=your_zegocloud_server_secret

CLIENT_URL=http://localhost:3000
```

**Frontend — `.env`**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ZEGO_APP_ID=your_zegocloud_app_id
```

### Installation & Local Setup

```bash
# Clone the repository
git clone https://github.com/kaushalShinde/MockMate.git
cd MockMate

# ── Backend ──────────────────────────────────
cd backend
npm install
npm run dev          # Starts Express server on port 5000

# ── Frontend (new terminal) ───────────────────
cd frontend
npm install
npm start            # Starts React app on port 3000
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Netlify | [dazzling-griffin-af4d6f.netlify.app](https://dazzling-griffin-af4d6f.netlify.app/) |
| Backend | Render | Auto-deployed from `main` branch |
| Database | MongoDB Atlas | Multi-region cluster |
| Cache | Upstash Redis | Serverless Redis |

---

## 🔮 Roadmap

- [ ] AI-powered interviewer (LLM-based feedback on answers)
- [ ] Scheduled mock interviews with calendar integration
- [ ] Post tagging by topic (DSA, System Design, Behavioural, etc.)
- [ ] Leaderboard / streak tracking
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Fork → Clone → Create feature branch
git checkout -b feature/your-feature-name

# Commit with conventional commit format
git commit -m "feat: add your feature description"

# Push and open a PR
git push origin feature/your-feature-name
```

---

## 👨‍💻 Author

**Kaushal Shinde**

Built out of a real frustration in college — no one wanted to do mock interviews. MockMate is the platform I wish existed back then.

[![GitHub](https://img.shields.io/badge/GitHub-kaushalShinde-181717?style=flat-square&logo=github)](https://github.com/kaushalShinde)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**If MockMate helped you land a role, leave a ⭐ — it means a lot.**

</div>
