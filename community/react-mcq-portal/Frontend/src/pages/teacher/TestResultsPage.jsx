import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { usePageTitle } from '../../hooks/usePageTitle';

function TestResultsPage() {
  const { testId } = useParams();
  const [results, setResults] = useState([]);
  const [testTitle, setTestTitle] = useState('');
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  usePageTitle("Test Results");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await apiClient.get(`/tests/${testId}/results`);
        setResults(response.data.data.results);
        
        // Fetch test title separately if needed
        const testResponse = await apiClient.get(`/tests/${testId}`);
        setTestTitle(testResponse.data.data.test.title);

        const testResponse2 = await apiClient.get(`/tests/${testId}`);
        setTestDetails(testResponse2.data.data.test);
      } catch (err) {
        setError('Failed to fetch test results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [testId]);

  const totalMarks = testDetails ? testDetails.questions.length * 4 : 0;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading results...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Student Results</h2>
          <p className="text-gray-600 mt-2">
            {testTitle && `Results for: ${testTitle}`}
          </p>
        </div>
        <Link 
          to="/teacher/manage-tests" 
          className="mt-4 lg:mt-0 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.length > 0 
                  ? (results.reduce((sum, result) => sum + result.score, 0) / results.length).toFixed(1)
                  : '0'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Highest Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.length > 0 
                  ? Math.max(...results.map(result => result.score))
                  : '0'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Lowest Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.length > 0 
                  ? Math.min(...results.map(result => result.score))
                  : '0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Student Performance
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {results.length} student{results.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Table Content */}
        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Student Email
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((result, index) => {
                  const percentage = ((result.score / totalMarks) * 100).toFixed(1);
                  const getPerformanceColor = (percentage) => {
                    if (percentage >= 80) return 'text-green-600 bg-green-100';
                    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
                    if (percentage >= 40) return 'text-orange-600 bg-orange-100';
                    return 'text-red-600 bg-red-100';
                  };
                  const getPerformanceText = (percent) => {
                    if (percentage >= 80) return 'Excellent';
                    if (percentage >= 60) return 'Good';
                    if (percentage >= 40) return 'Average';
                    return 'Needs Improvement';
                  };

                  return (
                    <tr 
                      key={result.studentId} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <span className="text-blue-600 text-sm font-medium">
                              {result.name ? result.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-900 font-medium">{result.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600">{result.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900 font-medium">
                          {result.score} / {totalMarks}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-900 font-medium">{percentage}%</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPerformanceColor(percentage)}`}>
                          {getPerformanceText(percentage)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h3>
            <p className="text-gray-500">No students have attempted this test yet.</p>
          </div>
        )}
      </div>

      {/* Export Options */}
      {results.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Results
          </button>
        </div>
      )}
    </div>
  );
}

export default TestResultsPage;