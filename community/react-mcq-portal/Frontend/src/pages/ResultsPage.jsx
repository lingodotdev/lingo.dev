import { useLocation, Navigate, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';

function ResultsPage() {

  usePageTitle("Test Results");

  const location = useLocation();
  const navigate = useNavigate();
  const fromTest = location.state?.fromTest;
  const results = location.state?.results;
  const [showAnswers, setShowAnswers] = useState(false);

  if (!results) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    sessionStorage.removeItem('justFinishedAttempt');
  }, []);

  const getAnswerStyle = (question, optionIndex) => {
    const isCorrect = optionIndex === question.correctAnswer;
    const isStudentAnswer = optionIndex === question.studentAnswer;

    if (isCorrect) return { color: 'green', fontWeight: 'bold' };
    if (isStudentAnswer && !isCorrect) return { color: 'red' };
    return { color: 'black' };
  };

  // Calculate percentage score
  const percentage = ((results.summary.score / results.summary.totalMarks) * 100).toFixed(1);
  
  // Determine performance level
  const getPerformanceLevel = () => {
    if (percentage >= 80) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
    if (percentage >= 60) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' };
    if (percentage >= 40) return { level: 'Average', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' };
    return { level: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
  };

  const performance = getPerformanceLevel();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Test Results</h2>
          <p className="text-gray-600 mt-2">Detailed performance analysis</p>
        </div>
        <Link 
          to="/" 
          className="mt-4 lg:mt-0 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Test Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{results.title}</h3>
            <p className="text-gray-600">
              Attempted on: {new Date(results.submittedAt).toLocaleString()}
            </p>
          </div>
          <div className="mt-4 lg:mt-0 text-center">
            <div className={`text-2xl font-bold ${performance.color}`}>
              {percentage}%
            </div>
            <div className={`text-sm font-medium px-3 py-1 rounded-full ${performance.bg} ${performance.color} ${performance.border}`}>
              {performance.level}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">{results.summary.score} / {results.summary.totalMarks}</div>
          <div className="text-sm font-medium text-gray-700">Final Score</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">{results.summary.correctAnswers}</div>
          <div className="text-sm font-medium text-gray-700">Correct Answers</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">{results.summary.incorrectAnswers}</div>
          <div className="text-sm font-medium text-gray-700">Incorrect Answers</div>
        </div>
      </div>

      {/* Detailed Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Performance Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Questions:</span>
              <span className="font-semibold text-gray-900">{results.summary.totalQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Questions Attempted:</span>
              <span className="font-semibold text-green-600">{results.summary.attemptedQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Unattempted Questions:</span>
              <span className="font-semibold text-orange-600">{results.summary.unattemptedQuestions}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Accuracy Rate:</span>
              <span className="font-semibold text-blue-600">
                {((results.summary.correctAnswers / results.summary.attemptedQuestions) * 100 || 0).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate:</span>
              <span className="font-semibold text-purple-600">
                {((results.summary.attemptedQuestions / results.summary.totalQuestions) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Answers Button */}
      <div className="text-center mb-6">
        <button 
          onClick={() => setShowAnswers(!showAnswers)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto"
        >
          <svg className={`w-4 h-4 mr-2 transition-transform duration-200 ${showAnswers ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showAnswers ? 'Hide Detailed Answers' : 'Show Detailed Answers'}
        </button>
      </div>

      {/* Detailed Answers Section */}
      {showAnswers && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Answer Key & Review
          </h3>
          
          <div className="space-y-8">
            {results.questions.map((q, index) => {
              const isCorrect = q.studentAnswer === q.correctAnswer;
              const isUnattempted = q.studentAnswer === null;
              
              return (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900 flex items-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-3 ${
                        isCorrect 
                          ? 'bg-green-100 text-green-600' 
                          : isUnattempted 
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-red-100 text-red-600'
                      }`}>
                        {index + 1}
                      </span>
                      Question {index + 1}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {isCorrect && (
                        <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                          Correct
                        </span>
                      )}
                      {!isCorrect && !isUnattempted && (
                        <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                          Incorrect
                        </span>
                      )}
                      {isUnattempted && (
                        <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded-full">
                          Unattempted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className="text-gray-700 mb-4 text-lg">{q.questionText}</p>

                  {/* Options */}
                  <div className="space-y-3">
                    {q.options.map((option, optionIndex) => {
                      const isCorrectOption = optionIndex === q.correctAnswer;
                      const isStudentOption = optionIndex === q.studentAnswer;
                      
                      let optionClasses = "p-3 border-2 rounded-lg ";
                      
                      if (isCorrectOption) {
                        optionClasses += "bg-green-50 border-green-200 text-green-800";
                      } else if (isStudentOption && !isCorrectOption) {
                        optionClasses += "bg-red-50 border-red-200 text-red-800";
                      } else {
                        optionClasses += "bg-gray-50 border-gray-200 text-gray-700";
                      }

                      return (
                        <div key={optionIndex} className={optionClasses}>
                          <div className="flex items-center">
                            <span className="font-medium mr-3">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span>{option}</span>
                            {isCorrectOption && (
                              <span className="ml-auto bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                                Correct Answer
                              </span>
                            )}
                            {isStudentOption && !isCorrectOption && (
                              <span className="ml-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                                Your Answer
                              </span>
                            )}
                            {isStudentOption && isCorrectOption && (
                              <span className="ml-auto bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                                Your Correct Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Unattempted Message */}
                  {isUnattempted && (
                    <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="flex items-center text-orange-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        You did not answer this question.
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsPage;