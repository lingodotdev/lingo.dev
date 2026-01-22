# LinguaVerse - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Start the Backend Server

Open a terminal and run:

```bash
cd e:\lingo.dev\community\lingua-verse\server
npm run dev
```

You should see:

```
🚀 LinguaVerse Server Started
================================
📡 Server: http://localhost:5000
🌍 Environment: development
🔌 Socket.io: Ready
🌐 CORS: http://localhost:3000
🔑 Lingo.dev: Configured ✅
================================
```

### 2. Start the Frontend Application

Open a **new terminal** and run:

```bash
cd e:\lingo.dev\community\lingua-verse\app
npm run dev
```

You should see:

```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
```

### 3. Open Your Browser

Navigate to: **http://localhost:3000**

## 🎯 What to Try

### Test Real-Time Chat Translation

1. **Window 1**: Open http://localhost:3000
   - Enter name: "Alice"
   - Select language: "English"
   - Join chat

2. **Window 2**: Open http://localhost:3000 in incognito/another browser
   - Enter name: "Bob"
   - Select language: "Spanish"
   - Join chat

3. **Send messages**:
   - Alice: "Hello, how are you?"
   - Bob sees: "Hola, ¿cómo estás?" (auto-translated!)
   - Bob: "Muy bien, gracias"
   - Alice sees: "Very well, thank you" (auto-translated!)

### Test Document Collaboration

1. Click on "Document Editor" in the navigation
2. Create a new document
3. Start typing
4. Open the same document in another window with a different language
5. Watch real-time translation happen as you type!

### View Analytics

1. Click on "Language Dashboard"
2. See real-time stats:
   - Active users by language
   - Translation frequency
   - Cache performance
   - Beautiful charts and visualizations

## 🎨 Features to Explore

- **12 Languages**: English, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Russian, Arabic, Hindi, Italian
- **Real-Time Translation**: Every message and document is translated instantly
- **Smart Caching**: Frequently-used translations are cached for speed
- **Glossary Support**: Technical terms stay consistent across languages
- **Beautiful UI**: Dark mode with gradients, animations, and modern design
- **Analytics**: Track language usage and translation patterns

## 📝 Alternative: Run Both at Once

From the root directory:

```bash
cd e:\lingo.dev\community\lingua-verse
npm run dev
```

This starts both backend and frontend simultaneously!

## 🔧 Troubleshooting

**Port already in use?**

```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Can't connect to server?**

- Make sure backend is running on port 5000
- Check `.env` file has correct API key
- Verify CORS is configured properly

**Translations not working?**

- Check your Lingo.dev API key in `.env`
- Look at server console for errors
- Verify API key has sufficient quota

## 📚 Documentation

- **README.md**: Full project overview and features
- **SETUP.md**: Detailed setup instructions
- **walkthrough.md**: Complete implementation walkthrough

## 🎉 You're Ready!

LinguaVerse is now running. Open multiple browser windows with different languages and watch the magic happen! 🌍✨
