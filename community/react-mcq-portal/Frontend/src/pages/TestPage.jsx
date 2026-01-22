import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import Timer from '../components/Timer';
import QuestionPalette from '../components/QuestionPalette';
import { usePageTitle } from '../hooks/usePageTitle';

function TestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const effectRan = useRef(false);

  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentAnswers, setStudentAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [markedForReview, setMarkedForReview] = useState(new Set());

  usePageTitle("Test in Progress");

  useEffect(() => {
    if (effectRan.current === true) return;

    try {
      const justFinished = JSON.parse(sessionStorage.getItem('justFinishedAttempt') || 'null');
      if (justFinished && justFinished.testId === testId) {
        // clean up the flag so it won't interfere later
        sessionStorage.removeItem('justFinishedAttempt');
        // send them to dashboard instead of re-starting this test
        navigate('/', { replace: true });
        return;
      }
    } catch (e) {
      // ignore parse errors and continue normally
    }
    
    const initializeTest = async () => {
      try {
        const attemptResponse = await apiClient.post(`/attempts/${testId}/start`);
        setAttempt(attemptResponse.data.data);
        const testResponse = await apiClient.get(`/tests/${testId}`);
        setTest(testResponse.data.data.test);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to start the test. You may have already started it.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    initializeTest();
    return () => { effectRan.current = true; };
  }, [testId]);

  const goToNextQuestion = () => {
    if (test && currentQuestionIndex < test.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setVisitedQuestions(prev => new Set(prev).add(nextIndex));
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const jumpToQuestion = (index) => {
    if (test && index >= 0 && index < test.questions.length) {
      setCurrentQuestionIndex(index);
      setVisitedQuestions(prev => new Set(prev).add(index));
    }
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setStudentAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: optionIndex,
    }));
  };

  const submitTest = async () => {
    const formattedAnswers = Object.entries(studentAnswers).map(([questionId, selectedOption]) => ({
      questionId: parseInt(questionId, 10),
      selectedOption,
    }));
    try {
      const response = await apiClient.post(`/attempts/${testId}/submit`, { answers: formattedAnswers });
      sessionStorage.setItem('justFinishedAttempt', JSON.stringify({
        testId,
        attemptId: response.data.data.attemptId || attempt?.id || response.data.data.id || null,
        ts: Date.now()
      }));
      alert('Test submitted successfully!');
      navigate('/', { replace: true });
      navigate('/results', { state: { results: response.data.data, fromTest: true } });
    } catch (err) {
      if (err.code !== "ERR_CANCELED") {
        const errorMessage = err.response?.data?.message || 'Failed to submit the test.';
        setError(errorMessage);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitTest();
  };
  
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
        <p className="text-gray-600 text-base sm:text-lg">Preparing your test...</p>
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
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Test Error</h3>
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

  if (!test || !attempt) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <p className="text-gray-600">Test data is not available.</p>
    </div>
  );

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3 sm:py-4">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate min-w-0">{test.title}</h2>
              <span className="hidden sm:inline-flex bg-blue-100 text-blue-600 text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full flex-shrink-0">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </span>
            </div>

            <div className="mt-2 sm:mt-0 flex-shrink-0">
              <Timer 
                durationInMinutes={test.examDuration} 
                startTime={attempt.startedAt} 
                onTimeUp={submitTest} 
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col sm:flex-row max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 gap-4 sm:gap-6">
        <div className="w-full sm:w-80 flex-shrink-0">
          <div className="h-[70vh] sm:h-[calc(100vh-12rem)] overflow-y-auto overscroll-contain p-2">
            <QuestionPalette 
              questions={test.questions}
              currentQuestionIndex={currentQuestionIndex}
              studentAnswers={studentAnswers}
              visitedQuestions={visitedQuestions}
              markedForReview={markedForReview}
              onQuestionSelect={jumpToQuestion}
            />
          </div>
        </div>

        {/* Question Area - NO SCROLLING AT ALL */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 flex-1">
            <div className="h-full flex flex-col">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold mr-2 sm:mr-3">
                    {currentQuestionIndex + 1}
                  </span>
                  Question {currentQuestionIndex + 1}
                </h3>
                {markedForReview.has(currentQuestionIndex) && (
                  <span className="bg-purple-100 text-purple-600 text-xs sm:text-sm font-medium px-2 py-1 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Marked for Review
                  </span>
                )}
              </div>
              
              {/* Question Text */}
              <div className="mb-4 sm:mb-6">
                <p className="text-base sm:text-lg leading-relaxed">{currentQuestion.questionText}</p>
              </div>

              {/* Options - Takes remaining space but doesn't scroll */}
              <div className="space-y-3 flex-1">
                {currentQuestion.options.map((option, optionIndex) => (
                  <label 
                    key={optionIndex}
                    className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      studentAnswers[currentQuestionIndex] === optionIndex
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={optionIndex}
                      checked={studentAnswers[currentQuestionIndex] === optionIndex}
                      onChange={() => handleAnswerChange(currentQuestionIndex, optionIndex)}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 sm:ml-4 text-gray-700 flex-1">
                      <span className="font-medium text-gray-600 mr-2">
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Navigation - ALWAYS VISIBLE, NO SCROLLING NEEDED */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3">
              <div className="w-full sm:w-auto">
                <button 
                  onClick={goToPreviousQuestion} 
                  disabled={currentQuestionIndex === 0}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed font-medium py-2.5 px-4 sm:py-3 sm:px-6 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>
              </div>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center sm:space-x-3 gap-3">
                <button 
                  onClick={toggleMarkForReview}
                  className={`w-full sm:w-auto flex items-center justify-center space-x-2 font-medium py-2.5 px-4 sm:py-3 sm:px-6 rounded-lg transition-colors duration-200 ${
                    markedForReview.has(currentQuestionIndex)
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>{markedForReview.has(currentQuestionIndex) ? 'Unmark Review' : 'Mark for Review'}</span>
                </button>

                {currentQuestionIndex === test.questions.length - 1 ? (
                  <button 
                    onClick={handleSubmit}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 sm:py-3 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Submit Test</span>
                  </button>
                ) : (
                  <button 
                    onClick={goToNextQuestion}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 sm:py-3 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
