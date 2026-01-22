import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attemptApi } from '../api/attemptApi';
import { usePageTitle } from '../hooks/usePageTitle';
import Pagination from '../components/Pagination';

function PastAttemptsPage() {
  const [pastAttempts, setPastAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 4,
    startDate: '',
    endDate: ''
  });
  const [tempFilters, setTempFilters] = useState({
    startDate: '',
    endDate: ''
  });
  
  usePageTitle("Past Attempts");

  const fetchPastAttempts = async (params = {}) => {
    try {
      setLoading(true);
      const response = await attemptApi.getPastAttempts(params);
      setPastAttempts(response.data.data.pastTests);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError('Failed to fetch past attempts.');
      console.error('Error fetching past attempts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastAttempts(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    setFilters(prev => ({
      ...prev,
      ...tempFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      startDate: '',
      endDate: ''
    };
    setTempFilters(clearedFilters);
    setFilters(prev => ({
      ...prev,
      ...clearedFilters,
      page: 1
    }));
  };

  const handleTempFilterChange = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const isFilterActive = filters.startDate || filters.endDate;

  if (loading && pastAttempts.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading Past Attempts...</p>
      </div>
    </div>
  );

  if (error && pastAttempts.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={() => fetchPastAttempts(filters)} 
          className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">My Past Attempts</h2>
        <p className="text-gray-600 mt-2">Review your previous test performances</p>
      </div>

      {/* Filters Section - Matching ManageTestsPage design */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Attempts by Date</h3>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={tempFilters.startDate}
              onChange={(e) => handleTempFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={tempFilters.endDate}
              onChange={(e) => handleTempFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex gap-4 mt-4 justify-center">
          <button
            onClick={handleApplyFilters}
            disabled={!tempFilters.startDate && !tempFilters.endDate}
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
              tempFilters.startDate || tempFilters.endDate
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Apply Filters
          </button>
          
          <button
            onClick={handleClearFilters}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      {pagination && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {pastAttempts.length} of {pagination.totalResults} attempts
          {isFilterActive ? ' (filtered)' : ''}
        </div>
      )}

      {pastAttempts.length > 0 ? (
        <>
          <div className="space-y-6">
            {pastAttempts.map((attempt, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{attempt.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(attempt.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 text-center">
                      <div className="text-sm font-medium text-gray-500 mb-1">Score</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {attempt.summary.score} / {attempt.summary.totalMarks}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-500">Total Questions</div>
                      <div className="text-lg font-semibold text-gray-900">{attempt.summary.totalQuestions}</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-blue-600">Attempted</div>
                      <div className="text-lg font-semibold text-blue-700">{attempt.summary.attemptedQuestions}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-green-600">Correct</div>
                      <div className="text-lg font-semibold text-green-700">{attempt.summary.correctAnswers}</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-red-600">Incorrect</div>
                      <div className="text-lg font-semibold text-red-700">{attempt.summary.incorrectAnswers}</div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link 
                      to="/results" 
                      state={{ results: attempt }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                    >
                      Review Answers
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination 
              pagination={pagination} 
              onPageChange={handlePageChange} 
            />
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isFilterActive ? 'No attempts found' : 'No past attempts yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {isFilterActive 
              ? 'Try adjusting your date filters' 
              : 'You haven\'t completed any tests yet.'
            }
          </p>
          {isFilterActive ? (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Clear Filters
            </button>
          ) : (
            <Link 
              to="/"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Take a Test
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default PastAttemptsPage;