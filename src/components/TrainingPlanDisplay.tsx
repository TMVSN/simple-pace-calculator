import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TrainingWeek {
  week: number;
  run1: string;
  run2: string;
  run3: string;
}

interface TrainingPlanDisplayProps {
  trainingPlan: TrainingWeek[];
  raceDate: string;
  fullWeeksBeforeRace: number;
}

export const TrainingPlanDisplay: React.FC<TrainingPlanDisplayProps> = ({
  trainingPlan,
  raceDate,
  fullWeeksBeforeRace,
}) => {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([]);

  // Calculate the relevant weeks from the training plan
  // If fullWeeksBeforeRace is greater than the plan length, use the entire plan
  const weeksToShow = Math.min(fullWeeksBeforeRace, trainingPlan.length);
  const relevantWeeks = trainingPlan
    .slice(-weeksToShow)
    .map((week, index) => ({
      ...week,
      actualWeek: weeksToShow - index,
    }));

  // Calculate Monday dates for each week
  const raceDateObj = new Date(raceDate);
  const weekDates = relevantWeeks.map((week) => {
    const date = new Date(raceDateObj);
    date.setDate(date.getDate() - (week.actualWeek * 7));
    // Get to Monday
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date;
  });

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekNumber)
        ? prev.filter((w) => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (weeksToShow < 4) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        The selected race date is too close. Please select a date at least 4 weeks away.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {relevantWeeks.map((week, index) => (
        <div key={week.week} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleWeek(week.week)}
            className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
          >
            <span className="font-medium">
              {formatDate(weekDates[index])} - Race in {week.actualWeek} weeks
            </span>
            {expandedWeeks.includes(week.week) ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>
          {expandedWeeks.includes(week.week) && (
            <div className="px-4 py-2 space-y-2 bg-white">
              <div className="text-gray-600">{week.run1}</div>
              <div className="text-gray-600">{week.run2}</div>
              <div className="text-gray-600">{week.run3}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 