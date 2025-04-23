import { CustomDistanceUnit } from '../types';

export const CONVERSION_FACTORS = {
  KM_PER_MILE: 1.60934,
  METERS_PER_FOOT: 0.3048,
  METERS_PER_YARD: 0.9144,
};

const normalizeTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  // If seconds is 60, increment minutes
  if (seconds === 60) {
    return {
      minutes: minutes + 1,
      seconds: 0
    };
  }
  return { minutes, seconds };
};

const formatTime = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || !isFinite(totalSeconds)) {
    return '--:--';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

export const calculatePaceConversion = (
  inputMin: string,
  inputSec: string,
  isKmToMile: boolean
) => {
  if (inputMin === '' && inputSec === '') {
    return { outputMin: '', outputSec: '', speedKmh: '', speedMph: '' };
  }

  const totalInputSeconds = parseInt(inputMin || '0') * 60 + parseInt(inputSec || '0');
  if (totalInputSeconds <= 0) {
    return { outputMin: '0', outputSec: '00', speedKmh: '0.00', speedMph: '0.00' };
  }

  let speedKmh: number, speedMph: number;
  let outputSeconds: number;

  if (!isKmToMile) {
    // Input is min/km
    // For 6:00 min/km: 6 minutes = 360 seconds per km
    // Speed in km/h = (60 min/h) / (6 min/km) = 10 km/h
    speedKmh = (60 * 60) / totalInputSeconds;
    speedMph = speedKmh / CONVERSION_FACTORS.KM_PER_MILE;
    
    // Converting pace from min/km to min/mile
    outputSeconds = totalInputSeconds * CONVERSION_FACTORS.KM_PER_MILE;
  } else {
    // Input is min/mile
    // For 9:39 min/mile: 579 seconds per mile
    // Speed in mph = (60 min/h) / (9.65 min/mile) = 6.21 mph
    speedMph = (60 * 60) / totalInputSeconds;
    speedKmh = speedMph * CONVERSION_FACTORS.KM_PER_MILE;
    
    // Converting pace from min/mile to min/km
    outputSeconds = totalInputSeconds / CONVERSION_FACTORS.KM_PER_MILE;
  }

  const { minutes, seconds } = normalizeTime(outputSeconds);

  return {
    outputMin: minutes.toString(),
    outputSec: seconds.toString().padStart(2, '0'),
    speedKmh: speedKmh.toFixed(2),
    speedMph: speedMph.toFixed(2),
  };
};

export const calculateDetailedPace = (
  distance: string,
  distanceUnit: string,
  hours: string,
  minutes: string,
  seconds: string
) => {
  const distNum = parseFloat(distance);
  if (!distNum || distNum <= 0 || (!hours && !minutes && !seconds)) {
    return { calculatedPaceKm: '', calculatedPaceMile: '', calculatedSpeedKmh: '', calculatedSpeedMph: '' };
  }

  const totalSecondsInput =
    parseInt(hours || '0') * 3600 +
    parseInt(minutes || '0') * 60 +
    parseInt(seconds || '0');

  if (totalSecondsInput <= 0) {
    return { calculatedPaceKm: '', calculatedPaceMile: '', calculatedSpeedKmh: '', calculatedSpeedMph: '' };
  }

  const totalHours = totalSecondsInput / 3600;
  let distanceInKm = distNum;

  switch (distanceUnit) {
    case 'm':
      distanceInKm = distNum / 1000;
      break;
    case 'mile':
      distanceInKm = distNum * CONVERSION_FACTORS.KM_PER_MILE;
      break;
    case 'yard':
      distanceInKm = (distNum * CONVERSION_FACTORS.METERS_PER_YARD) / 1000;
      break;
  }

  if (distanceInKm <= 0) {
    return { calculatedPaceKm: '', calculatedPaceMile: '', calculatedSpeedKmh: '', calculatedSpeedMph: '' };
  }

  const speedKmh = distanceInKm / totalHours;
  const speedMph = speedKmh / CONVERSION_FACTORS.KM_PER_MILE;
  const paceSecondsPerKm = totalSecondsInput / distanceInKm;
  const paceSecondsPerMile = paceSecondsPerKm * CONVERSION_FACTORS.KM_PER_MILE;

  const paceKmMin = Math.floor(paceSecondsPerKm / 60);
  const paceKmSec = Math.round(paceSecondsPerKm % 60);
  const paceMileMin = Math.floor(paceSecondsPerMile / 60);
  const paceMileSec = Math.round(paceSecondsPerMile % 60);

  return {
    calculatedPaceKm: `${paceKmMin}:${paceKmSec.toString().padStart(2, '0')}`,
    calculatedPaceMile: `${paceMileMin}:${paceMileSec.toString().padStart(2, '0')}`,
    calculatedSpeedKmh: speedKmh.toFixed(2),
    calculatedSpeedMph: speedMph.toFixed(2),
  };
};

export const calculateSplitTime = (
  splitMin: string,
  splitSec: string,
  splitIsKmToMile: boolean,
  targetDistanceValue: number,
  targetDistanceUnit: CustomDistanceUnit
): string => {
  if (!splitMin && !splitSec) return '--:--';

  const inputPaceTotalSeconds = parseInt(splitMin || '0') * 60 + parseInt(splitSec || '0');
  if (inputPaceTotalSeconds <= 0) return '0:00';

  let totalSeconds: number;

  if (!splitIsKmToMile) {
    const paceSecondsPerKm = inputPaceTotalSeconds;
    switch (targetDistanceUnit) {
      case 'm':
        totalSeconds = paceSecondsPerKm * (targetDistanceValue / 1000);
        break;
      case 'mile':
        totalSeconds = paceSecondsPerKm * (targetDistanceValue * CONVERSION_FACTORS.KM_PER_MILE);
        break;
      case 'ft':
        totalSeconds = paceSecondsPerKm * (targetDistanceValue * CONVERSION_FACTORS.METERS_PER_FOOT / 1000);
        break;
      case 'yd':
        totalSeconds = paceSecondsPerKm * (targetDistanceValue * CONVERSION_FACTORS.METERS_PER_YARD / 1000);
        break;
      case 'km':
      default:
        totalSeconds = paceSecondsPerKm * targetDistanceValue;
        break;
    }
  } else {
    const paceSecondsPerMile = inputPaceTotalSeconds;
    const paceSecondsPerKmEquivalent = paceSecondsPerMile / CONVERSION_FACTORS.KM_PER_MILE;
    switch (targetDistanceUnit) {
      case 'm':
        totalSeconds = paceSecondsPerKmEquivalent * (targetDistanceValue / 1000);
        break;
      case 'mile':
        totalSeconds = paceSecondsPerMile * targetDistanceValue;
        break;
      case 'ft':
        totalSeconds = paceSecondsPerKmEquivalent * (targetDistanceValue * CONVERSION_FACTORS.METERS_PER_FOOT / 1000);
        break;
      case 'yd':
        totalSeconds = paceSecondsPerKmEquivalent * (targetDistanceValue * CONVERSION_FACTORS.METERS_PER_YARD / 1000);
        break;
      case 'km':
      default:
        totalSeconds = paceSecondsPerKmEquivalent * targetDistanceValue;
        break;
    }
  }

  return formatTime(totalSeconds);
}; 