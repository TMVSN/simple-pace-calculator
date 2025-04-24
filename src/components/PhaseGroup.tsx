import React, { useState, useEffect } from 'react';
import TrainingWeekDisplay from './TrainingWeekDisplay';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Training {
  session: string;
  description: string;
  terrain: string;
}

interface TrainingWeek {
  week: number;
  phase: string;
  run1: Training;
  run2: Training;
  run3: Training;
  startDate: Date;
}

interface Props {
  phase: string;
  weeks: TrainingWeek[];
  isExpanded: boolean;
  areWeeksExpanded: boolean;
}

const PhaseGroup: React.FC<Props> = ({ phase, weeks, isExpanded: isExpandedProp, areWeeksExpanded }) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedProp);

  useEffect(() => {
    setIsExpanded(isExpandedProp);
  }, [isExpandedProp]);

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-purple-100 rounded-lg p-4 mb-4 flex items-center justify-between hover:bg-purple-200 transition-colors"
      >
        <h2 className="text-xl font-bold text-purple-800">Phase: {phase}</h2>
        {isExpanded ? (
          <ChevronDown className="h-6 w-6 text-purple-800" />
        ) : (
          <ChevronRight className="h-6 w-6 text-purple-800" />
        )}
      </button>
      {isExpanded && (
        <div className="pl-4">
          {weeks.map((week) => (
            <TrainingWeekDisplay 
              key={week.week} 
              week={week}
              isExpanded={areWeeksExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhaseGroup; 