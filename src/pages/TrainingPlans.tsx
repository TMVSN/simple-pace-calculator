import React, { useState, useEffect } from 'react';
import trainingPlansData from '../../training_plans.json';

interface TrainingPlanFormProps {}

const TrainingPlans: React.FC<TrainingPlanFormProps> = () => {
  const [race, setRace] = useState<string>('');
  const [trainingsPerWeek, setTrainingsPerWeek] = useState<string>('');
  const [targetPace, setTargetPace] = useState<string>('');
  const [raceDate, setRaceDate] = useState<string>('');
  const [weeksBeforeRace, setWeeksBeforeRace] = useState<number | null>(null);
  const [trainingPlan, setTrainingPlan] = useState<any>(null);

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

  useEffect(() => {
    if (raceDate) {
      const selectedDate = new Date(raceDate);
      const today = new Date();
      const timeDiff = selectedDate.getTime() - today.getTime();
      const diffInWeeks = Math.ceil(timeDiff / (1000 * 3600 * 24 * 7));
      setWeeksBeforeRace(diffInWeeks);
    } else {
      setWeeksBeforeRace(null);
    }
  }, [raceDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fetch training plan based on selected parameters
    const plan = trainingPlansData[race]?.[targetPace]?.[trainingsPerWeek];
    setTrainingPlan(plan);
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Training Plans</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="race" className="block text-sm font-medium mb-2">Race</label>
          <select
            id="race"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
            value={race}
            onChange={(e) => setRace(e.target.value)}
          >
            <option value="" disabled>Select a distance</option>
            {races.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="trainingsPerWeek" className="block text-sm font-medium mb-2">Trainings / Week</label>
          <select
            id="trainingsPerWeek"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
            value={trainingsPerWeek}
            onChange={(e) => setTrainingsPerWeek(e.target.value)}
          >
            <option value="" disabled>Select a workload</option>
            {trainingsOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="targetPace" className="block text-sm font-medium mb-2">Target Pace</label>
          <select
            id="targetPace"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
            value={targetPace}
            onChange={(e) => setTargetPace(e.target.value)}
          >
            <option value="" disabled>Select a target pace</option>
            {paceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="raceDate" className="block text-sm font-medium mb-2">Race Date</label>
          <input
            type="date"
            id="raceDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
            value={raceDate}
            onChange={(e) => setRaceDate(e.target.value)}
          />
          {weeksBeforeRace !== null && (
            <p className="text-sm mt-1">Weeks Before Race: {weeksBeforeRace}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Get Training Plan
        </button>
      </form>

      {trainingPlan && (
        <div>
          <h2 className="text-xl font-bold mb-2">Training Plan:</h2>
          <pre>{JSON.stringify(trainingPlan, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TrainingPlans;
