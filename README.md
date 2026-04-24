# Krishi Bondho (কৃষি বন্ধু) 🌾
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

Krishi Bondho is a state-of-the-art, AI-powered agricultural ecosystem designed to revolutionize farming in Bangladesh. By combining advanced Large Language Models (LLMs) with localized agricultural data and real-time processing, it provides farmers with expert-level guidance, disease identification, and profitable crop recommendations.

---

## 🌟 Key Features

### 🤖 AI Agricultural Specialist
- **Interactive Chat**: A specialized AI assistant trained on Bangladeshi agricultural context.
- **Bangla Support**: Fully localized interactions for better accessibility.
- **Real-time Streaming**: Instant responses using Server-Sent Events (SSE) or streaming APIs.
- **Context Awareness**: Remembers conversation history for coherent, multi-step advice.

### 📈 Smart Crop Advisor
- **Personalized Recommendations**: Suggests crops based on **User Location**, **Current Season**, and **Soil Type**.
- **Profit Projections**: Estimated profit analysis based on current market trends in Bangladesh.
- **Visual Aid**: Integration with Pexels API to provide high-quality visuals of recommended crops.

### 🔍 Disease Detection
- **Computer Vision Analysis**: Upload photos of infected crops for instant AI-based diagnosis.
- **Treatment Plans**: Detailed, actionable steps to mitigate detected diseases.
- **Pest Identification**: Identifies specific pests and suggests eco-friendly or chemical solutions.

### ⚙️ Infrastructure & Performance
- **Background Processing**: Uses **BullMQ** and **Redis** for reliable email delivery and chat history persistence.
- **Media Management**: **ImageKit** integration for optimized image hosting and processing.
- **Secure Auth**: JWT-based authentication with OTP/Email verification.

---

## 🛠️ Technology Stack

### Backend
- **Core**: Node.js, Express.js (TypeScript)
- **Database**: MongoDB (Mongoose)
- **Caching & Queues**: Redis, BullMQ
- **Validation**: Zod
- **Security**: JWT, Argon2 (hashing), Express Rate Limit

### AI & External APIs
- **LLMs**: Google Gemini AI (Pro/Flash), OpenRouter (Multi-model fallback)
- **Media**: ImageKit (Uploads), Pexels API (Crop Images)
- **Communication**: Nodemailer (Email/OTP)

### Frontend (Companion App)
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4, Shadcn UI
- **State**: Zustand
- **Animations**: Motion (Framer Motion)

---

## 📂 Project Architecture

```text
src/
├── config/             # Database, Redis, and global configurations
├── middlewares/        # Auth, Validation, Rate-limiting, and Error handlers
├── modules/            # Domain-driven Feature Modules
│   ├── auth/           # Registration, Login, OTP Verification
│   ├── chat/           # AI Chat logic & History management
│   ├── crop/           # AI-powered Crop recommendations
│   └── disease/        # Crop disease detection (Image analysis)
├── queue/              # BullMQ Queue definitions (Email, Chat History)
├── worker/             # Background Workers for processing queues
├── services/           # Shared services (Email, ImageKit, Pexels)
├── types/              # Global TypeScript interfaces
└── utils/              # Helper functions & constants
```

---

## 🔌 API Endpoints (v1)

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/v1/auth/register` | `POST` | Create a new farmer account |
| **Auth** | `/api/v1/auth/verify` | `POST` | Verify account via OTP |
| **Auth** | `/api/v1/auth/login` | `POST` | Secure login (Set HTTP-only cookie) |
| **Chat** | `/api/v1/chat/` | `POST` | Send message to AI assistant |
| **Chat** | `/api/v1/chat/stream` | `POST` | Stream AI response (Real-time) |
| **Crop** | `/api/v1/crop/` | `POST` | Get smart crop recommendations |
| **Disease** | `/api/v1/disease/detect`| `POST` | Upload image for disease analysis |

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd krisi-bondho/server
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   
   # Redis Configuration
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   
   # Security
   JWT_SECRET=your_jwt_secret
   
   # AI API Keys
   GAN_AI_API_KEY=your_google_gemini_key
   OPENROUTER_API_KEY=your_openrouter_key
   PEXELS_API_KEY=your_pexels_key
   
   # Media & Communication
   IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   IMAGEKIT_URL_ENDPOINT=your_endpoint
   
   NODEMAILER_USER=your_email
   NODEMAILER_PASS=your_app_password
   ```

4. **Run the server:**
   ```bash
   # Development
   pnpm dev
   
   # Production
   pnpm build
   pnpm start
   ```

---

## 📄 License

This project is licensed under the **ISC License**. Built with ❤️ for the farmers of Bangladesh.
