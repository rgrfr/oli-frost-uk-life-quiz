
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WelcomeScreen from '@/components/WelcomeScreen';
import QuizQuestion from '@/components/QuizQuestion';
import ResultsScreen from '@/components/ResultsScreen';

enum QuizStage {
  WELCOME,
  QUESTIONS,
  RESULTS,
}

const Index = () => {
  const location = useLocation();
  const [quizStage, setQuizStage] = useState(QuizStage.WELCOME);

  // Check if we're returning from statistics page
  useEffect(() => {
    const state = location.state as { showResults?: boolean } | null;
    if (state && state.showResults) {
      setQuizStage(QuizStage.RESULTS);
      // Clear the state to avoid persisting this across refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleStartQuiz = () => {
    setQuizStage(QuizStage.QUESTIONS);
  };

  const handleQuizEnd = () => {
    setQuizStage(QuizStage.RESULTS);
  };

  const handleRestartQuiz = () => {
    setQuizStage(QuizStage.QUESTIONS);
  };

  return (
    <div className="min-h-screen">
      {quizStage === QuizStage.WELCOME && (
        <WelcomeScreen onStartQuiz={handleStartQuiz} />
      )}
      
      {quizStage === QuizStage.QUESTIONS && (
        <QuizQuestion onQuizEnd={handleQuizEnd} />
      )}
      
      {quizStage === QuizStage.RESULTS && (
        <ResultsScreen onRestartQuiz={handleRestartQuiz} />
      )}
    </div>
  );
};

export default Index;
