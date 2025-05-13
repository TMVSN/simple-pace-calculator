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
  run3?: Training;
  startDate: Date;
}

interface Props {
  phase: string;
  weeks: TrainingWeek[];
  allPhasesExpanded: boolean;
  allWeeksExpanded: boolean;
}

const PhaseGroup: React.FC<Props> = ({
  phase,
  weeks,
  allPhasesExpanded,
  allWeeksExpanded,
}) => {
  const [isExpanded, setIsExpanded] = useState(allPhasesExpanded);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>(
    allWeeksExpanded ? weeks.map((w) => w.week) : []
  );

  useEffect(() => {
    setIsExpanded(allPhasesExpanded);
  }, [allPhasesExpanded]);

  useEffect(() => {
    setExpandedWeeks(allWeeksExpanded ? weeks.map((w) => w.week) : []);
  }, [allWeeksExpanded, weeks]);

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekNumber)
        ? prev.filter((w) => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 bg-purple-50 hover:bg-purple-100 text-left transition-colors"
      >
        <h2 className="text-xl font-semibold text-purple-900">{phase}</h2>
      </button>

      {isExpanded && (
        <div className="divide-y divide-gray-100">
          {weeks.map((week) => (
            <div key={week.week} className="p-6">
              <button
                onClick={() => toggleWeek(week.week)}
                className="w-full flex justify-between items-center mb-4"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  Week {week.week}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatDate(week.startDate)}
                </span>
              </button>

              {expandedWeeks.includes(week.week) && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {week.run1.session}
                    </h4>
                    <p className="text-gray-600 mb-2">{week.run1.description}</p>
                    <span className="text-sm text-gray-500">
                      Terrain: {week.run1.terrain}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {week.run2.session}
                    </h4>
                    <p className="text-gray-600 mb-2">{week.run2.description}</p>
                    <span className="text-sm text-gray-500">
                      Terrain: {week.run2.terrain}
                    </span>
                  </div>

                  {week.run3 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {week.run3.session}
                      </h4>
                      <p className="text-gray-600 mb-2">{week.run3.description}</p>
                      <span className="text-sm text-gray-500">
                        Terrain: {week.run3.terrain}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhaseGroup; 