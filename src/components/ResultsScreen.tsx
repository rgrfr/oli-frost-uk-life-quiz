
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuiz } from '@/context/QuizContext';
import { questions } from '@/data/quizQuestions';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreditsDialog from './CreditsDialog';
import FeedbackForm from './FeedbackForm';

interface ResultsScreenProps {
  onRestartQuiz: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ onRestartQuiz }) => {
  const { score, totalAttempted, resetQuiz, getScorePercentage, selectedAnswers, checkedQuestions } = useQuiz();
  const { toast } = useToast();
  const [quizAttemptId, setQuizAttemptId] = useState<string | undefined>(undefined);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const scorePercentage = getScorePercentage();
  
  const handleRestartQuiz = () => {
    resetQuiz();
    onRestartQuiz();
  };
  
  const getFeedbackMessage = () => {
    if (scorePercentage >= 90) {
      return "Outstanding! You're practically British!";
    } else if (scorePercentage >= 75) {
      return "Great job! You know British culture well!";
    } else if (scorePercentage >= 60) {
      return "Good effort! You know quite a bit about life in the UK.";
    } else if (scorePercentage >= 40) {
      return "Not bad! You have some knowledge of British life.";
    } else {
      return "You might need to brush up on your British knowledge!";
    }
  };

  React.useEffect(() => {
    const saveResults = async () => {
      if (totalAttempted === 0) return;
      
      // Save the quiz attempt
      const { data: attemptData, error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          score: score,
          total_questions: totalAttempted,
          score_percentage: scorePercentage
        })
        .select('id')
        .single();
      
      if (attemptError) {
        console.error('Error saving quiz attempt:', attemptError);
        toast({
          title: "Failed to save results",
          description: "Your results couldn't be saved to the statistics database.",
          variant: "destructive"
        });
        return;
      }
      
      // Store the attempt ID for feedback submission
      setQuizAttemptId(attemptData.id);
      
      // Save individual question results
      const questionResults = checkedQuestions.map(questionId => {
        const question = questions.find(q => q.id === questionId);
        const isCorrect = question ? (selectedAnswers[questionId] && 
          question.answers.every((answer, idx) => 
            (answer.isCorrect === (selectedAnswers[questionId]?.includes(idx) || false)))) : false;
            
        return {
          attempt_id: attemptData.id,
          question_id: questionId,
          section: question?.section || 'unknown',
          is_correct: isCorrect
        };
      });
      
      if (questionResults.length > 0) {
        const { error: resultsError } = await supabase
          .from('question_results')
          .insert(questionResults);
          
        if (resultsError) {
          console.error('Error saving question results:', resultsError);
        }
      }
    };
    
    saveResults();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-ukgrey">
      <Card className="w-full max-w-md border-2 border-ukblue shadow-lg">
        <CardHeader className="bg-ukblue text-white text-center relative">
          <CardTitle className="text-2xl font-bold">your results</CardTitle>
          <CardDescription className="text-gray-200">
            Life in the UK
          </CardDescription>
          <div className="absolute top-4 right-4">
            <CreditsDialog triggerText="credits/about" size="sm" variant="ghost" className="text-gray-200 hover:text-gray-800 text-xs" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold">
              {Math.floor(score)} / {totalAttempted}
            </div>
            
            <div className="text-xl">
              {scorePercentage.toFixed(1)}%
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-sm bg-gray-200 h-4 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${scorePercentage >= 60 ? 'bg-green-500' : scorePercentage >= 40 ? 'bg-yellow-500' : 'bg-ukred'}`}
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
            </div>
            
            <p className="text-lg font-medium mt-4">
              {getFeedbackMessage()}
            </p>
            
            <div className="mt-2 text-left">
              <p className="font-semibold mb-2">quiz overview:</p>
              <ul className="text-sm space-y-1">
                <li>total questions: {questions.length}</li>
                <li>questions attempted: {totalAttempted}</li>
                <li>correct answers: {Math.floor(score)}</li>
              </ul>
            </div>
          </div>

          {showFeedback ? (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium mb-4">
                Share Your Thoughts
              </h3>
              <FeedbackForm attemptId={quizAttemptId} />
            </div>
          ) : (
            <div className="mt-6 text-center">
              <Button 
                onClick={() => setShowFeedback(true)}
                variant="outline"
                className="w-full"
              >
                offer a new question or give feedback
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col justify-center gap-3 pb-6 pt-2">
          <Button 
            onClick={handleRestartQuiz}
            className="bg-ukred hover:bg-red-700 text-white w-full max-w-xs"
          >
            clear result & restart quiz
          </Button>
          
          <Link to="/statistics" className="w-full max-w-xs">
            <Button 
              className="bg-ukblue hover:bg-blue-800 text-white w-full"
            >
              view population statistics
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultsScreen;
