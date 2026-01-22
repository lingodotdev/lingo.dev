function QuestionPalette({
  questions,
  currentQuestionIndex,
  studentAnswers,
  visitedQuestions,
  markedForReview,
  onQuestionSelect,
}) {
  const getButtonStatusStyle = (index) => {
    let baseClasses = "w-10 h-10 m-1 cursor-pointer border-2 rounded-lg font-medium transition-all duration-200 ";
    
    if (index === currentQuestionIndex) {
      baseClasses += "bg-blue-600 text-white border-blue-700 scale-110";
    } else if (markedForReview.has(index)) {
      baseClasses += "bg-purple-600 text-white border-purple-700";
    } else if (studentAnswers.hasOwnProperty(index)) {
      baseClasses += "bg-green-500 text-white border-green-600";
    } else if (visitedQuestions.has(index)) {
      baseClasses += "bg-red-500 text-white border-red-600";
    } else {
      baseClasses += "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
    }

    return baseClasses;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Question Palette
        </h4>
      </div>
      
      {/* Questions Container - SCROLLS INDEPENDENTLY */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-wrap justify-center">
          {questions.map((_, index) => (
            <button
              key={index}
              className={getButtonStatusStyle(index)}
              onClick={() => onQuestionSelect(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Legend - Fixed at bottom */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <h5 className="text-sm font-medium text-gray-700 mb-3">Status Legend</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
            <span className="text-gray-600">Current</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-600 rounded mr-2"></div>
            <span className="text-gray-600">Marked</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-600">Attempted</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-600">Unattempted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionPalette;