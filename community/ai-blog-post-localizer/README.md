# AI Blog Localization Tool

An AI-powered blog localization tool that allows users to paste blog content and instantly translate it into other languages while preserving structure and tone using **lingo.dev**.

This project demonstrates a full localization workflow using a React frontend and an Express + TypeScript backend.

---

## 🚀 Features

- Paste blog content directly in the UI
- Automatically generates `en.json` as source content
- Uses lingo.dev to generate translated files (e.g. `es.json`)
- Displays translated content on the frontend
- Clean API-based architecture

---

## 🧰 Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express
- TypeScript
- lingo.dev CLI

---

## ✅ Prerequisites

Make sure you have the following installed before running the project:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **lingo.dev CLI**
- A valid **lingo.dev API key**

Create a `.env` file in the backend folder:

```env
LINGO_API_KEY=your_lingo_api_key_here
PORT=4000
