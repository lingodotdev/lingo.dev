import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { format } from 'date-fns';
import apiClient from '../../api/axiosConfig';
import { usePageTitle } from '../../hooks/usePageTitle';

function EditTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examDuration, setExamDuration] = useState(60);
  const [startTime, setStartTime] = useState('');
  const [questions, setQuestions] = useState([]);

  usePageTitle("Edit Test");

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await apiClient.get(`/tests/${testId}`);
        const test = response.data.data.test;
        
        setTitle(test.title);
        setDescription(test.description);
        setExamDuration(test.examDuration);
        setStartTime(format(new Date(test.startTime), "yyyy-MM-dd'T'HH:mm"));
        setQuestions(test.questions);
      } catch (err) {
        setError('Failed to load test data for editing.');
      } finally {
        setLoading(false);
      }
    };
    fetchTestData();
  }, [testId]);

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
        setError('Failed to process Excel file.');
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
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const updatedTestData = {
      title,
      description,
      examDuration,
      questions,
    };

    try {
      await apiClient.patch(`/tests/${testId}`, updatedTestData);
      alert('Test updated successfully!');
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update test.');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Edit Test</h2>
        <p className="text-gray-600 mt-2">Update test details and questions</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">Quick Upload to Replace Questions</h4>
        <p className="text-blue-700 mb-4">You can upload an Excel file to replace the questions below.</p>
        <input 
          type="file" 
          accept=".xls, .xlsx" 
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
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
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-8"></div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions</h3>
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="border border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Question {qIndex + 1}</h4>
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="mb-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={`correct-answer-${qIndex}`}
                        checked={q.correctAnswer === oIndex}
                        onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg py-4 px-4 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors duration-200 mb-6"
        >
          + Add Another Question
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTestPage;