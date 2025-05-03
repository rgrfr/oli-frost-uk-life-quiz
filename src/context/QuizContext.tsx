import React, { createContext, useContext, useState, useEffect } from 'react';
import { questions, Question } from '../data/quizQuestions';

interface QuizContextType {
  currentQuestionIndex: number;
  selectedAnswers: Record<number, number[]>;
  checkedQuestions: number[];
  score: number;
  totalAttempted: number;
  setCurrentQuestionIndex: (index: number) => void;
  selectAnswer: (questionId: number, answerIndex: number) => void;
  checkAnswer: (questionId: number) => void;
  isAnswerSelected: (questionId: number, answerIndex: number) => boolean;
  isQuestionChecked: (questionId: number) => boolean;
  resetQuiz: () => void;
  getCurrentQuestion: () => Question | undefined;
  isAnswerCorrect: (questionId: number, answerIndex: number) => boolean | null;
  isQuestionCorrect: (questionId: number) => boolean | null;
  getCorrectAnswers: (questionId: number) => number[];
  getScorePercentage: () => number;
  navigateToSection: (section: string) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get saved state from localStorage if available
  const getSavedState = () => {
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (error) {
        console.error('Error parsing saved quiz state', error);
      }
    }
    return null;
  };

  const savedState = getSavedState();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(savedState?.currentQuestionIndex || 0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>(savedState?.selectedAnswers || {});
  const [checkedQuestions, setCheckedQuestions] = useState<number[]>(savedState?.checkedQuestions || []);
  const [score, setScore] = useState(savedState?.score || 0);
  const [totalAttempted, setTotalAttempted] = useState(savedState?.totalAttempted || 0);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quizState', JSON.stringify({
      currentQuestionIndex,
      selectedAnswers,
      checkedQuestions,
      score,
      totalAttempted
    }));
  }, [currentQuestionIndex, selectedAnswers, checkedQuestions, score, totalAttempted]);

  
  const getCurrentQuestion = () => {
    return questions[currentQuestionIndex];
  };

  const selectAnswer = (questionId: number, answerIndex: number) => {
    if (isQuestionChecked(questionId)) return;

    setSelectedAnswers(prev => {
      const question = questions.find(q => q.id === questionId);
      
      if (!question) return prev;
      
      // For multiple correct answers questions, allow multiple selections
      if (question.multipleCorrect) {
        const currentSelections = prev[questionId] || [];
        
        // Toggle the answer - if already selected, remove it, otherwise add it
        if (currentSelections.includes(answerIndex)) {
          return {
            ...prev,
            [questionId]: currentSelections.filter(idx => idx !== answerIndex)
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentSelections, answerIndex]
          };
        }
      } 
      // For single answer questions, only allow one selection
      else {
        return {
          ...prev,
          [questionId]: [answerIndex]
        };
      }
    });
  };

  const isAnswerSelected = (questionId: number, answerIndex: number) => {
    const selections = selectedAnswers[questionId] || [];
    return selections.includes(answerIndex);
  };

  const isQuestionChecked = (questionId: number) => {
    return checkedQuestions.includes(questionId);
  };

  const getCorrectAnswers = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return [];
    
    return question.answers
      .map((answer, index) => answer.isCorrect ? index : -1)
      .filter(index => index !== -1);
  };

  const isAnswerCorrect = (questionId: number, answerIndex: number): boolean | null => {
    if (!isQuestionChecked(questionId)) return null;
    
    const question = questions.find(q => q.id === questionId);
    if (!question) return null;
    
    return question.answers[answerIndex].isCorrect;
  };

  const isQuestionCorrect = (questionId: number): boolean | null => {
    if (!isQuestionChecked(questionId)) return null;
    
    const question = questions.find(q => q.id === questionId);
    if (!question) return null;
    
    const userAnswers = selectedAnswers[questionId] || [];
    const correctAnswers = question.answers
      .map((answer, index) => answer.isCorrect ? index : -1)
      .filter(index => index !== -1);
    
    // For single answer questions
    if (!question.multipleCorrect) {
      if (userAnswers.length !== 1) return false;
      return question.answers[userAnswers[0]].isCorrect;
    }
    
    // For multiple answer questions
    // Check that user selected all correct answers and no incorrect ones
    const correctCount = userAnswers.filter(ans => 
      correctAnswers.includes(ans)
    ).length;
    
    const incorrectCount = userAnswers.filter(ans => 
      !correctAnswers.includes(ans)
    ).length;
    
    return correctCount === correctAnswers.length && incorrectCount === 0;
  };

  const checkAnswer = (questionId: number) => {
    if (isQuestionChecked(questionId)) return;
    
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    const userAnswers = selectedAnswers[questionId] || [];
    if (userAnswers.length === 0) return; // Don't check if no answer selected
    
    const correctAnswers = getCorrectAnswers(questionId);
    
    // Calculate score
    let questionScore = 0;
    
    // For single answer questions
    if (!question.multipleCorrect) {
      if (question.answers[userAnswers[0]].isCorrect) {
        questionScore = 1;
      }
    } 
    // For multiple answer questions - award partial credit
    else {
      const correctSelected = userAnswers.filter(ans => 
        correctAnswers.includes(ans)
      ).length;
      
      const incorrectSelected = userAnswers.filter(ans => 
        !correctAnswers.includes(ans)
      ).length;
      
      // Full score if all correct answers selected and no incorrect ones
      if (correctSelected === correctAnswers.length && incorrectSelected === 0) {
        questionScore = 1;
      }
      // Partial score for partially correct answers
      else if (correctSelected > 0) {
        questionScore = (correctSelected / correctAnswers.length) * 0.5;
      }
    }
    
    setScore(prev => prev + questionScore);
    setTotalAttempted(prev => prev + 1);
    setCheckedQuestions(prev => [...prev, questionId]);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setCheckedQuestions([]);
    setScore(0);
    setTotalAttempted(0);
    localStorage.removeItem('quizState');
  };

  const getScorePercentage = () => {
    if (totalAttempted === 0) return 0;
    return (score / totalAttempted) * 100;
  };

  const navigateToSection = (section: string) => {
    const firstQuestionInSection = questions.findIndex(q => q.section === section);
    if (firstQuestionInSection >= 0) {
      setCurrentQuestionIndex(firstQuestionInSection);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        currentQuestionIndex,
        selectedAnswers,
        checkedQuestions,
        score,
        totalAttempted,
        setCurrentQuestionIndex,
        selectAnswer,
        checkAnswer,
        isAnswerSelected,
        isQuestionChecked,
        resetQuiz,
        getCurrentQuestion,
        isAnswerCorrect,
        isQuestionCorrect,
        getCorrectAnswers,
        getScorePercentage,
        navigateToSection
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
