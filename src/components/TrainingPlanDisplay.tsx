import React, { useState } from 'react';
import PhaseGroup from './PhaseGroup';

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
}

interface Props {
  trainingPlan: TrainingWeek[];
  raceDate: string;
  fullWeeksBeforeRace: number;
}

const TrainingPlanDisplay: React.FC<Props> = ({
  trainingPlan,
  raceDate,
  fullWeeksBeforeRace,
}) => {
  const [allPhasesExpanded, setAllPhasesExpanded] = useState(true);
  const [allWeeksExpanded, setAllWeeksExpanded] = useState(true);

  // Calculate which weeks to show based on fullWeeksBeforeRace
  const weeksToShow = Math.min(fullWeeksBeforeRace, trainingPlan.length);
  const relevantWeeks = trainingPlan.slice(-weeksToShow);

  // Calculate dates for each week
  const raceDateObj = new Date(raceDate);
  const weekDates = relevantWeeks.map((week) => {
    const date = new Date(raceDateObj);
    date.setDate(date.getDate() - (week.week * 7));
    // Get to Monday of that week
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date;
  });

  // Group the relevant weeks by phase
  const relevantWeeksByPhase = relevantWeeks.reduce((acc, week, index) => {
    if (!acc[week.phase]) {
      acc[week.phase] = [];
    }
    acc[week.phase].push({
      ...week,
      startDate: weekDates[index]
    });
    return acc;
  }, {} as { [key: string]: (TrainingWeek & { startDate: Date })[] });

  return (
    <div>
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setAllPhasesExpanded(!allPhasesExpanded)}
          className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md transition-colors"
        >
          {allPhasesExpanded ? 'Collapse All Phases' : 'Expand All Phases'}
        </button>
        <button
          onClick={() => setAllWeeksExpanded(!allWeeksExpanded)}
          className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md transition-colors"
        >
          {allWeeksExpanded ? 'Collapse All Weeks' : 'Expand All Weeks'}
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(relevantWeeksByPhase).map(([phase, weeks]) => (
          <PhaseGroup
            key={phase}
            phase={phase}
            weeks={weeks}
            allPhasesExpanded={allPhasesExpanded}
            allWeeksExpanded={allWeeksExpanded}
          />
        ))}
      </div>
    </div>
  );
};

export default TrainingPlanDisplay; 