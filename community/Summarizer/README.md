# LingoForge: Your AI-Powered Toolkit

LingoForge is a web application designed to showcase a suite of powerful, AI-driven tools. Built with a modern tech stack, it provides a seamless and interactive user experience for both using and exploring AI capabilities. The application is designed to be modular, allowing for easy expansion with new tools.

## ✨ Features

- **Modern User Interface**: A clean, responsive, and dark-mode-first UI built with Next.js, ShadCN UI, and Tailwind CSS.
- **AI-Powered Tools**: Access to multiple tools that leverage generative AI to perform specific tasks. The current version includes:
    - **Documentation Generator**: Creates professional-grade documentation from simple inputs.
    - **Topic Summarizer**: Distills long pieces of text into concise summaries.
- **Self-aware AI Assistant**: An integrated chatbot that has knowledge of the application's own tools. It can answer questions about what tools are available and suggest relevant ones based on your needs. This is achieved by dynamically providing the AI with a list of the available tools.
- **Smart Search**: The dashboard's search bar uses AI to suggest the most relevant tools based on your query, making it easy to find what you're looking for.
- **Internationalization (i18n)**: Supports multiple languages with a convenient language switcher. Currently supports English, Spanish, French, German, and Japanese.
- **Collapsible Sidebar Navigation**: Easy navigation between the dashboard and various tools.

## 🛠️ Available Tools

The core of LingoForge is its collection of AI-powered tools. The architecture is designed so the AI assistant and search functionality are automatically aware of any new tools added to the application.

### 1. Documentation Generator

This tool automatically generates clear, concise, and user-friendly documentation. Simply provide the tool's name, description, features, and an example of its usage, and the AI will create professional-grade documentation for you.

### 2. Topic Summarizer

Paste any piece of text into the Topic Summarizer, and it will generate a brief, easy-to-digest summary highlighting the key points. This is perfect for quickly understanding long articles, reports, or documents.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**

    This project uses Google's Gemini models for its AI capabilities. You will need an API key from Google AI Studio.

    - Create a file named `.env` in the root of the project.
    - Add your API key to the `.env` file:
      ```
      GEMINI_API_KEY=your_google_ai_api_key_here
      ```
    You can get a free API key from [Google AI Studio](https://makersuite.google.com/).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:9002`.

## 🤖 Tech Stack & AI Integration

LingoForge is built with a modern and powerful tech stack, with a special focus on seamless AI integration.

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) is used to create and manage the AI flows that power the tools and assistant. It's configured with Google's **Gemini** models. The AI assistant and search are made "self-aware" by dynamically feeding them a manifest of the available tools directly from the application's data source. This makes the AI's knowledge of the application's capabilities easy to extend.
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for robust form validation.

## 🤝 Contributing

Contributions are welcome! If you have ideas for new tools or improvements, feel free to fork the repository, make your changes, and submit a pull request.
