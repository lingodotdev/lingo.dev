// API base URL
const API_BASE_URL = 'http://localhost:5000';

// Main App Component
function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard'); // dashboard, create-project, project-detail
  const [projects, setProjects] = React.useState([]);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('info'); // info, success, warning, danger

  // State for form inputs
  const [projectForm, setProjectForm] = React.useState({
    name: '',
    description: '',
    sourceLanguage: 'en',
    targetLanguages: ['es', 'fr']
  });

  // State for file upload
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  // Fetch projects on component mount
  React.useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/projects`);
      setProjects(response.data);
    } catch (error) {
      showMessage('Error fetching projects', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Show message with type
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'targetLanguages') {
      // Convert comma-separated string to array
      setProjectForm(prev => ({
        ...prev,
        [name]: value.split(',').map(lang => lang.trim()).filter(lang => lang)
      }));
    } else {
      setProjectForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/projects`, projectForm);
      setProjects([...projects, response.data]);
      setProjectForm({
        name: '',
        description: '',
        sourceLanguage: 'en',
        targetLanguages: ['es', 'fr']
      });
      showMessage('Project created successfully!', 'success');
      setActiveTab('dashboard');
    } catch (error) {
      showMessage('Error creating project', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      showMessage('Please select a file to upload', 'warning');
      return;
    }

    if (!selectedProject) {
      showMessage('No project selected', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('projectId', selectedProject.id);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      clearInterval(interval);
      setUploadProgress(100);
      showMessage('File uploaded successfully!', 'success');
      
      // Refresh project details
      setTimeout(() => {
        fetchProjectDetails(selectedProject.id);
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);
    } catch (error) {
      showMessage('Error uploading file', 'danger');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Start localization process
  const startLocalization = async () => {
    if (!selectedProject) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/localize/${selectedProject.id}`);
      showMessage('Localization completed successfully!', 'success');
      
      // Refresh project details
      setTimeout(() => {
        fetchProjectDetails(selectedProject.id);
      }, 1000);
    } catch (error) {
      showMessage('Error starting localization', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Fetch project details
  const fetchProjectDetails = async (projectId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/projects/${projectId}`);
      setSelectedProject(response.data);
    } catch (error) {
      showMessage('Error fetching project details', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get LingoDev process description
  const getLingoDevProcessDescription = (status) => {
    const descriptions = {
      'discovering': 'Scanning project for translatable content',
      'cleaning': 'Filtering non-translatable content',
      'calculating_deltas': 'Comparing with previous state',
      'translating': 'AI-powered translation in progress',
      'injecting': 'Injecting translations back to files',
      'completed': 'Localization process completed successfully'
    };
    return descriptions[status] || 'Processing localization task';
  };

  // Render dashboard view
  const renderDashboard = () => (
    <div className="dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Localization Projects</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setActiveTab('create-project')}
        >
          <i className="fas fa-plus me-2"></i>New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-globe-americas fa-3x text-muted mb-3"></i>
          <h4>No projects yet</h4>
          <p className="text-muted">Create your first localization project to get started</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => setActiveTab('create-project')}
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="dashboard-grid">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="card project-card"
              onClick={() => {
                setSelectedProject(project);
                setActiveTab('project-detail');
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="card-title">{project.name}</h5>
                  <span className={`status-badge status-${project.status}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <p className="card-text text-muted">{project.description}</p>
                
                <div className="mt-3">
                  <div className="d-flex justify-content-between text-sm">
                    <small>
                      <i className="fas fa-language me-1"></i>
                      From: {project.sourceLanguage}
                    </small>
                    <small>
                      <i className="fas fa-exchange-alt me-1"></i>
                      To: {project.targetLanguages?.join(', ') || 'N/A'}
                    </small>
                  </div>
                  
                  <div className="mt-2">
                    <small className="text-muted">
                      <i className="far fa-calendar me-1"></i>
                      Created: {formatDate(project.createdAt)}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render create project form
  const renderCreateProject = () => (
    <div className="create-project">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Create New Localization Project</h2>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => setActiveTab('dashboard')}
        >
          <i className="fas fa-arrow-left me-2"></i>Back
        </button>
      </div>

      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmitProject}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Project Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={projectForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={projectForm.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="sourceLanguage" className="form-label">Source Language</label>
                      <select
                        className="form-select"
                        id="sourceLanguage"
                        name="sourceLanguage"
                        value={projectForm.sourceLanguage}
                        onChange={handleInputChange}
                      >
                        <option value="en">English (en)</option>
                        <option value="es">Spanish (es)</option>
                        <option value="fr">French (fr)</option>
                        <option value="de">German (de)</option>
                        <option value="ja">Japanese (ja)</option>
                        <option value="ko">Korean (ko)</option>
                        <option value="zh">Chinese (zh)</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="targetLanguages" className="form-label">Target Languages</label>
                      <input
                        type="text"
                        className="form-control"
                        id="targetLanguages"
                        name="targetLanguages"
                        placeholder="e.g., es, fr, de"
                        value={projectForm.targetLanguages.join(', ')}
                        onChange={handleInputChange}
                      />
                      <div className="form-text">Comma-separated language codes</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner me-2"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Create Project
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render project detail view
  const renderProjectDetail = () => {
    if (!selectedProject) return null;

    return (
      <div className="project-detail">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>{selectedProject.name}</h2>
            <p className="text-muted mb-0">{selectedProject.description}</p>
          </div>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fas fa-arrow-left me-2"></i>Back
          </button>
        </div>

        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="fas fa-language fa-2x text-primary mb-2"></i>
                <h5>Source</h5>
                <p className="mb-0">{selectedProject.sourceLanguage}</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="fas fa-exchange-alt fa-2x text-success mb-2"></i>
                <h5>Targets</h5>
                <p className="mb-0">{selectedProject.targetLanguages?.join(', ') || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                <h5>Status</h5>
                <span className={`status-badge status-${selectedProject.status}`}>
                  {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <i className="fas fa-calendar fa-2x text-info mb-2"></i>
                <h5>Created</h5>
                <p className="mb-0">{formatDate(selectedProject.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Statistics */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card bg-light">
              <div className="card-body text-center">
                <i className="fas fa-file fa-2x text-primary mb-2"></i>
                <h5>Total Strings</h5>
                <p className="display-6 mb-0">{selectedProject.stats?.totalStrings || 0}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-light">
              <div className="card-body text-center">
                <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                <h5>Translated</h5>
                <p className="display-6 mb-0">{selectedProject.stats?.translatedStrings || 0}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-light">
              <div className="card-body text-center">
                <i className="fas fa-file-code fa-2x text-info mb-2"></i>
                <h5>Processed Files</h5>
                <p className="display-6 mb-0">{selectedProject.stats?.processedFiles || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span><i className="fas fa-file-upload me-2"></i>Upload Localization Files</span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="fileInput" className="form-label">Select File</label>
                  <input
                    type="file"
                    className="form-control"
                    id="fileInput"
                    onChange={handleFileChange}
                    accept=".json,.xml,.po,.properties,.yaml,.yml,.md,.txt,.arb,.xliff,.ts,.js,.jsx,.vue,.html"
                  />
                  <div className="form-text">
                    Supported formats: JSON, XML, PO, Properties, YAML, Markdown, TXT, ARB, XLIFF, TS, JS, JSX, VUE, HTML
                  </div>
                </div>

                {selectedFile && (
                  <div className="alert alert-info">
                    Selected: <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
                  </div>
                )}

                <button
                  className="btn btn-success"
                  onClick={handleFileUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="loading-spinner me-2"></span>
                      Uploading {uploadProgress}%...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-cloud-upload-alt me-2"></i>
                      Upload File
                    </>
                  )}
                </button>
              </div>

              <div className="col-md-6">
                {uploadProgress > 0 && (
                  <div>
                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${uploadProgress}%` }}
                      >
                        {uploadProgress}%
                      </div>
                    </div>
                    <p className="text-center mt-2">
                      {uploadProgress < 100 ? 'Uploading...' : 'Upload complete!'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Files List */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span><i className="fas fa-folder-open me-2"></i>Uploaded Files</span>
          </div>
          <div className="card-body">
            <FileList projectId={selectedProject.id} />
          </div>
        </div>

        {/* Localization Controls */}
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span><i className="fas fa-magic me-2"></i>Localization Process</span>
          </div>
          <div className="card-body text-center">
            <p className="mb-3">Run the Lingo.dev localization process to translate your files using AI-powered translation</p>
            <button
              className="btn btn-primary btn-lg px-4 py-2"
              onClick={startLocalization}
              disabled={selectedProject.status === 'processing' || loading}
            >
              {selectedProject.status === 'processing' ? (
                <>
                  <span className="loading-spinner me-2"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-bolt me-2"></i>
                  Run LingoDev Localization
                </>
              )}
            </button>

            {(selectedProject.status === 'processing' || selectedProject.status === 'discovering' ||
              selectedProject.status === 'cleaning' || selectedProject.status === 'calculating_deltas' ||
              selectedProject.status === 'translating' || selectedProject.status === 'injecting') &&
              selectedProject.progress !== undefined && (
              <div className="mt-4">
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${selectedProject.progress}%` }}
                  >
                    {selectedProject.progress}%
                  </div>
                </div>
                <p className="mt-2 mb-0">
                  <strong>Current Step:</strong> {selectedProject.currentStep || 'Initializing...'}
                </p>
                <p className="text-muted">
                  {getLingoDevProcessDescription(selectedProject.status)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // FileList component
  const FileList = ({ projectId }) => {
    const [files, setFiles] = React.useState([]);
    const [translatedFiles, setTranslatedFiles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      fetchFiles();
      fetchTranslatedFiles();
    }, [projectId]);

    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/files/${projectId}`);
        setFiles(response.data.filter(file => !file.language)); // Original files only
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTranslatedFiles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/translated-files/${projectId}`);
        setTranslatedFiles(response.data);
      } catch (error) {
        console.error('Error fetching translated files:', error);
      }
    };

    if (loading) {
      return (
        <div className="text-center py-3">
          <div className="loading-spinner mx-auto"></div>
          <p>Loading files...</p>
        </div>
      );
    }

    return (
      <div>
        {/* Original Files */}
        <h5 className="mb-3">Original Files</h5>
        {files.length === 0 ? (
          <div className="text-center py-2">
            <p className="text-muted">No files uploaded yet</p>
          </div>
        ) : (
          <div className="file-list mb-4">
            {files.map(file => (
              <div key={file.id} className="file-item">
                <div>
                  <div className="file-name">
                    <i className="fas fa-file me-2"></i>
                    {file.originalName}
                  </div>
                  <div className="file-size text-muted">{formatFileSize(file.size)}</div>
                  {file.stats && (
                    <div className="file-stats text-muted">
                      <small>{file.stats.totalStrings} strings</small>
                    </div>
                  )}
                </div>
                <span className={`status-badge status-${file.status}`}>
                  {file.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Translated Files */}
        <h5 className="mb-3">Translated Files</h5>
        {translatedFiles.length === 0 ? (
          <div className="text-center py-2">
            <p className="text-muted">No translations generated yet</p>
          </div>
        ) : (
          <div className="file-list">
            {translatedFiles.map(file => (
              <div key={file.id} className="file-item">
                <div>
                  <div className="file-name">
                    <i className="fas fa-file-alt me-2"></i>
                    {file.fileName}
                  </div>
                  <div className="file-size text-muted">{formatFileSize(file.size || 1024)}</div>
                  <div className="file-language">
                    <small className="badge bg-primary">{file.language}</small>
                  </div>
                </div>
                <span className={`status-badge status-${file.status}`}>
                  {file.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header py-3">
        <div className="container">
          <div className="d-flex align-items-center">
            <div className="logo">
              <i className="fas fa-globe logo-icon"></i>
              <h1>Lingo.dev Localization Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Message Alert */}
      {message && (
        <div className="container mt-3">
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container">
        {loading && (
          <div className="text-center my-5">
            <div className="loading-spinner mx-auto"></div>
            <p>Loading...</p>
          </div>
        )}

        {!loading && activeTab === 'dashboard' && renderDashboard()}
        {!loading && activeTab === 'create-project' && renderCreateProject()}
        {!loading && activeTab === 'project-detail' && renderProjectDetail()}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>Lingo.dev Localization Demo Application</p>
          <p className="text-muted">Showcasing Lingo.dev's AI-powered localization capabilities</p>
        </div>
      </footer>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);