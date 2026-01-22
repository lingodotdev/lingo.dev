import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { format } from 'date-fns';
import { usePageTitle } from '../hooks/usePageTitle';

function InstructionsPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState('');

  usePageTitle("Test Instructions");

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await apiClient.get(`/tests/${testId}`);
        setTest(response.data.data.test);
      } catch (err) {
        setError('Failed to load test details.');
      } finally {
        setLoading(false);
      }
    };
    const checkIfAttempted = async () => {
      try {
        const res = await apiClient.get(`/attempts/check/${testId}`);
        // res.data.data = { attempted: boolean, lastAttempt?: { ... } }
        setAttempted(Boolean(res.data?.data?.attempted));
        // optional: save last attempt if you want to show lastAttempt time/score
        // setLastAttempt(res.data.data.lastAttempt ?? null);
      } catch (err) {
        console.warn('Could not check attempt status', err?.response?.status || err);
        setAttempted(false);
      }
    };
    fetchTestDetails();
    checkIfAttempted();
  }, [testId]);

  const handleStartTest = () => {
    navigate(`/test/${testId}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
        <p className="text-gray-600 text-base sm:text-lg">Loading test instructions...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-4 sm:p-6 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Error Loading Test</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  if (!test) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-4 sm:p-6 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Test Not Found</h3>
        <p className="text-gray-600 mb-4">The test you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">{test.title}</h1>
                <p className="text-gray-600 text-base sm:text-lg">{test.description}</p>
              </div>
              <div className="bg-gray-100 rounded-full p-3 sm:p-4 self-start sm:self-auto">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Test Details Cards */}
          <div className="p-4 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Starts At</h3>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {format(new Date(test.startTime), "E, MMM d 'at' h:mm a")}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Duration</h3>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{test.examDuration} minutes</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Total Questions</h3>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{test.questions.length}</p>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-8 mb-6 sm:mb-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Test Instructions</h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-gray-700 text-xs sm:text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg">
                    This test consists of <strong>{test.questions.length} multiple-choice questions</strong>.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-gray-700 text-xs sm:text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg">
                    You will have <strong>{test.examDuration} minutes</strong> to complete the test.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-gray-700 text-xs sm:text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg">
                    Each correct answer will award you <strong>+4 marks</strong>.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-gray-700 text-xs sm:text-sm font-bold">4</span>
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg">
                    Each incorrect answer will result in a penalty of <strong>-1 mark</strong>.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-gray-700 text-xs sm:text-sm font-bold">5</span>
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg">
                    There is <strong>no penalty</strong> for unattempted questions.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-gray-700 text-xs sm:text-sm font-bold">6</span>
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg">
                    The timer will start as soon as you click the <strong>"Proceed to Test"</strong> button.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-gray-700 text-xs sm:text-sm font-bold">7</span>
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg">
                    The test will be submitted <strong>automatically</strong> when the time runs out.
                  </p>
                </div>

                <div className="flex items-start">
                  {/*<div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                    <span className="text-gray-700 text-xs sm:text-sm font-bold">Note:</span>
                  </div>*/}
                  <p className="text-gray-700 text-base sm:text-lg">
                    <strong>Note: </strong> appreaing for re-test, would <strong>delete the previous attempt</strong>, which cannot be recovered.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              
              {attempted ? (
                <button
                  onClick={handleStartTest}
                  className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-orange-400 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Retake Test
                </button>
              ):(
                <button
                  onClick={handleStartTest}
                  className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Proceed to Test
                </button>
              )}
            </div>

            {/* Important Note */}
            <div className="mt-6 sm:mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-yellow-800 mb-1">Important Note</h4>
                  <p className="text-yellow-700">
                    Once you start the test, the timer cannot be paused. Make sure you have a stable internet connection 
                    and won't be interrupted during the test duration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}

export default InstructionsPage;
