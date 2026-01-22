import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import apiClient from '../../api/axiosConfig';
import { usePageTitle } from '../../hooks/usePageTitle';

function CreateTestPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examDuration, setExamDuration] = useState(60);
  const [startTime, setStartTime] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);

  usePageTitle("Create Test");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const csvString = XLSX.utils.sheet_to_csv(worksheet);

        Papa.parse(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const formattedQuestions = results.data.map(row => {
              if (!row.questionText) return null;
              return {
                questionText: row.questionText,
                options: [row.option1, row.option2, row.option3, row.option4],
                correctAnswer: parseInt(row.correctAnswer, 10) - 1,
              };
            }).filter(Boolean);
            setQuestions(formattedQuestions);
            alert(`${formattedQuestions.length} questions loaded successfully!`);
          },
        });
      } catch (err) {
        setError('Failed to process Excel file. Please ensure it has the correct format and column headers.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleQuestionTextChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = oIndex;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const testData = {
      title,
      description,
      examDuration,
      startTime,
      questions,
    };

    try {
      await apiClient.post('/tests', testData);
      alert('Test created successfully!');
      navigate('/teacher/manage-tests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create test.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create New Test</h2>
        <p className="text-gray-600 mt-2">Design your test with questions and options</p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <h4 className="text-lg font-semibold text-blue-900">Quick Upload from Excel</h4>
        </div>
        <p className="text-blue-700 mb-4">You can upload an Excel file (`.xls`, `.xlsx`). The `correctAnswer` column should be a number from 1 to 4.</p>
        <input 
          type="file" 
          accept=".xls, .xlsx" 
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors duration-200"
        />
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Title</label>
            <input 
              type="text" 
              placeholder="Enter test title"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Description</label>
            <textarea 
              placeholder="Enter test description"
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input 
                type="number" 
                placeholder="Duration in minutes"
                value={examDuration} 
                onChange={(e) => setExamDuration(e.target.value)} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input 
                type="datetime-local" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-8"></div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Questions</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {questions.length} question{questions.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {qIndex + 1}
                    </span>
                    Question {qIndex + 1}
                  </h4>
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                  <input
                    type="text"
                    placeholder={`Enter question ${qIndex + 1} text`}
                    value={q.questionText}
                    onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Options</label>
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <input
                        type="radio"
                        name={`correct-answer-${qIndex}`}
                        checked={q.correctAnswer === oIndex}
                        onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-600 w-6">
                        {String.fromCharCode(65 + oIndex)}.
                      </span>
                      <input
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          type="button" 
          onClick={addQuestion}
          className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg py-4 px-4 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors duration-200 mb-6 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Question
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button 
            type="button"
            onClick={() => navigate('/teacher/manage-tests')}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Create Test
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTestPage;