import apiClient from './axiosConfig';

export const attemptApi = {
  // Get user's past attempts with pagination and filtering
  getPastAttempts: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    // Add date filter params
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const url = `/attempts/past${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(url);
  },

  // Check if user has attempted a specific test
  checkAttempt: (testId) => {
    return apiClient.get(`/attempts/check/${testId}`);
  },

  // Start a new attempt
  startAttempt: (testId) => {
    return apiClient.post(`/attempts/start/${testId}`);
  },

  // Submit an attempt
  submitAttempt: (testId, answers) => {
    return apiClient.post(`/attempts/submit/${testId}`, { answers });
  }
};