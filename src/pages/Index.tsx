
import React, { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import QuizQuestion from '@/components/QuizQuestion';
import ResultsScreen from '@/components/ResultsScreen';

enum QuizStage {
  WELCOME,
  QUESTIONS,
  RESULTS,
}

const Index = () => {
  const [quizStage, setQuizStage] = useState(QuizStage.WELCOME);

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
