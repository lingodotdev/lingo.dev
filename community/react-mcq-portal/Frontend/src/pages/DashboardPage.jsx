import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import { format } from 'date-fns';
import { usePageTitle } from '../hooks/usePageTitle';

function DashboardPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  usePageTitle("Dashboard");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTests = async () => {
      try {
        const response = await apiClient.get('/tests');
        setTests(response.data.data.tests);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch tests.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [user]);

  // Filter tests for today
  const today = new Date().toDateString();
  const todaysTests = tests.filter(test => 
    new Date(test.startTime).toDateString() === today
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading Page...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with role-specific greeting */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name || 'User'}!
        </h2>
        <p className="text-gray-600 mt-2">
          {user?.role === 'teacher' || user?.role === 'admin' 
            ? "Here are today's scheduled tests and quick actions"
            : "Here are your available tests for today"
          }
        </p>
      </div>

      {/* Teacher/Admin Quick Actions */}
      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/teacher/create-test" 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create Test</h3>
                <p className="text-gray-600 text-sm">Create a new test</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/teacher/manage-tests" 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Tests</h3>
                <p className="text-gray-600 text-sm">View all tests</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/teacher/create-user" 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create User</h3>
                <p className="text-gray-600 text-sm">Add new users</p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Today's Tests Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {user?.role === 'teacher' || user?.role === 'admin' 
            ? "Today's Scheduled Tests" 
            : "Today's Available Tests"
          }
        </h3>
        <div className="border-t border-gray-200 mt-2"></div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!error && (
        todaysTests.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {todaysTests.map((test) => (
              <div key={test._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{test.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Starts at:</strong> {format(new Date(test.startTime), "E, MMM d 'at' h:mm a")}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Duration:</strong> {test.examDuration} minutes</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Questions:</strong> {test.questions.length}</span>
                    </div>
                  </div>

                  {/* Different buttons based on role */}
                  {user?.role === 'student' ? (
                    <Link to={`/instructions/${test._id}`}>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                        Start Test
                      </button>
                    </Link>
                  ) : (
                    <div className="flex space-x-2">
                      <Link to={`/teacher/test/${test._id}/results`} className="flex-1">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                          View Results
                        </button>
                      </Link>
                      <Link to={`/teacher/test/${test._id}/edit`} className="flex-1">
                        <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                          Edit
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg">
              {user?.role === 'teacher' || user?.role === 'admin' 
                ? "No tests scheduled for today."
                : "No tests available for you today."
              }
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default DashboardPage;