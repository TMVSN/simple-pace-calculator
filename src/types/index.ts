export type CustomDistanceUnit = 'm' | 'km' | 'mile' | 'ft' | 'yd';

export type CalculatorTabType = 'simple' | 'pace' | 'split';

export type NavSection = 'calculators' | 'plans' | 'tips' | 'blog' | 'about';

export type SplitType = 'track' | 'long-distance' | 'custom';

export interface PaceConverterState {
  inputMin: string;
  inputSec: string;
  outputMin: string;
  outputSec: string;
  speedKmh: string;
  speedMph: string;
  isKmToMile: boolean;
}

export interface DetailedPaceState {
  hours: string;
  minutes: string;
  seconds: string;
  distance: string;
  distanceUnit: string;
  calculatedPaceKm: string;
  calculatedPaceMile: string;
  calculatedSpeedKmh: string;
  calculatedSpeedMph: string;
}

export interface SplitTimeState {
  splitMin: string;
  splitSec: string;
  splitType: SplitType;
  distanceType: 'kilometers' | 'miles';
  customDistance: string;
  customDistanceUnit: CustomDistanceUnit;
  calculatedCustomSplit: string;
  splitIsKmToMile: boolean;
} 