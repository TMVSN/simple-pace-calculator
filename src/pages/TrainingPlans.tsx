import React, { useState } from 'react';
import trainingPlansData from '../../training_plans.json';
import { useTrainingPlanForm } from '../hooks/useTrainingPlanForm';
import { TrainingPlanDisplay } from '../components/TrainingPlanDisplay';

interface TrainingWeek {
  week: number;
  run1: string;
  run2: string;
  run3: string;
}

interface TrainingPlanData {
  [race: string]: {
    [pace: string]: {
      [trainingsPerWeek: string]: TrainingWeek[];
    };
  };
}

const TrainingPlans: React.FC = () => {
  const {
    formState,
    handleInputChange,
    isValid,
    currentDate
  } = useTrainingPlanForm();
  const [trainingPlan, setTrainingPlan] = useState<TrainingWeek[] | null>(null);

  const races = ['5k', '10k', 'Half Marathon', 'Marathon'];
  const trainingsOptions = ['2', '3', '4', '5'];
  const paceOptions = generatePaceOptions();

  function generatePaceOptions() {
    const paces = [];
    for (let min = 4; min <= 7; min++) {
      for (let sec = 0; sec < 60; sec += 10) {
        const pace = `${min}:${sec.toString().padStart(2, '0')}`;
        paces.push(pace);
      }
    }
    paces.push('8:00');
    return paces;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Fetch training plan based on selected parameters
    const typedTrainingData = trainingPlansData as TrainingPlanData;
    const plan = typedTrainingData[formState.race]?.[formState.targetPace]?.[formState.trainingsPerWeek];
    setTrainingPlan(plan || null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-white">Training Plans</h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="race" className="block text-sm font-medium text-gray-700 mb-2">Race</label>
          <select
            id="race"
            value={formState.race}
            onChange={(e) => handleInputChange('race', e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formState.errors.race ? 'border-red-500' : ''
            }`}
          >
            <option value="" disabled>Select a distance</option>
            {races.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {formState.errors.race && (
            <p className="text-red-500 text-xs italic mt-1">{formState.errors.race}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="trainingsPerWeek" className="block text-sm font-medium text-gray-700 mb-2">
            Trainings/Week
          </label>
          <select
            id="trainingsPerWeek"
            value={formState.trainingsPerWeek}
            onChange={(e) => handleInputChange('trainingsPerWeek', e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formState.errors.trainingsPerWeek ? 'border-red-500' : ''
            }`}
          >
            <option value="" disabled>How many runs will you do per week?</option>
            {trainingsOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {formState.errors.trainingsPerWeek && (
            <p className="text-red-500 text-xs italic mt-1">{formState.errors.trainingsPerWeek}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="targetPace" className="block text-sm font-medium text-gray-700 mb-2">Target Pace</label>
          <select
            id="targetPace"
            value={formState.targetPace}
            onChange={(e) => handleInputChange('targetPace', e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formState.errors.targetPace ? 'border-red-500' : ''
            }`}
          >
            <option value="" disabled>Select a pace</option>
            {paceOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {formState.errors.targetPace && (
            <p className="text-red-500 text-xs italic mt-1">{formState.errors.targetPace}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="raceDate" className="block text-sm font-medium text-gray-700 mb-2">Race Date</label>
          <input
            type="date"
            id="raceDate"
            value={formState.raceDate}
            onChange={(e) => handleInputChange('raceDate', e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formState.errors.raceDate ? 'border-red-500' : ''
            }`}
          />
          <p className="text-sm mt-1 text-gray-600">Current Date: {currentDate}</p>
          {formState.weeksBeforeRace !== null && (
            <p className="text-sm mt-1 text-gray-600">Weeks Before Race: {formState.weeksBeforeRace}</p>
          )}
          {formState.fullWeeksBeforeRace !== null && (
            <p className="text-sm mt-1 text-gray-600">Full weeks before race: {formState.fullWeeksBeforeRace}</p>
          )}
          {formState.errors.raceDate && (
            <p className="text-red-500 text-xs italic mt-1">{formState.errors.raceDate}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            !isValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
          }`}
        >
          Get Training Plan
        </button>
      </form>

      {trainingPlan && formState.fullWeeksBeforeRace && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Your Training Plan</h2>
          <TrainingPlanDisplay
            trainingPlan={trainingPlan}
            raceDate={formState.raceDate}
            fullWeeksBeforeRace={formState.fullWeeksBeforeRace}
          />
        </div>
      )}
    </div>
  );
};

export default TrainingPlans;
