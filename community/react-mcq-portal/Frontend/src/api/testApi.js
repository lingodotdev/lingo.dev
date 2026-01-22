import apiClient from './axiosConfig';

export const testApi = {
  // Get all tests with pagination and filtering
  getAllTests: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    // Add date filter params
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const url = `/tests/all${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(url);
  },

  // Get today's tests
  getTodayTests: () => {
    return apiClient.get('/tests');
  },

  // Get single test
  getTest: (testId) => {
    return apiClient.get(`/tests/${testId}`);
  },

  // Create new test
  createTest: (testData) => {
    return apiClient.post('/tests', testData);
  },

  // Update test
  updateTest: (testId, testData) => {
    return apiClient.patch(`/tests/${testId}`, testData);
  },

  // Delete test
  deleteTest: (testId) => {
    return apiClient.delete(`/tests/${testId}`);
  },

  // Get test results
  getTestResults: (testId) => {
    return apiClient.get(`/tests/${testId}/results`);
  }
};