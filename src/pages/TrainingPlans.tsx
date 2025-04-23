import React, { useState, useEffect } from 'react';
import trainingPlansData from '../../training_plans.json';

interface TrainingPlanFormProps { }

const TrainingPlans: React.FC<TrainingPlanFormProps> = () => {
  const [race, setRace] = useState<string>('5k');
  const [trainingsPerWeek, setTrainingsPerWeek] = useState<string>('3');
  const [targetPace, setTargetPace] = useState<string>('5:00');
  const [raceDate, setRaceDate] = useState<string>('');
  const [weeksBeforeRace, setWeeksBeforeRace] = useState<number | null>(null);
  const [fullWeeksBeforeRace, setFullWeeksBeforeRace] = useState<number | null>(null);
  const [trainingPlan, setTrainingPlan] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = now.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
  }, []);

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

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const timeDiff = selectedDate.getTime() - today.getTime();
      const diffInDays = Math.floor(timeDiff / (1000 * 3600 * 24));
      const diffInWeeks = Math.ceil(diffInDays / 7);
      setWeeksBeforeRace(diffInWeeks);

      // Calculate the Monday of the current week
      const currentDay = today.getDay();
      const daysToMonday = (currentDay === 0) ? 6 : (currentDay - 1);
      const currentMonday = new Date(today);
      currentMonday.setDate(today.getDate() - daysToMonday);
      currentMonday.setHours(0, 0, 0, 0);

      // Calculate the Monday of the race week
      const raceDay = selectedDate.getDay();
      const daysToRaceMonday = (raceDay === 0) ? 6 : (raceDay - 1);
      const raceMonday = new Date(selectedDate);
      raceMonday.setDate(selectedDate.getDate() - daysToRaceMonday);
      raceMonday.setHours(0, 0, 0, 0);

      // Calculate the difference in weeks
      const timeDiffInMs = raceMonday.getTime() - currentMonday.getTime();
      const diffInWeeksFull = Math.floor(timeDiffInMs / (7 * 24 * 3600 * 1000));

      setFullWeeksBeforeRace(diffInWeeksFull >= 0 ? diffInWeeksFull : 0);

    } else {
      setWeeksBeforeRace(null);
      setFullWeeksBeforeRace(null);
    }
  }, [raceDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fetch training plan based on selected parameters
    const plan = trainingPlansData[race][targetPace][trainingsPerWeek]; // Correctly access data
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
            value={race}
            onChange={(e) => setRace(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
          >
            {races.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="trainingsPerWeek" className="block text-sm font-medium mb-2">Trainings/Week</label>
          <select
            id="trainingsPerWeek"
            value={trainingsPerWeek}
            onChange={(e) => setTrainingsPerWeek(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
          >
            {trainingsOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="targetPace" className="block text-sm font-medium mb-2">Target Pace</label>
          <select
            id="targetPace"
            value={targetPace}
            onChange={(e) => setTargetPace(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
          >
            {paceOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="raceDate" className="block text-sm font-medium mb-2">Race Date</label>
          <input
            type="date"
            id="raceDate"
            value={raceDate}
            onChange={(e) => setRaceDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
          />
          <p className="text-sm mt-1">Current Date: {currentDate}</p>
          {weeksBeforeRace !== null && (
            <p className="text-sm mt-1">Weeks Before Race: {weeksBeforeRace}</p>
          )}
          {fullWeeksBeforeRace !== null && (
            <p className="text-sm mt-1">Full weeks before race: {fullWeeksBeforeRace}</p>
          )}
        </div>

        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
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
