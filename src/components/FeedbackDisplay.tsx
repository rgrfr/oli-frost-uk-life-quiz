
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface FeedbackItem {
  id: string;
  user_name: string | null;
  content: string;
  rating: number;
  created_at: string;
}

const FeedbackDisplay: React.FC = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        setFeedbackItems(data as FeedbackItem[]);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-6">
        <p>Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (feedbackItems.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>No comments available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recent Comments</h3>
      
      {feedbackItems.map((item) => (
        <Card key={item.id} className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {item.user_name || 'Anonymous'}
                </p>
                <p className="text-gray-700 mt-1">{item.content}</p>
              </div>
              
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              {new Date(item.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackDisplay;
