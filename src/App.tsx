import React, { useState, useEffect, useCallback } from 'react';
import { Calculator } from 'lucide-react';
import Navbar from './components/Navbar'; // Import Navbar
import TrainingPlans from './pages/TrainingPlans'; // Import new pages
import TrainingTips from './pages/TrainingTips';
import Blog from './pages/Blog';
import AboutUs from './pages/AboutUs';
import { PaceConverter } from './components/PaceConverter';
import { DetailedPaceCalculator } from './components/DetailedPaceCalculator';
import { SplitTimeCalculator } from './components/SplitTimeCalculator';
import { NavSection, CalculatorTabType, PaceConverterState, DetailedPaceState, SplitTimeState } from './types';
import { calculatePaceConversion, calculateDetailedPace, calculateSplitTime } from './utils/calculations';

// Define type for custom units
type CustomDistanceUnit = 'm' | 'km' | 'mile' | 'ft' | 'yd';

function App() {
  // Navigation state
  const [activeSection, setActiveSection] = useState<NavSection>('calculators');
  const [activeCalculatorTab, setActiveCalculatorTab] = useState<CalculatorTabType>('simple');

  // Simple Pace Converter state
  const [paceConverterState, setPaceConverterState] = useState<PaceConverterState>({
    inputMin: '',
    inputSec: '',
    outputMin: '',
    outputSec: '',
    speedKmh: '',
    speedMph: '',
    isKmToMile: false,
  });

  // Detailed Pace Calculator state
  const [detailedPaceState, setDetailedPaceState] = useState<DetailedPaceState>({
    hours: '',
    minutes: '',
    seconds: '',
    distance: '',
    distanceUnit: 'km',
    calculatedPaceKm: '',
    calculatedPaceMile: '',
    calculatedSpeedKmh: '',
    calculatedSpeedMph: '',
  });

  // Split Time Calculator state
  const [splitTimeState, setSplitTimeState] = useState<SplitTimeState>({
    splitMin: '',
    splitSec: '',
    splitType: 'track',
    distanceType: 'kilometers',
    customDistance: '',
    customDistanceUnit: 'm',
    calculatedCustomSplit: '--:--',
    splitIsKmToMile: false,
  });

  // Pace Calculator states
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [calculatedPaceKm, setCalculatedPaceKm] = useState('');
  const [calculatedPaceMile, setCalculatedPaceMile] = useState('');
  const [calculatedSpeedKmh, setCalculatedSpeedKmh] = useState('');
  const [calculatedSpeedMph, setCalculatedSpeedMph] = useState('');

  // Effects for calculations
  useEffect(() => {
    const result = calculatePaceConversion(paceConverterState.inputMin, paceConverterState.inputSec, paceConverterState.isKmToMile);
    setPaceConverterState(prev => ({
      ...prev,
      outputMin: result.outputMin,
      outputSec: result.outputSec,
      speedKmh: result.speedKmh,
      speedMph: result.speedMph,
    }));
  }, [paceConverterState.inputMin, paceConverterState.inputSec, paceConverterState.isKmToMile]);

  useEffect(() => {
    const result = calculateDetailedPace(
      detailedPaceState.distance,
      detailedPaceState.distanceUnit,
      detailedPaceState.hours,
      detailedPaceState.minutes,
      detailedPaceState.seconds
    );
    setDetailedPaceState(prev => ({
      ...prev,
      calculatedPaceKm: result.calculatedPaceKm,
      calculatedPaceMile: result.calculatedPaceMile,
      calculatedSpeedKmh: result.calculatedSpeedKmh,
      calculatedSpeedMph: result.calculatedSpeedMph,
    }));
  }, [detailedPaceState.distance, detailedPaceState.distanceUnit, detailedPaceState.hours, detailedPaceState.minutes, detailedPaceState.seconds]);

  useEffect(() => {
    if (splitTimeState.splitType === 'custom') {
      const distNum = parseFloat(splitTimeState.customDistance);
      if (distNum > 0 && (splitTimeState.splitMin || splitTimeState.splitSec)) {
        const result = calculateSplitTime(
          splitTimeState.splitMin,
          splitTimeState.splitSec,
          splitTimeState.splitIsKmToMile,
          distNum,
          splitTimeState.customDistanceUnit
        );
        setSplitTimeState(prev => ({ ...prev, calculatedCustomSplit: result }));
      } else {
        setSplitTimeState(prev => ({ ...prev, calculatedCustomSplit: '--:--' }));
      }
    }
  }, [splitTimeState.splitType, splitTimeState.customDistance, splitTimeState.customDistanceUnit, splitTimeState.splitMin, splitTimeState.splitSec]);

  const generateLongDistanceData = useCallback(() => {
    const distancesInKm = { halfMarathonMidpoint: 10.54875, halfMarathon: 21.0975, marathon: 42.195 };
    const distancesInMiles = { halfMarathonMidpoint: 6.5546875, halfMarathon: 13.109375, marathon: 26.21875 };
    let baseUnitDistances, unitLabel: 'km' | 'mile';
    if (splitTimeState.distanceType === 'kilometers') {
      baseUnitDistances = distancesInKm;
      unitLabel = 'km';
    } else {
      baseUnitDistances = distancesInMiles;
      unitLabel = 'mile';
    }
    const maxDistance = splitTimeState.distanceType === 'kilometers' ? 42 : 26;
    type Point = { distance: number; label: string; unit: 'km' | 'mile'; special?: boolean };
    const points: Array<Point> = [];
    for (let i = 1; i <= maxDistance; i++) {
      points.push({ distance: i, label: `${i} ${unitLabel}`, unit: unitLabel });
    }
    points.push({
      distance: baseUnitDistances.halfMarathonMidpoint,
      label: `Mid point of Half Marathon (${baseUnitDistances.halfMarathonMidpoint.toFixed(2)} ${unitLabel})`,
      unit: unitLabel,
      special: true
    });
    points.push({
      distance: baseUnitDistances.halfMarathon,
      label: `Half Marathon (${baseUnitDistances.halfMarathon.toFixed(2)} ${unitLabel})`,
      unit: unitLabel,
      special: true
    });
    points.push({
      distance: baseUnitDistances.marathon,
      label: `Marathon (${baseUnitDistances.marathon.toFixed(2)} ${unitLabel})`,
      unit: unitLabel,
      special: true
    });
    points.sort((a, b) => a.distance - b.distance);
    const uniquePoints = points.reduce((acc: Array<Point>, current) => {
      const x = acc.find(item => item.distance.toFixed(3) === current.distance.toFixed(3));
      if (!x) {
        return acc.concat([current]);
      } else {
        if (current.special && !x.special) {
          x.label = current.label;
          x.special = true;
        }
        return acc;
      }
    }, []);
    return uniquePoints;
  }, [splitTimeState.distanceType]);

  // --- Event Handlers --- (Keep existing handlers)
  const handleDistanceUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setDistanceUnit(newUnit);
    if (newUnit === 'marathon') {
      setDistance('42.195'); setDistanceUnit('km');
    } else if (newUnit === 'half-marathon') {
      setDistance('21.0975'); setDistanceUnit('km');
    } else if (['km', 'mile', 'm', 'yard'].includes(newUnit)) {
        setDistanceUnit(newUnit);
    }
  };

  // --- Render Logic --- (Keep existing logic)
  const hasSplitPace = splitTimeState.splitMin !== '' || splitTimeState.splitSec !== '';
  const trackDistancesMeters = [50, 60, 100, 110, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500];
  const longDistanceData = splitTimeState.splitType === 'long-distance' ? generateLongDistanceData() : [];

  const renderCalculatorContent = () => {
    switch (activeCalculatorTab) {
      case 'simple':
        return (
          <PaceConverter
            state={paceConverterState}
            setState={setPaceConverterState}
          />
        );
      case 'pace':
        return (
          <DetailedPaceCalculator
            state={detailedPaceState}
            setState={setDetailedPaceState}
          />
        );
      case 'split':
        return (
          <SplitTimeCalculator
            state={splitTimeState}
            setState={setSplitTimeState}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'calculators':
        return (
          <div className="space-y-6">
            <div className="flex space-x-4 border-b">
              <button
                className={`px-4 py-2 ${
                  activeCalculatorTab === 'simple'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveCalculatorTab('simple')}
              >
                Simple Converter
              </button>
              <button
                className={`px-4 py-2 ${
                  activeCalculatorTab === 'pace'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveCalculatorTab('pace')}
              >
                Pace Calculator
              </button>
              <button
                className={`px-4 py-2 ${
                  activeCalculatorTab === 'split'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveCalculatorTab('split')}
              >
                Split Calculator
              </button>
            </div>
            {renderCalculatorContent()}
          </div>
        );
      case 'plans':
        return <TrainingPlans />;
      case 'tips':
        return <TrainingTips />;
      case 'blog':
        return <Blog />;
      case 'about':
        return <AboutUs />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;

