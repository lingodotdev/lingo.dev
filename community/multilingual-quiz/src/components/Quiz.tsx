import React, { useState, useEffect } from 'react';
import { Question, QuizState } from '../types/quiz';
import questionsData from '../data/questions.json';
import { useTranslation } from '../context/TranslationContext';
import LanguageSelector from './LanguageSelector';
import './Quiz.css';

const Quiz: React.FC = () => {
  const questions: Question[] = questionsData;
  const { currentLanguage, translate, isTranslating } = useTranslation();
  const [translatedQuestion, setTranslatedQuestion] = useState<Question | null>(null);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswer: null,
    isAnswered: false,
    isCompleted: false,
  });

  const currentQuestion = questions[quizState.currentQuestionIndex];

  // Translate current question when language or question changes
  useEffect(() => {
    const translateQuestion = async () => {
      if (currentLanguage.code === 'en') {
        setTranslatedQuestion(currentQuestion);
        return;
      }

      setIsLoadingTranslation(true);
      setTranslatedQuestion(null); // Reset to show loading state
      
      try {
        const questionObj = {
          question: currentQuestion.question,
          option0: currentQuestion.options[0],
          option1: currentQuestion.options[1],
          option2: currentQuestion.options[2],
          option3: currentQuestion.options[3],
        };

        const translated = await translate(questionObj);
        
        setTranslatedQuestion({
          ...currentQuestion,
          question: translated.question || currentQuestion.question,
          options: [
            translated.option0 || currentQuestion.options[0],
            translated.option1 || currentQuestion.options[1],
            translated.option2 || currentQuestion.options[2],
            translated.option3 || currentQuestion.options[3],
          ],
        });
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedQuestion(currentQuestion);
      } finally {
        setIsLoadingTranslation(false);
      }
    };

    translateQuestion();
  }, [currentQuestion, currentLanguage, translate]);

  const displayQuestion = translatedQuestion || currentQuestion;

  const handleAnswerClick = (answerIndex: number) => {
    if (quizState.isAnswered) return;

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    setQuizState({
      ...quizState,
      selectedAnswer: answerIndex,
      isAnswered: true,
      score: isCorrect ? quizState.score + 1 : quizState.score,
    });
  };

  const handleNextQuestion = () => {
    const nextIndex = quizState.currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      setQuizState({
        ...quizState,
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        isAnswered: false,
      });
    } else {
      setQuizState({
        ...quizState,
        isCompleted: true,
      });
    }
  };

  const handleRestartQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      selectedAnswer: null,
      isAnswered: false,
      isCompleted: false,
    });
  };

  // UI text translations
  const [uiText, setUiText] = useState({
    quizComplete: 'Quiz Complete!',
    yourScore: 'Your Score',
    restartQuiz: 'Restart Quiz',
    question: 'Question',
    of: 'of',
    nextQuestion: 'Next Question',
    viewResults: 'View Results',
    score: 'Score',
    excellent: "Excellent! You're a trivia master! 🎉",
    good: 'Good job! Keep practicing! 👍',
    average: 'Not bad! Room for improvement. 📚',
    tryAgain: 'Keep learning and try again! 💪',
  });

  useEffect(() => {
    const translateUI = async () => {
      if (currentLanguage.code === 'en') return;

      try {
        const translated = await translate({
          quizComplete: 'Quiz Complete!',
          yourScore: 'Your Score',
          restartQuiz: 'Restart Quiz',
          question: 'Question',
          of: 'of',
          nextQuestion: 'Next Question',
          viewResults: 'View Results',
          score: 'Score',
          excellent: "Excellent! You're a trivia master! 🎉",
          good: 'Good job! Keep practicing! 👍',
          average: 'Not bad! Room for improvement. 📚',
          tryAgain: 'Keep learning and try again! 💪',
        });
        setUiText(translated);
      } catch (error) {
        console.error('UI translation failed:', error);
      }
    };

    translateUI();
  }, [currentLanguage, translate]);

  if (quizState.isCompleted) {
    const percentage = Math.round((quizState.score / questions.length) * 100);
    
    return (
      <div className="quiz-container">
        <div className="language-selector-wrapper">
          <LanguageSelector />
        </div>
        <div className="results-card">
          <h2>{uiText.quizComplete}</h2>
          <div className="score-display">
            <p className="score-text">{uiText.yourScore}</p>
            <p className="score-number">{quizState.score} / {questions.length}</p>
            <p className="score-percentage">{percentage}%</p>
          </div>
          <div className="result-message">
            {percentage >= 80 && <p className="excellent">{uiText.excellent}</p>}
            {percentage >= 60 && percentage < 80 && <p className="good">{uiText.good}</p>}
            {percentage >= 40 && percentage < 60 && <p className="average">{uiText.average}</p>}
            {percentage < 40 && <p className="try-again">{uiText.tryAgain}</p>}
          </div>
          <button className="restart-button" onClick={handleRestartQuiz}>
            {uiText.restartQuiz}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="language-selector-wrapper">
        <LanguageSelector />
      </div>
      <div className="quiz-card">
        <div className="quiz-header">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((quizState.currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="question-counter">
            {uiText.question} {quizState.currentQuestionIndex + 1} {uiText.of} {questions.length}
          </p>
        </div>

        <div className="question-section">
          {isLoadingTranslation && (
            <div className="translating-indicator">
              <span className="spinner"></span> Translating...
            </div>
          )}
          <h2 className="question-text">{displayQuestion.question}</h2>
        </div>

        <div className="options-section">
          {displayQuestion.options.map((option, index) => {
            let buttonClass = 'option-button';
            
            if (quizState.isAnswered) {
              if (index === currentQuestion.correctAnswer) {
                buttonClass += ' correct';
              } else if (index === quizState.selectedAnswer) {
                buttonClass += ' incorrect';
              } else {
                buttonClass += ' disabled';
              }
            }
            
            if (isLoadingTranslation) {
              buttonClass += ' loading';
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswerClick(index)}
                disabled={quizState.isAnswered || isLoadingTranslation}
              >
                {option}
              </button>
            );
          })}
        </div>

        {quizState.isAnswered && (
          <div className="next-section">
            <button className="next-button" onClick={handleNextQuestion}>
              {quizState.currentQuestionIndex < questions.length - 1 ? uiText.nextQuestion : uiText.viewResults}
            </button>
          </div>
        )}

        <div className="score-tracker">
          {uiText.score}: {quizState.score} / {questions.length}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
