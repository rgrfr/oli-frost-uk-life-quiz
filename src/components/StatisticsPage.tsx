
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type QuizStatistics = {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  questionsAnalytics: Record<string, { correct: number; total: number; percentage: number }>;
  sectionPerformance: { name: string; correct: number; incorrect: number; percentage: number }[];
};

const StatisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<QuizStatistics>({
    totalAttempts: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    questionsAnalytics: {},
    sectionPerformance: [],
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      
      try {
        // Fetch from PHP API
        const response = await fetch('https://rogerfrost.com/api/get_quiz_attempts.php');
        const result = await response.json();
        
        if (!response.ok || result.status !== 'success') {
          throw new Error('Failed to fetch statistics');
        }
        
        const attemptsWithResults = result.data;
        
        if (attemptsWithResults && attemptsWithResults.length > 0) {
          // Calculate general stats
          const totalAttempts = attemptsWithResults.length;
          const averageScore = totalAttempts > 0 
            ? attemptsWithResults.reduce((sum: number, attempt: any) => sum + Number(attempt.score_percentage), 0) / totalAttempts 
            : 0;
          const highestScore = totalAttempts > 0
            ? Math.max(...attemptsWithResults.map((attempt: any) => Number(attempt.score_percentage)))
            : 0;
          const lowestScore = totalAttempts > 0
            ? Math.min(...attemptsWithResults.map((attempt: any) => Number(attempt.score_percentage)))
            : 0;
          
          // Flatten all question results from all attempts
          const allQuestionResults: any[] = [];
          attemptsWithResults.forEach((attempt: any) => {
            if (attempt.results && Array.isArray(attempt.results)) {
              allQuestionResults.push(...attempt.results);
            }
          });
          
          // Calculate question-specific stats
          const questionsAnalytics: Record<string, { correct: number; total: number; percentage: number }> = {};
          allQuestionResults.forEach(result => {
            if (!questionsAnalytics[result.question_id]) {
              questionsAnalytics[result.question_id] = { correct: 0, total: 0, percentage: 0 };
            }
            
            questionsAnalytics[result.question_id].total += 1;
            if (result.is_correct) {
              questionsAnalytics[result.question_id].correct += 1;
            }
          });
          
          // Calculate percentages
          Object.keys(questionsAnalytics).forEach(questionId => {
            const { correct, total } = questionsAnalytics[questionId];
            questionsAnalytics[questionId].percentage = total > 0 ? (correct / total) * 100 : 0;
          });
          
          // Calculate section performance - normalize section names
          const sectionData: Record<string, { correct: number; incorrect: number }> = {};
          allQuestionResults.forEach(result => {
            // Normalize the section name to handle old "entertainment & culture" references
            let normalizedSection = result.section;
            if (normalizedSection.toLowerCase() === 'entertainment & culture') {
              normalizedSection = 'culture & customs';
            }
            
            if (!sectionData[normalizedSection]) {
              sectionData[normalizedSection] = { correct: 0, incorrect: 0 };
            }
            
            if (result.is_correct) {
              sectionData[normalizedSection].correct += 1;
            } else {
              sectionData[normalizedSection].incorrect += 1;
            }
          });
          
          const sectionPerformance = Object.entries(sectionData).map(([name, data]) => {
            const total = data.correct + data.incorrect;
            const percentage = total > 0 ? (data.correct / total) * 100 : 0;
            return {
              name,
              correct: data.correct,
              incorrect: data.incorrect,
              percentage
            };
          }).sort((a, b) => b.percentage - a.percentage);
          
          setStatistics({
            totalAttempts,
            averageScore,
            highestScore,
            lowestScore,
            questionsAnalytics,
            sectionPerformance
          });
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
      
      setLoading(false);
    };
    
    fetchStatistics();
  }, []);

  const COLORS = ['#0A3161', '#CF142B', '#4CAF50', '#FF9800', '#9C27B0', '#607D8B'];

  const handleBackToResults = () => {
    // Navigate specifically to results page with state indicating we want to show results
    navigate('/', { state: { showResults: true } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-ukgrey">
      <div className="w-full max-w-4xl">
        <Card className="w-full border-2 border-ukblue shadow-lg mb-4">
          <CardHeader className="bg-ukblue text-white">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-blue-800 mr-4"
                onClick={handleBackToResults}
              >
                <ArrowLeft />
              </Button>
              <div>
                <CardTitle className="text-2xl">population statistics</CardTitle>
                <CardDescription className="text-gray-200">
                  How you compare with other quiz takers
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center p-10">loading statistics...</div>
            ) : statistics.totalAttempts === 0 ? (
              <div className="text-center p-10">
                No quiz data yet. Complete a quiz to see statistics!
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium text-gray-500">total attempts</h3>
                    <p className="text-2xl font-bold">{statistics.totalAttempts}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium text-gray-500">average score</h3>
                    <p className="text-2xl font-bold">{statistics.averageScore.toFixed(1)}%</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium text-gray-500">highest score</h3>
                    <p className="text-2xl font-bold">{statistics.highestScore.toFixed(1)}%</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-medium text-gray-500">lowest score</h3>
                    <p className="text-2xl font-bold">{statistics.lowestScore.toFixed(1)}%</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">section performance</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <h4 className="text-lg font-medium mb-2">correct vs. incorrect</h4>
                      <div style={{ width: '100%', height: 350 }}>
                        <ChartContainer config={{}} className="aspect-[4/3] h-full">
                          <BarChart
                            data={statistics.sectionPerformance}
                            layout="vertical"
                          >
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" width={120} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="percentage" name="Correct %" fill="#0A3161" />
                          </BarChart>
                        </ChartContainer>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-2">section breakdown</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Section</TableHead>
                        <TableHead>Correct</TableHead>
                        <TableHead>Incorrect</TableHead>
                        <TableHead className="text-right">score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statistics.sectionPerformance.map((section, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{section.name}</TableCell>
                          <TableCell>{section.correct}</TableCell>
                          <TableCell>{section.incorrect}</TableCell>
                          <TableCell className="text-right">{section.percentage.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>

          
          <CardFooter className="flex justify-center pb-6 pt-2">
            <Button 
              className="bg-ukred hover:bg-red-700 text-white"
              onClick={handleBackToResults}
            >
              back to results
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsPage;
