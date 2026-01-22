# LinguaVerse Setup Guide

## Prerequisites

Before setting up LinguaVerse, ensure you have the following installed:

- **Node.js** version 18.0.0 or higher
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)
- **Lingo.dev API Key** (obtain from Lingo.dev dashboard)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd community/lingua-verse
```

### 2. Configure Environment Variables

Copy the example environment file and configure it with your settings:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Lingo.dev API key:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Lingo.dev Configuration
LINGO_API_KEY=your_actual_api_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Install Dependencies

Install all dependencies for the monorepo:

```bash
npm run install:all
```

This command will:

- Install root dependencies
- Install server dependencies
- Install app (frontend) dependencies

### 4. Start the Development Environment

Start both the backend and frontend servers concurrently:

```bash
npm run dev
```

This will start:

- **Backend server** on `http://localhost:5000`
- **Frontend application** on `http://localhost:3000`

### 5. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the LinguaVerse application. You'll be redirected to the chat workspace where you can enter your name and select your preferred language.

## Testing Real-Time Translation

To test the real-time translation features:

1. Open the application in two different browser windows (or use incognito mode)
2. In the first window, join as "User1" with language "English"
3. In the second window, join as "User2" with language "Spanish"
4. Send messages from either window and observe them being translated in real-time

## Available Scripts

From the root directory (`community/lingua-verse`):

- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:server` - Start only the backend server
- `npm run dev:app` - Start only the frontend application
- `npm run install:all` - Install all dependencies
- `npm run build` - Build the frontend for production
- `npm start` - Start both backend and frontend in production mode

From the `server` directory:

- `npm run dev` - Start backend with nodemon (auto-restart on changes)
- `npm start` - Start backend in production mode

From the `app` directory:

- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js for production
- `npm start` - Start Next.js in production mode
- `npm run lint` - Run ESLint

## Troubleshooting

### Port Already in Use

If you see an error that port 5000 or 3000 is already in use:

**Windows:**

```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**macOS/Linux:**

```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

### Socket.io Connection Issues

If the frontend cannot connect to the backend:

1. Verify the backend server is running on port 5000
2. Check that `NEXT_PUBLIC_SOCKET_URL` in `.env` is set correctly
3. Ensure CORS is configured properly in the backend
4. Check browser console for connection errors

### Translation Not Working

If translations are not appearing:

1. Verify your Lingo.dev API key is correctly set in `.env`
2. Check the server console for API errors
3. Ensure the Lingo.dev API is accessible from your network
4. Check the cache statistics in the analytics dashboard

### Module Not Found Errors

If you see "module not found" errors:

1. Delete `node_modules` folders in root, server, and app directories
2. Delete `package-lock.json` files
3. Run `npm run install:all` again

## Development Tips

### Hot Reload

Both the backend (via nodemon) and frontend (via Next.js) support hot reload. Changes to files will automatically restart the servers or refresh the browser.

### Debugging

To debug the backend:

1. Add `console.log()` statements in server code
2. Check the terminal running `npm run dev:server`

To debug the frontend:

1. Use browser DevTools (F12)
2. Check the Console tab for errors
3. Use the Network tab to inspect API calls and Socket.io events

### Testing Multiple Languages

To quickly test multiple languages:

1. Open the application in multiple browser windows
2. Use different language preferences in each window
3. Send messages and observe real-time translation
4. Check the analytics dashboard to see language distribution

## Production Deployment

For production deployment:

1. Build the frontend:

```bash
cd app
npm run build
```

2. Set environment variables for production:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SOCKET_URL=https://your-api-domain.com
```

3. Start the production servers:

```bash
npm start
```

Consider using process managers like PM2 for production:

```bash
npm install -g pm2
pm2 start server/index.js --name lingua-verse-server
pm2 start npm --name lingua-verse-app -- start
```

## Support

For issues or questions:

- Check the main README.md for architecture details
- Review the server logs for error messages
- Ensure all environment variables are correctly configured
- Verify your Lingo.dev API key is valid and has sufficient quota
