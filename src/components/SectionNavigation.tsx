
import React from 'react';
import { Button } from "@/components/ui/button";
import { useQuiz } from '@/context/QuizContext';
import { quizSections } from '@/data/quizQuestions';

const SectionNavigation: React.FC = () => {
  const { navigateToSection } = useQuiz();

  return (
    <div className="flex flex-wrap gap-1">
      {quizSections.map((section, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-xs px-2 py-1"
          onClick={() => navigateToSection(section)}
        >
          {section}
        </Button>
      ))}
    </div>
  );
};

export default SectionNavigation;
