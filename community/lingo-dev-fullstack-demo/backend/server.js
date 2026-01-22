const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const LingoDevMock = require('./utils/lingoDevMock');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize LingoDev mock
const lingoDev = new LingoDevMock();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes

// Project management routes
app.get('/api/projects', (req, res) => {
  const projects = lingoDev.getAllProjects();
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  const { name, description, sourceLanguage, targetLanguages } = req.body;

  try {
    const newProject = await lingoDev.initProject({
      name,
      description,
      sourceLanguage,
      targetLanguages
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id', (req, res) => {
  try {
    const projects = lingoDev.getAllProjects();
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// File upload and management routes
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const projectId = req.body.projectId;
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const uploadedFiles = await lingoDev.uploadFiles(projectId, [req.file]);
    res.status(201).json(uploadedFiles[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/files/:projectId', (req, res) => {
  try {
    const files = lingoDev.getProjectFiles(req.params.projectId);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulate Lingo.dev localization process
app.post('/api/localize/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    // Start the localization process
    const project = await lingoDev.runLocalization(projectId);

    // Generate translated files
    const projectDetails = lingoDev.getAllProjects().find(p => p.id === projectId);
    if (projectDetails && projectDetails.targetLanguages) {
      await lingoDev.generateTranslatedFiles(projectId, projectDetails.targetLanguages);
    }

    res.json({
      message: 'Localization process completed successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get localization status
app.get('/api/status/:projectId', (req, res) => {
  try {
    const status = lingoDev.getProjectStatus(req.params.projectId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get translated files for a project
app.get('/api/translated-files/:projectId', (req, res) => {
  try {
    const translatedFiles = lingoDev.getTranslatedFiles(req.params.projectId);
    res.json(translatedFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project statistics
app.get('/api/stats/:projectId', (req, res) => {
  try {
    const stats = lingoDev.getProjectStats(req.params.projectId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get supported file formats
app.get('/api/formats', (req, res) => {
  try {
    const formats = lingoDev.getSupportedFormats();
    res.json(formats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Lingo.dev Localization Backend API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      files: '/api/files/:projectId',
      translatedFiles: '/api/translated-files/:projectId',
      stats: '/api/stats/:projectId',
      formats: '/api/formats',
      upload: '/api/upload',
      localize: '/api/localize/:projectId',
      status: '/api/status/:projectId'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});