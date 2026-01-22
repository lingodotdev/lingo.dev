# MCP Integration Tutorial Platform

> An interactive learning platform for mastering Lingo.dev's Model Context Protocol (MCP) for instant i18n setup in React applications.

![Platform Preview](https://img.shields.io/badge/Status-Active-success)
![Framework](https://img.shields.io/badge/MERN-Stack-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 What is This?

This platform teaches developers how to use **Lingo.dev MCP** to set up internationalization in their React applications **in seconds** instead of hours. Through interactive tutorials, code playground, and step-by-step guides, you'll master the power of Model Context Protocol for instant i18n configuration.

### What is Lingo.dev MCP?

Model Context Protocol (MCP) enables AI coding assistants (Claude Code, Cursor, GitHub Copilot Agents, etc.) to integrate with external tools. Lingo.dev's MCP implementation allows you to set up complete i18n infrastructure with a single prompt:

```
"Set up i18n with locales: en, es, fr. Default is 'en'."
```

The MCP automatically generates:
- ✅ Locale-based routes (`/en`, `/es`, `/fr`)
- ✅ Language switcher components
- ✅ Automatic locale detection
- ✅ Middleware configuration
- ✅ i18n routing setup

## 🚀 Features

### Interactive Tutorials
- **Next.js App Router** - Complete guide for Next.js 13-16 App Router
- **Next.js Pages Router** - Setup instructions for Pages Router
- **React Router v7** - i18n configuration for React Router v7
- Step-by-step instructions with code examples
- Before/after code comparisons
- Progress tracking

### Code Playground
- Interactive Monaco Editor (same as VS Code)
- Try different MCP prompts
- See generated code in real-time
- Example prompts for each framework
- Copy to clipboard functionality

### Modern UI/UX
- Dark mode design with premium aesthetics
- Smooth animations and transitions
- Responsive design (mobile, tablet, desktop)
- Glassmorphism effects
- Gradient accents

## 📚 Supported Frameworks

- ✅ Next.js App Router (v13-16)
- ✅ Next.js Pages Router (v13-16)
- ✅ React Router (v7)
- 🔜 TanStack Start (v1) - Coming Soon

## 🛠️ Tech Stack

### Frontend
- **React** with **Vite** - Fast, modern build tool
- **React Router** - Client-side routing
- **Monaco Editor** - VSCode-powered code editor
- **Vanilla CSS** - Custom design system with CSS variables

### Backend
- **Node.js** + **Express** - REST API server
- **MongoDB** - Database for user progress (optional)
- **JWT** - Authentication (optional for MVP)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (optional, for progress tracking)

### Clone the Repository

```bash
cd e:\WORKINGPROJECTS\lingoHackathon\lingo.dev\community\mcp-tutorial-platform
```

### Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mcp-tutorial-platform
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## 🚀 Running Locally

### Development Mode

#### Start Backend

```bash
cd server
npm run dev
```

Backend runs on [http://localhost:5000](http://localhost:5000)

#### Start Frontend

```bash
cd client
npm run dev
```

Frontend runs on [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
# Frontend
cd client
npm run build

# Backend
cd server
npm start
```

## 📖 Usage

1. **Explore Landing Page** - Learn about Lingo.dev MCP
2. **Browse Tutorials** - Filter by framework and choose a tutorial
3. **Follow Steps** - Complete step-by-step guides with code examples
4. **Try Playground** - Experiment with MCP prompts and see generated code
5. **Copy & Use** - Copy generated code to your own projects

## 🎯 Lingo.dev Features Highlighted

This platform showcases the following Lingo.dev features:

1. **Model Context Protocol (MCP)** - Main focus of the platform
2. **Instant i18n Setup** - Automated configuration generation
3. **Framework Support** - Multi-framework compatibility
4. **Best Practices** - Production-ready code generation
5. **Developer Experience** - Seamless integration with AI assistants

## 🏗️ Project Structure

```
mcp-tutorial-platform/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── CodeComparison.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── TutorialsPage.jsx
│   │   │   ├── TutorialDetailPage.jsx
│   │   │   └── PlaygroundPage.jsx
│   │   ├── data/            # Tutorial content
│   │   │   └── tutorialData.js
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   └── package.json
│
├── server/                   # Express backend
│   ├── routes/              # API routes
│   ├── models/              # MongoDB models
│   ├── server.js            # Server entry point
│   └── package.json
│
└── README.md                # This file
```

## 🎨 Design Highlights

- **Color Palette** - Premium purple/blue gradients
- **Typography** - Inter font family for modern look
- **Animations** - Smooth fade-ins, hover effects, transitions
- **Responsive** - Mobile-first design approach
- **Accessibility** - Semantic HTML, keyboard navigation

## 🤝 Contributing to Lingo.dev

This project is part of the **Lingo.dev Community Contributions**. We welcome:

- Additional framework tutorials (TanStack Start, Remix, etc.)
- UI/UX improvements
- Bug fixes and optimizations
- Documentation enhancements

## 📝 License

This project is licensed under the same terms as the Lingo.dev repository.

## 🔗 Links

- **Lingo.dev MCP Docs**: https://lingo.dev/en/mcp
- **Lingo.dev Website**: https://lingo.dev
- **GitHub Repository**: https://github.com/lingodotdev/lingo.dev
- **Discord Community**: https://lingo.dev/go/discord

## 🙏 Acknowledgments

- **Lingo.dev Team** - For creating an amazing i18n tool
- **Community Contributors** - For feedback and support
- **React & Vite Teams** - For excellent development tools

---

**Built with ❤️ for the Lingo.dev community hackathon**

*Showcasing the power of Lingo.dev MCP for instant internationalization setup*
