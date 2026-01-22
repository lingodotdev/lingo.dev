import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testApi } from '../../api/testApi';
import { format } from 'date-fns';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { usePageTitle } from '../../hooks/usePageTitle';
import Pagination from '../../components/Pagination';

function TeacherDashboardPage() {
  const [tests, setTests] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalTests: 0,
    activeTests: 0,
    upcomingTests: 0,
    pastTests: 0
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    startDate: '',
    endDate: ''
  });
  const [tempFilters, setTempFilters] = useState({
    startDate: '',
    endDate: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);

  usePageTitle("Manage Tests");

  // Fetch total stats (unfiltered)
  const fetchTotalStats = async () => {
    try {
      setStatsLoading(true);
      const response = await testApi.getAllTests({ limit: 1000 }); // Get all tests for stats
      const allTests = response.data.data.tests;
      
      const now = new Date();
      const stats = {
        totalTests: allTests.length,
        activeTests: allTests.filter(test => {
          const startTime = new Date(test.startTime);
          const endTime = new Date(test.endTime);
          return now >= startTime && now <= endTime;
        }).length,
        upcomingTests: allTests.filter(test => {
          const startTime = new Date(test.startTime);
          return now < startTime;
        }).length,
        pastTests: allTests.filter(test => {
          const endTime = new Date(test.endTime);
          return now > endTime;
        }).length
      };
      
      setTotalStats(stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch tests with current filters
  const fetchAllTests = async (params = {}) => {
    try {
      setLoading(true);
      const response = await testApi.getAllTests(params);
      setTests(response.data.data.tests);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError('Failed to fetch tests.');
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalStats();
    fetchAllTests(filters);
  }, []);

  useEffect(() => {
    fetchAllTests(filters);
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

  const openDeleteModal = (test) => {
    setTestToDelete(test);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTestToDelete(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!testToDelete) return;

    try {
      await testApi.deleteTest(testToDelete._id);
      // Refetch both stats and tests
      await fetchTotalStats();
      await fetchAllTests(filters);
      alert('Test deleted successfully.');
    } catch (err) {
      alert('Failed to delete test. Please try again.');
      console.error('Error deleting test:', err);
    } finally {
      closeDeleteModal();
    }
  };

  // Helper function to determine test status
  const getTestStatus = (test) => {
    const now = new Date();
    const startTime = new Date(test.startTime);
    const endTime = new Date(test.endTime);
    
    if (now < startTime) {
      return 'upcoming';
    } else if (now >= startTime && now <= endTime) {
      return 'active';
    } else {
      return 'past';
    }
  };

  const isFilterActive = filters.startDate || filters.endDate;

  if (loading && tests.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading Tests...</p>
      </div>
    </div>
  );

  if (error && tests.length === 0) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={() => fetchAllTests(filters)} 
          className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Manage Tests</h2>
            <p className="text-gray-600 mt-2">Manage all the tests you have created</p>
          </div>
          <Link 
            to="/teacher/create-test" 
            className="mt-4 lg:mt-0 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Test
          </Link>
        </div>
        <div className="border-t border-gray-200 mt-4"></div>
      </div>

      {/* Stats Overview - Always shows total counts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                ) : (
                  totalStats.totalTests
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tests</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                ) : (
                  totalStats.activeTests
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Tests</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                ) : (
                  totalStats.upcomingTests
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Past Tests</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                ) : (
                  totalStats.pastTests
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Tests by Date</h3>
        
        {/*<div className="flex flex-col md:flex-row gap-4 items-end">*/}
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
        {/*</div>*/}
      </div>

      {/* Results Count */}
      {pagination && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {tests.length} of {pagination.totalResults} tests
          {isFilterActive ? ' (filtered)' : ''}
        </div>
      )}

      {/* Tests List */}
      {tests.length > 0 ? (
        <>
          <div className="space-y-6">
            {tests.map((test) => {
              const status = getTestStatus(test);
              
              return (
                <div key={test._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 mr-3">{test.title}</h3>
                          {status === 'upcoming' && (
                            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                              Upcoming
                            </span>
                          )}
                          {status === 'active' && (
                            <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                              Active
                            </span>
                          )}
                          {status === 'past' && (
                            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                              Past
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">{test.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Starts at:</strong> {format(new Date(test.startTime), "E, MMM d 'at' h:mm a")}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Duration:</strong> {test.examDuration} minutes</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span><strong>Questions:</strong> {test.questions.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link to={`/teacher/test/${test._id}/results`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          View Results
                        </button>
                      </Link>
                      <Link to={`/teacher/test/${test._id}/edit`}>
                        <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      </Link>
                      <button 
                        onClick={() => openDeleteModal(test)}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
            {isFilterActive ? 'No tests found' : 'No tests created yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {isFilterActive 
              ? 'Try adjusting your date filters' 
              : 'Get started by creating your first test.'
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
              to="/teacher/create-test"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Test
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {testToDelete && (
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onRequestClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          testTitle={testToDelete.title}
        />
      )}
    </div>
  );
}

export default TeacherDashboardPage;