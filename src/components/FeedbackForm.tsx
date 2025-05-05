
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon, ThumbsUpIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface FeedbackFormProps {
  attemptId: string | undefined;
  questionId?: number;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ attemptId, questionId }) => {
  const [userName, setUserName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content) {
      toast({
        title: "Missing feedback",
        description: "Please write some feedback before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating from 1 to 5 stars.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_name: userName || null,
          content,
          rating,
          attempt_id: attemptId || null,
          question_id: questionId || null
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback has been submitted successfully.",
        variant: "default"
      });
      
      setSubmitted(true);
      setUserName('');
      setContent('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 p-4 rounded-md text-center">
        <ThumbsUpIcon className="mx-auto mb-2 h-8 w-8 text-green-600" />
        <h3 className="text-lg font-medium text-green-800">Thank you for your feedback!</h3>
        <p className="text-green-700 mt-1">Your comments help us improve the quiz.</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => setSubmitted(false)}
        >
          Submit another comment
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="userName" className="block text-sm font-medium mb-1">
          Your Name (optional)
        </label>
        <Input
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Your Feedback
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts about the quiz..."
          className="w-full min-h-[100px]"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Rate this quiz
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              className="p-1 focus:outline-none"
            >
              <StarIcon
                className={`h-6 w-6 ${
                  rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-ukblue hover:bg-blue-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </form>
  );
};

export default FeedbackForm;
