import { useState, useEffect } from 'react';

interface TrainingPlanFormState {
  race: string;
  trainingsPerWeek: string;
  targetPace: string;
  raceDate: string;
  weeksBeforeRace: number | null;
  fullWeeksBeforeRace: number | null;
  errors: {
    race?: string;
    trainingsPerWeek?: string;
    targetPace?: string;
    raceDate?: string;
  };
}

interface UseTrainingPlanFormReturn {
  formState: TrainingPlanFormState;
  handleInputChange: (field: keyof Omit<TrainingPlanFormState, 'errors' | 'weeksBeforeRace' | 'fullWeeksBeforeRace'>, value: string) => void;
  isValid: boolean;
  currentDate: string;
}

export const useTrainingPlanForm = (): UseTrainingPlanFormReturn => {
  const [formState, setFormState] = useState<TrainingPlanFormState>({
    race: '',
    trainingsPerWeek: '',
    targetPace: '',
    raceDate: '',
    weeksBeforeRace: null,
    fullWeeksBeforeRace: null,
    errors: {}
  });

  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
  }, []);

  useEffect(() => {
    if (formState.raceDate) {
      const selectedDate = new Date(formState.raceDate);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const timeDiff = selectedDate.getTime() - today.getTime();
      const diffInDays = Math.floor(timeDiff / (1000 * 3600 * 24));
      const diffInWeeks = Math.ceil(diffInDays / 7);

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

      setFormState(prev => ({
        ...prev,
        weeksBeforeRace: diffInWeeks,
        fullWeeksBeforeRace: diffInWeeksFull >= 0 ? diffInWeeksFull : 0,
        errors: {
          ...prev.errors,
          raceDate: diffInWeeks < 4 ? 'Race date should be at least 4 weeks from today' : undefined
        }
      }));
    }
  }, [formState.raceDate]);

  const validateField = (field: keyof Omit<TrainingPlanFormState, 'errors' | 'weeksBeforeRace' | 'fullWeeksBeforeRace'>, value: string) => {
    switch (field) {
      case 'race':
        return !value ? 'Please select a race distance' : undefined;
      case 'trainingsPerWeek':
        return !value ? 'Please select number of trainings per week' : undefined;
      case 'targetPace':
        if (!value) return 'Please select a target pace';
        return value.match(/^\d{1}:\d{2}$/) ? undefined : 'Target pace must be in format M:SS';
      case 'raceDate':
        if (!value) return 'Race date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        return selectedDate <= today ? 'Race date must be in the future' : undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (field: keyof Omit<TrainingPlanFormState, 'errors' | 'weeksBeforeRace' | 'fullWeeksBeforeRace'>, value: string) => {
    const error = validateField(field, value);
    setFormState(prev => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: error
      }
    }));
  };

  const isValid = Object.values(formState.errors).every(error => !error) &&
    formState.race &&
    formState.trainingsPerWeek &&
    formState.targetPace &&
    formState.raceDate;

  return {
    formState,
    handleInputChange,
    isValid,
    currentDate
  };
}; 