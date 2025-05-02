
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuiz } from '@/context/QuizContext';
import { questions } from '@/data/quizQuestions';

interface WelcomeScreenProps {
  onStartQuiz: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartQuiz }) => {
  const { resetQuiz } = useQuiz();

  const handleStartQuiz = () => {
    resetQuiz();
    onStartQuiz();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-ukgrey">
      <Card className="w-full max-w-md border-2 border-ukblue shadow-lg">
        <CardHeader className="bg-ukblue text-white text-center">
          <CardTitle className="text-2xl font-bold">Life in the UK Quiz</CardTitle>
          <CardDescription className="text-gray-200">
            Test your knowledge about daily life in the United Kingdom
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-4">
          <div className="space-y-4">
            <p>Welcome to the Life in the UK Quiz! This fun and educational quiz will test your knowledge about British culture, customs, and daily life.</p>
            
            <p>There are <span className="font-semibold">{questions.length}</span> questions covering various aspects of British life including:</p>
            
            <ul className="list-disc pl-5 space-y-1">
              <li>Food & Drink</li>
              <li>Entertainment & Culture</li>
              <li>Geography & Places</li>
              <li>Language & Social Norms</li>
              <li>Shops & Commerce</li>
              <li>Nature</li>
            </ul>
            
            <p>Are you ready to test your knowledge about life in the United Kingdom?</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6">
          <Button 
            onClick={handleStartQuiz}
            className="bg-ukred hover:bg-red-700 text-white w-full max-w-xs"
          >
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
