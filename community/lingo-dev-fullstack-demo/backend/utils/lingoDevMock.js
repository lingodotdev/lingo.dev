/**
 * Mock Lingo.dev Integration Module
 * This simulates the actual Lingo.dev CLI functionality for demonstration purposes
 * Based on the real Lingo.dev architecture: content discovery, data cleaning,
 * delta calculation, localization engine, and content injection
 */

class LingoDevMock {
  constructor(config = {}) {
    this.config = config;
    this.projects = [];
    this.files = [];
    this.translations = new Map(); // Store translation mappings
  }

  /**
   * Initialize a new localization project
   */
  async initProject(projectData) {
    const project = {
      id: Date.now().toString(),
      ...projectData,
      createdAt: new Date().toISOString(),
      status: 'initialized',
      progress: 0,
      stats: {
        totalStrings: 0,
        translatedStrings: 0,
        processedFiles: 0
      }
    };

    this.projects.push(project);
    return project;
  }

  /**
   * Upload files for localization
   */
  async uploadFiles(projectId, files) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    const uploadedFiles = files.map(file => {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

      // Extract translatable strings from file content (mock implementation)
      const translatableStrings = this.extractTranslatableStrings(file.path);

      const fileRecord = {
        id: fileId,
        projectId,
        originalName: file.originalname,
        fileName: file.filename,
        path: file.path,
        size: file.size,
        type: this.getFileType(file.originalname),
        uploadedAt: new Date().toISOString(),
        status: 'uploaded',
        stats: {
          totalStrings: translatableStrings.length,
          extractedStrings: translatableStrings
        }
      };

      // Update project stats
      project.stats.totalStrings += translatableStrings.length;

      return fileRecord;
    });

    this.files.push(...uploadedFiles);
    return uploadedFiles;
  }

  /**
   * Extract translatable strings from file content (mock implementation)
   */
  extractTranslatableStrings(filePath) {
    // In a real implementation, this would parse the file and extract strings
    // For demo purposes, we'll generate some mock strings
    const mockStrings = [
      `Welcome message from ${filePath}`,
      `Button label for ${filePath}`,
      `Error message in ${filePath}`,
      `Title for ${filePath}`,
      `Description text in ${filePath}`
    ];

    return mockStrings.map((str, idx) => ({
      id: `string_${Date.now()}_${idx}`,
      key: `key_${idx}`,
      value: str,
      context: `Extracted from ${filePath}`,
      hash: this.calculateHash(str) // For delta calculation
    }));
  }

  /**
   * Calculate SHA-256 hash for content fingerprinting (mock implementation)
   */
  calculateHash(content) {
    // In a real implementation, this would calculate actual SHA-256
    // For demo purposes, we'll create a simple hash
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Determine file type based on extension
   */
  getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const typeMap = {
      'json': 'json',
      'xml': 'android_xml',
      'po': 'gettext',
      'properties': 'java_properties',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'txt': 'plaintext',
      'arb': 'flutter_arb',
      'xliff': 'xliff',
      'ts': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'vue': 'vue',
      'html': 'html'
    };

    return typeMap[ext] || 'unknown';
  }

  /**
   * Run localization process (simulating the 5-step Lingo.dev process)
   */
  async runLocalization(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    project.status = 'discovering';
    project.progress = 0;

    // Step 1: Content Discovery (scan project for translatable content)
    await this.delay(800);
    project.progress = 10;
    project.currentStep = 'Discovering content';
    project.status = 'discovering';
    console.log(`Project ${projectId}: Discovering content`);

    // Step 2: Data Cleaning (filter out non-translatable content)
    await this.delay(600);
    project.progress = 25;
    project.currentStep = 'Cleaning data';
    project.status = 'cleaning';
    console.log(`Project ${projectId}: Cleaning data`);

    // Step 3: Delta Calculation (compare with previous state)
    await this.delay(700);
    project.progress = 50;
    project.currentStep = 'Calculating deltas';
    project.status = 'calculating_deltas';
    console.log(`Project ${projectId}: Calculating deltas`);

    // Step 4: Translation (AI-powered translation)
    await this.delay(1200);
    project.progress = 80;
    project.currentStep = 'Translating content';
    project.status = 'translating';
    console.log(`Project ${projectId}: Translating content`);

    // Step 5: Content Injection (inject translations back to files)
    await this.delay(600);
    project.progress = 95;
    project.currentStep = 'Injecting translations';
    project.status = 'injecting';
    console.log(`Project ${projectId}: Injecting translations`);

    // Finalizing
    await this.delay(400);
    project.progress = 100;
    project.status = 'completed';
    project.completedAt = new Date().toISOString();
    project.stats.processedFiles = this.getProjectFiles(projectId).length;

    console.log(`Project ${projectId}: Localization completed`);

    // Generate translated files
    await this.generateTranslatedFiles(projectId, project.targetLanguages);

    return project;
  }

  /**
   * Get project status
   */
  getProjectStatus(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    return {
      id: project.id,
      status: project.status,
      progress: project.progress,
      currentStep: project.currentStep || null,
      createdAt: project.createdAt,
      completedAt: project.completedAt,
      stats: project.stats
    };
  }

  /**
   * Get all projects
   */
  getAllProjects() {
    return this.projects;
  }

  /**
   * Get files for a project
   */
  getProjectFiles(projectId) {
    return this.files.filter(file => file.projectId === projectId);
  }

  /**
   * Get translated files for a project
   */
  getTranslatedFiles(projectId) {
    return this.files.filter(file =>
      file.projectId === projectId &&
      file.language &&
      file.originalFileId
    );
  }

  /**
   * Generate translated files
   */
  async generateTranslatedFiles(projectId, targetLanguages) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    const projectFiles = this.getProjectFiles(projectId);

    for (const file of projectFiles) {
      for (const lang of targetLanguages) {
        // Create translated version of the file
        const translatedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          originalFileId: file.id,
          projectId,
          language: lang,
          fileName: `${file.fileName.replace(/\.[^/.]+$/, '')}_${lang}.${file.fileName.split('.').pop()}`,
          path: `translated/${file.fileName.replace(/\.[^/.]+$/, '')}_${lang}.${file.fileName.split('.').pop()}`,
          status: 'generated',
          generatedAt: new Date().toISOString(),
          stats: {
            totalStrings: file.stats.totalStrings,
            translatedStrings: file.stats.totalStrings
          }
        };

        // Update project stats
        project.stats.translatedStrings += file.stats.totalStrings;

        this.files.push(translatedFile);
      }
    }
  }

  /**
   * Get project statistics
   */
  getProjectStats(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    return project.stats;
  }

  /**
   * Get supported file formats (as per Lingo.dev documentation)
   */
  getSupportedFormats() {
    return [
      'JSON', 'Android XML', 'CSV', 'Flutter ARB', 'Gettext PO', 'HTML',
      'Java Properties', 'Markdown', 'Plain Text', 'Ruby on Rails YAML',
      'TypeScript', 'Vue.js JSON', 'XLIFF', 'XML', 'YAML'
    ];
  }

  /**
   * Helper to simulate async delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = LingoDevMock;