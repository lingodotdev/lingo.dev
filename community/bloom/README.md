# 🌸 Bloom

## Introduction

Bloom is a mental health support platform designed to address the critical issue of people suffering silently with their mental health challenges. Every year, countless individuals struggle to find someone who truly understands what they're going through, leading to isolation, depression, and tragically, even suicide.

Bloom creates a safe space where people can:
- **Connect with others** who share similar mental states and life experiences
- **Share emotions freely** with those who genuinely understand their journey
- **Find support** from a community that has walked in similar shoes
- **Talk to an AI therapist** that interacts in a professional yet humanly compassionate manner

Our mission is to ensure that no one has to face their mental health struggles alone.

## Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and development server
- **JavaScript** - Programming language
- **Tailwind CSS** - Utility-first CSS framework
- **Lingo.dev/compiler** - Internationalization (i18n)

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe programming
- **Google Gemini Flash 2.5** - AI-powered therapy chatbot
- **Firestore** - NoSQL database for data storage
- **Firebase Authentication** - OAuth user authentication
- **ZegoCloud** - Real-time communication

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Git**

You'll also need accounts and API keys for:
- Firebase (Authentication + Firestore)
- Google Gemini API
- ZegoCloud (for real-time communication)
- Lingo.Dev (for internationalization)

## Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/adityaonrepeat/bloom.git
cd bloom
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=production | development
PORT=8080

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

#### Frontend Environment Variables
Create a `.env` file in the `frontend` directory:

```env
# Firebase Configuration
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id

# Backend API URL
VITE_API_URL=http://localhost:8080

# ZegoCloud Configuration
VITE_ZEGOCLOUD_APP_ID=your_zegocloud_app_id
VITE_ZEGOCLOUD_SERVER_SECRET=your_zegocloud_server_secret

# LINGO_DOT_DEV CONFIGURATION
LINGODOTDEV_API_KEY=your_lingo.dev_api_key
GROQ_API_KEY=your_groq_ai_api_key
```

### 4. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** and set up OAuth providers
4. Enable **Firestore Database**
5. Download your service account key (for backend) from Project Settings > Service Accounts
6. Get your web app configuration (for frontend) from Project Settings > General

### 5. Start the Development Servers

```bash
# Start backend server (from backend directory)
cd backend
npm run dev

# In a new terminal, start frontend (from frontend directory)
cd frontend
npm run dev
```

The application should now be running at:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:8080`

## Features

- **Anonymous Chat**: Share your feelings safely and anonymously with peers
- **AI Therapist (Aastha)**: Get professional support from our empathetic AI therapist powered by Google Gemini, available 24/7
- **Community Matching**: Connect with others experiencing similar mental health challenges
- **Mood Tracking**: Track your emotional journey over time
- **Real-time Communication**: Video and voice chat capabilities via ZegoCloud
- **Multilingual Support**: Interface available in multiple languages through Lingo internationalization
- **Secure & Private**: Your data and conversations are encrypted and protected with Firebase security

## Project Structure

```
bloom/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Contributing

We welcome contributions to Bloom! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Remember**: You are not alone. There are people who care and want to help. 🌸