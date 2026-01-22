# Dev-Sprint Manager 🚀

A modern, multilingual project management tool built for hackathons and development teams. Features real-time chat translation powered by **Lingo.dev API** and a beautiful Kanban board interface.

![Dev-Sprint Manager](https://img.shields.io/badge/Status-Demo%20Ready-brightgreen)
![Lingo.dev](https://img.shields.io/badge/Powered%20by-Lingo.dev-blue)
![React](https://img.shields.io/badge/React-19.1.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646cff)

## ✨ Features

### 🌍 **Real-time Translation**
- **Live Chat Translation**: Messages translate instantly as you switch languages
- **UI Localization**: Complete interface translation via Lingo.dev API
- **CLI Integration**: Seamless integration with Lingo.dev CLI for batch translations
- **Supported Languages**: English, Hindi, Spanish, French, Japanese

### 📋 **Project Management**
- **Kanban Board**: Drag-and-drop task management
- **Real-time Updates**: Live synchronization with Supabase
- **Task Tracking**: Priority levels, estimates, and tags
- **Team Collaboration**: Multi-user support

### 💬 **Team Communication**
- **Real-time Chat**: Instant messaging with live translation
- **Discord Integration**: Community hub with member status
- **Multiple Tones**: Standard, Hacker, and Professional modes

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Framer Motion
- **Backend**: Express.js proxy server
- **Database**: Supabase (PostgreSQL)
- **Translation**: Lingo.dev API & CLI
- **Styling**: Custom CSS with Tailwind-inspired utilities
- **Real-time**: Supabase Realtime subscriptions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- Lingo.dev API key

### 1. Clone & Install

```bash
git clone <repository-url>
cd dev-sprint-manager
npm install
```

### 2. Environment Setup

Create `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Lingo.dev API Configuration
VITE_LINGO_API_KEY=your_lingo_dev_api_key
```

### 3. Database Setup

Run this SQL in your Supabase SQL editor:

```sql
-- Create messages table for chat
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table for Kanban board
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo',
    priority TEXT DEFAULT 'medium',
    estimate INTEGER DEFAULT 1,
    tag TEXT DEFAULT 'General',
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can read all messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Users can insert messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read all tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Users can insert tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update tasks" ON tasks FOR UPDATE USING (true);
```

### 4. Lingo.dev CLI Setup

Install and authenticate with Lingo.dev CLI:

```bash
# Install Lingo.dev CLI globally
npm install -g lingo.dev

# Authenticate (this will open browser)
lingo.dev login

# Or set API key directly
lingo.dev config set auth.apiKey your_api_key_here
```

### 5. Run the Application

```bash
# Start both translation server and frontend
npm run dev:full

# Or run separately:
npm run server  # Translation proxy server (port 3001)
npm run dev     # Frontend development server (port 5173)
```

## 🌐 Translation System

### How It Works

1. **User Changes Language** → Triggers CLI integration
2. **CLI Verification** → Checks Lingo.dev authentication
3. **API Translation** → Real-time translation via Lingo.dev API
4. **UI Updates** → Interface updates with translated content

### Translation Flow

```
Language Button Click
    ↓
CLI Status Check
    ↓
Trigger Translation API
    ↓
Update UI Components
    ↓
Cache Results
```

### Supported Languages

| Language | Code | Status |
|----------|------|--------|
| English  | `en` | ✅ Source |
| Hindi    | `hi` | ✅ Translated |
| Spanish  | `es` | ✅ Translated |
| French   | `fr` | ✅ Translated |
| Japanese | `ja` | ✅ Translated |

## 📁 Project Structure

```
dev-sprint-manager/
├── src/
│   ├── components/          # React components
│   │   ├── Chat.jsx        # Real-time chat with translation
│   │   ├── KanbanBoard.jsx # Task management board
│   │   └── AddTaskModal.jsx# Task creation modal
│   ├── lib/                # Utility libraries
│   │   ├── translations.js # Translation service
│   │   ├── lingo.js       # Lingo.dev API integration
│   │   └── cliIntegration.js# CLI command integration
│   ├── pages/              # Page components
│   │   └── Community.jsx   # Discord community integration
│   └── App.jsx             # Main application
├── locales/                # Translation files (JSON)
├── server.js               # Express translation proxy
├── i18n.json              # Lingo.dev CLI configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration

### Lingo.dev CLI Configuration (`i18n.json`)

```json
{
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["hi", "es", "fr", "ja"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale]/*.json"]
    }
  }
}
```

### Available Scripts

```bash
npm run dev          # Start frontend development server
npm run server       # Start translation proxy server
npm run dev:full     # Start both servers concurrently
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🎯 Demo Features

### 1. **Live Translation Demo**
- Switch between languages using the sidebar controls
- Watch chat messages translate in real-time
- See UI elements update instantly

### 2. **Kanban Board**
- Create, update, and move tasks
- Different visual themes (Standard, Hacker, Pro)
- Real-time collaboration

### 3. **Community Integration**
- Discord server member display
- Live member count and status
- Multilingual community interface

## 🔒 Security Notes

- All API keys are stored in environment variables
- No sensitive data is committed to the repository
- Supabase Row Level Security enabled
- CORS properly configured for development

## 🚀 Deployment

### Environment Variables for Production

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
VITE_LINGO_API_KEY=your_production_lingo_api_key
```

### Build Commands

```bash
npm run build
npm run preview
```

## 🤝 Contributing

This is a hackathon demo project showcasing Lingo.dev's translation capabilities. Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project as a starting point for your own applications.

## 🙏 Acknowledgments

- **Lingo.dev** - For providing the amazing translation API and CLI
- **Supabase** - For the real-time database and authentication
- **React Team** - For the excellent frontend framework
- **Vite** - For the lightning-fast development experience

## 📞 Support

For questions about this demo or Lingo.dev integration:

- 📧 Check Lingo.dev documentation
- 💬 Join the community Discord
- 🐛 Report issues in this repository

---

**Built with ❤️ for the developer community**