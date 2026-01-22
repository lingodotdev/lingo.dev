# Lingo.dev Localization Dashboard

A full-stack application demonstrating Lingo.dev's AI-powered localization capabilities. This application showcases how to integrate Lingo.dev into your development workflow for automated translation management.

## 🚀 Features

- **Project Management**: Create and manage localization projects
- **File Upload**: Support for multiple file formats (JSON, XML, PO, Properties, YAML, Markdown, etc.)
- **Real-time Processing**: Visualize the 5-step Lingo.dev localization process
- **Statistics Tracking**: Monitor translation progress and metrics
- **Multi-language Support**: Configure source and target languages
- **File Management**: View original and translated files side-by-side

## 🏗️ Architecture

This full-stack application consists of:

### Backend (Node.js/Express)
- RESTful API for project and file management
- Mock Lingo.dev integration simulating the real localization workflow
- File upload and processing capabilities
- Progress tracking for localization jobs

### Frontend (React/HTML/CSS)
- Interactive dashboard for managing localization projects
- Real-time visualization of the localization process
- File upload and management interface
- Statistics and progress monitoring

## 🔧 Technologies Used

- **Backend**: Node.js, Express.js, Multer (for file uploads)
- **Frontend**: React (via CDN), HTML, CSS, Bootstrap
- **API Communication**: Axios
- **Styling**: Bootstrap 5, Custom CSS
- **Icons**: Font Awesome

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd /workspaces/lingo.dev/community/lingo-dev-fullstack-demo/backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

The frontend is built with React via CDN and requires no build step. Simply serve the frontend directory:

1. Navigate to the frontend directory:
```bash
cd /workspaces/lingo.dev/community/lingo-dev-fullstack-demo/frontend
```

2. Serve the frontend (using live-server or similar):
```bash
npx live-server
```

Or use Python's built-in server:
```bash
python -m http.server 3000
```

The frontend will be available at `http://localhost:3000`

## 🌐 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project by ID

### Files
- `POST /api/upload` - Upload localization files
- `GET /api/files/:projectId` - Get files for a project
- `GET /api/translated-files/:projectId` - Get translated files for a project

### Localization
- `POST /api/localize/:projectId` - Start localization process
- `GET /api/status/:projectId` - Get project status
- `GET /api/stats/:projectId` - Get project statistics
- `GET /api/formats` - Get supported file formats

### System
- `GET /health` - Health check
- `GET /` - API documentation

## 🎯 How to Use

1. **Create a Project**: Click "New Project" to create a localization project
2. **Configure Languages**: Set source language and target languages
3. **Upload Files**: Upload your localization files (JSON, XML, etc.)
4. **Run Localization**: Click "Run LingoDev Localization" to start the process
5. **Monitor Progress**: Watch the 5-step process in real-time
6. **Download Results**: Access translated files once processing is complete

## 🔄 Lingo.dev Process Simulation

This demo simulates the real Lingo.dev 5-step process:

1. **Content Discovery**: Scanning project for translatable content
2. **Data Cleaning**: Filtering non-translatable content
3. **Delta Calculation**: Comparing with previous state
4. **Translation**: AI-powered translation in progress
5. **Content Injection**: Injecting translations back to files

## 📁 Supported File Formats

The application supports all major localization file formats:
- JSON
- Android XML
- Gettext PO
- Java Properties
- YAML
- Markdown
- Plain Text
- Flutter ARB
- XLIFF
- TypeScript/JavaScript
- Vue.js
- HTML

## 🧪 Testing the Application

1. Start the backend server
2. Serve the frontend
3. Create a new project
4. Upload sample localization files
5. Run the localization process
6. Verify that the process completes and translated files are generated

## 🤝 Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue if you find any problems or have suggestions for improvements.

## 📄 License

This project is part of the Lingo.dev community contributions and follows the repository's licensing terms.

## 🌐 About Lingo.dev

Lingo.dev is an AI-powered localization platform that automates the translation process for developers. It integrates seamlessly into your development workflow, supporting multiple file formats and providing real-time translation capabilities.

For more information about Lingo.dev, visit [lingo.dev](https://lingo.dev)