
import React, { useState, useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { questions } from '@/data/quizQuestions';
import SectionNavigation from './SectionNavigation';

interface QuizQuestionProps {
  onQuizEnd: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ onQuizEnd }) => {
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    selectAnswer,
    checkAnswer,
    isAnswerSelected,
    isQuestionChecked,
    isAnswerCorrect,
    isQuestionCorrect,
    getCurrentQuestion,
    score,
    totalAttempted
  } = useQuiz();

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'in' | 'out'>('in');
  const question = getCurrentQuestion();

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      onQuizEnd();
      return;
    }

    setAnimationDirection('out');
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnimationDirection('in');
    }, 300);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex <= 0) return;

    setAnimationDirection('out');
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnimationDirection('in');
    }, 300);
  };

  const handleCheckAnswer = () => {
    if (!question) return;
    checkAnswer(question.id);
  };

  useEffect(() => {
    // Reset animation state after component updates
    if (isAnimating) {
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [currentQuestionIndex, isAnimating]);

  if (!question) return null;

  const isChecked = isQuestionChecked(question.id);
  const questionResult = isQuestionCorrect(question.id);

  const getAnswerClasses = (answerIndex: number) => {
    const baseClasses = "p-3 mb-2 border-2 rounded-md transition-colors cursor-pointer flex items-center";
    const isSelected = isAnswerSelected(question.id, answerIndex);
    const correctStatus = isAnswerCorrect(question.id, answerIndex);
    
    if (!isChecked) {
      return `${baseClasses} ${isSelected ? 'border-ukblue' : 'border-gray-200 hover:border-gray-400'}`;
    }
    
    if (correctStatus === true) {
      return `${baseClasses} bg-ukblue text-white border-ukblue`;
    }
    
    if (correctStatus === false && isSelected) {
      return `${baseClasses} bg-ukred text-white border-ukred`;
    }
    
    return `${baseClasses} border-gray-200`;
  };

  const animationClass = isAnimating 
    ? animationDirection === 'in' 
      ? 'animate-slide-in-right' 
      : 'animate-slide-out-left'
    : '';

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-ukgrey">
      <div className="w-full max-w-2xl">
        {/* Progress and score */}
        <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
          <span>question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>score: {score.toFixed(1)}/{totalAttempted}</span>
        </div>

        <div className="w-full bg-gray-200 h-2 mb-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-ukred transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Question card */}
        <Card className={`w-full p-0 overflow-hidden ${animationClass} relative`}>
          <div className="bg-ukblue text-white p-4">
            <h2 className="text-xl font-semibold">
              {question.text}
            </h2>
            {question.multipleCorrect && (
              <p className="font-bold mt-1 text-sm">select all that apply</p>
            )}
          </div>

          <div className="p-4 space-y-1">
            {question.answers.map((answer, index) => (
              <div 
                key={index}
                className={getAnswerClasses(index)}
                onClick={() => !isChecked && selectAnswer(question.id, index)}
              >
                <span className="flex-grow">{answer.text}</span>
                {isChecked && answer.isCorrect && <Check size={20} className="ml-2" />}
                {isChecked && !answer.isCorrect && isAnswerSelected(question.id, index) && <X size={20} className="ml-2" />}
              </div>
            ))}

            {isChecked && (
              <div className="mt-4 p-3 border-l-4 rounded bg-gray-50">
                <p className="font-semibold">
                  {questionResult ? "Correct!" : "Incorrect!"}
                </p>
                <p className="mt-1 text-gray-700">{question.explanation}</p>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="p-4 pt-2 flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              <span>back</span>
            </Button>

            <Button 
              onClick={isChecked ? handleNextQuestion : handleCheckAnswer}
              className="bg-ukred hover:bg-red-700 text-white flex items-center gap-1"
            >
              <span>{isChecked ? 'next question' : 'check answer'}</span>
              {isChecked && <ChevronRight size={16} />}
            </Button>
          </div>
        </Card>

        {/* Section navigation */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">section:</p>
          <SectionNavigation />
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
