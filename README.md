# Krishi Bondho (কৃষি বন্ধু) 🌾

Krishi Bondho is a modern, AI-powered agricultural assistant designed to empower Bangladeshi farmers with real-time, expert-level farming advice. By leveraging advanced Large Language Models (LLMs) and local agricultural data, it provides personalized crop recommendations, disease detection, and interactive farming support.

## 🚀 Key Features

- **AI Agricultural Chat**: Interactive assistant for all farming queries, supporting Bangla and real-time streaming responses.
- **Smart Crop Advisor**: Personalized crop suggestions based on location, season, and soil type, complete with profit estimates and reference images.
- **Crop Disease Detection**: Upload photos of your crops to identify diseases and get immediate treatment advice.
- **Secure Authentication**: Robust user management with OTP/Email verification and JWT-based security.
- **Modern Tech Stack**: Built with TypeScript, Express.js, and MongoDB for high performance and scalability.

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js (TypeScript)
- **Database**: MongoDB (via Mongoose)
- **AI Engine**: 
  - Google Gemini AI (gemini-2.5-flash)
  - OpenRouter (Multi-model support)
- **APIs & Tools**:
  - Pexels API (Crop Visuals)
  - Nodemailer (Email/OTP Services)
  - Zod (Schema Validation)
  - Multer (File Uploads)
  - Express Rate Limit (API Security)

## 📂 Project Architecture

The project follows a **Modular Architecture**, ensuring clean separation of concerns and easy maintainability.

```text
src/
├── config/             # Database & global configurations
├── middlewares/        # Auth, Validation, and Error handlers
├── modules/            # Core business logic (Feature-based)
│   ├── auth/           # Registration, Login, Verification
│   ├── chat/           # AI Chat and History management
│   ├── crop/           # AI-powered Crop recommendations
│   └── disease/        # Crop disease detection
├── services/           # Shared services (Email, File handling)
├── types/              # Global TypeScript types/interfaces
└── utils/              # Helper functions & utilities
```

## 🔌 API Endpoints (v1)

### Authentication
- `POST /api/v1/auth/register` - Create a new account
- `POST /api/v1/auth/verify` - Verify account via OTP/Email
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user profile

### AI Chat
- `POST /api/v1/chat/` - Send a message to AI
- `POST /api/v1/chat/stream` - Stream AI response
- `GET /api/v1/chat/all` - List all user chats
- `GET /api/v1/chat/:chatId` - Get specific chat history
- `DELETE /api/v1/chat/:chatId` - Delete a chat

### Crop Advisor
- `POST /api/v1/crop/` - Get AI crop recommendations based on location, season, and soil.

### Disease Detection
- `POST /api/v1/disease/detect` - Upload images for crop disease analysis.

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
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=8000
   DATABASE_URL=your_mongodb_url
   JWT_SECRET=your_jwt_secret
   GAN_AI_API_KEY=your_google_gemini_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   PEXELS_API_KEY=your_pexels_api_key
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   ```

4. **Run the server:**
   ```bash
   # Development mode
   pnpm dev

   # Build for production
   pnpm build
   pnpm start
   ```

## 📄 License

This project is licensed under the ISC License.
