import React, { useState, useEffect } from 'react';
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
  week: TrainingWeek;
  isExpanded: boolean;
}

const getTerrainIcon = (terrain: string): string => {
  switch (terrain.toLowerCase()) {
    case 'road':
      return '🛣️';
    case 'road or trail':
      return '⛰️';
    case 'track':
      return '🏟️';
    default:
      return '🏃';
  }
};

const getSessionStyle = (session: string): string => {
  if (session.toLowerCase().includes('easy')) {
    return 'bg-green-100';
  } else if (session.toLowerCase().includes('long')) {
    return 'bg-yellow-100';
  } else {
    return 'bg-red-100';
  }
};

const getSessionType = (session: string): string => {
  if (session.toLowerCase().includes('easy')) {
    return 'Easy Run';
  } else if (session.toLowerCase().includes('long')) {
    return 'Long Run';
  } else {
    return 'Track Session';
  }
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const TrainingDisplay: React.FC<{ training: Training }> = ({ training }) => {
  const sessionType = getSessionType(training.session);
  const sessionStyle = getSessionStyle(training.session);

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span>{getTerrainIcon(training.terrain)}</span>
        <span className={`${sessionStyle} rounded-full px-3 py-1 text-sm font-medium`}>
          {sessionType}
        </span>
      </div>
      <div className="font-medium mb-1">{training.session}</div>
      <div className="text-gray-600 text-sm italic">{training.description}</div>
    </div>
  );
};

const TrainingWeekDisplay: React.FC<Props> = ({ week, isExpanded: isExpandedProp }) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedProp);

  useEffect(() => {
    setIsExpanded(isExpandedProp);
  }, [isExpandedProp]);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <h3 className="text-lg font-semibold">
          Week {week.week} - {formatDate(week.startDate)}
        </h3>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="space-y-4 pl-4">
          <TrainingDisplay training={week.run1} />
          <TrainingDisplay training={week.run2} />
          <TrainingDisplay training={week.run3} />
        </div>
      )}
    </div>
  );
};

export default TrainingWeekDisplay; 