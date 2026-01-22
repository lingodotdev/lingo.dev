# Test Script for Lingo.dev Localization Dashboard

## Manual Testing Steps

### Backend Testing

1. **Start the backend server**:
   ```bash
   cd /workspaces/lingo.dev/community/lingo-dev-fullstack-demo/backend
   npm install
   npm start
   ```
   
2. **Verify the server is running**:
   - Visit `http://localhost:5000/health` - should return status OK
   - Visit `http://localhost:5000/` - should return API documentation

3. **Test API endpoints manually** (using curl or Postman):
   - POST `/api/projects` - Create a new project
   - GET `/api/projects` - List all projects
   - GET `/api/formats` - Check supported file formats

### Frontend Testing

1. **Serve the frontend**:
   ```bash
   cd /workspaces/lingo.dev/community/lingo-dev-fullstack-demo/frontend
   npx live-server
   ```
   
2. **Navigate to the application** in your browser (typically `http://localhost:8080`)

3. **Test the UI functionality**:
   - Verify the dashboard loads correctly
   - Create a new project
   - Upload a sample file
   - Start the localization process
   - Verify progress visualization works
   - Check that translated files appear after processing

### Complete Workflow Test

1. **Create a project**:
   - Name: "Test Project"
   - Description: "Sample project for testing"
   - Source Language: "en" (English)
   - Target Languages: "es, fr" (Spanish, French)

2. **Upload a sample file**:
   - Use a simple JSON file with key-value pairs
   - Example: `{"welcome": "Welcome", "button": "Click Me"}`

3. **Run localization**:
   - Click "Run LingoDev Localization"
   - Observe the 5-step process visualization
   - Wait for completion

4. **Verify results**:
   - Check that translated files appear in the file list
   - Verify project statistics update correctly
   - Confirm status changes to "completed"

### Expected Behavior

- The application should handle all API requests without errors
- Progress indicators should update in real-time during localization
- File uploads should work for supported formats
- The UI should remain responsive during processing
- Statistics should accurately reflect the localization progress

### Troubleshooting

If you encounter issues:

1. Check that the backend server is running on port 5000
2. Verify the frontend can reach the backend API
3. Check browser console for JavaScript errors
4. Review server logs for any error messages
5. Ensure all dependencies are properly installed

### Success Criteria

- [ ] Backend server starts without errors
- [ ] Frontend loads and connects to backend
- [ ] Project creation works
- [ ] File upload functionality works
- [ ] Localization process runs and completes
- [ ] Progress visualization updates correctly
- [ ] Translated files are generated
- [ ] Statistics are displayed accurately