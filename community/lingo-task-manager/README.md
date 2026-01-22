# Lingo.dev Task Manager - Full Stack Demo

A full-stack task management application demonstrating Lingo.dev's internationalization capabilities with a Node.js/Express backend and React frontend.

## Features

- ✅ Create, read, update, delete tasks
- 🌍 Multi-language support (English, Spanish, French)
- 🔄 Real-time language switching
- 📱 Responsive design
- 🎯 RESTful API
- 💾 In-memory database
- 🔒 Input validation
- ⚡ Fast development with Vite

## Prerequisites

- Node.js v18+
- npm or yarn

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:3001`

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Technologies Used

### Backend
- Express.js
- Lingo.dev
- CORS

### Frontend
- React 18
- Vite
- Axios
- TailwindCSS

## License

MIT License

## Author

Community Contribution to Lingo.dev