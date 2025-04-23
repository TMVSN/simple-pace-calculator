import React, { useState, useEffect, useCallback } from 'react';
import { Calculator } from 'lucide-react';
import Navbar from './components/Navbar'; // Import Navbar
import TrainingPlans from './pages/TrainingPlans'; // Import new pages
import TrainingTips from './pages/TrainingTips';
import Blog from './pages/Blog';
import AboutUs from './pages/AboutUs';

// Define type for custom units
type CustomDistanceUnit = 'm' | 'km' | 'mile' | 'ft' | 'yd';

// Define the tab type for calculators
type CalculatorTabType = 'simple' | 'pace' | 'split';

// Define the main navigation section type
type NavSection = 'calculators' | 'plans' | 'tips' | 'blog' | 'about';

function App() {
  // State for active main navigation section
  const [activeSection, setActiveSection] = useState<NavSection>('calculators');

  // State for active calculator tab
  const [activeCalculatorTab, setActiveCalculatorTab] = useState<CalculatorTabType>('simple');

  // Simple Pace Converter states
  const [isKmToMile, setIsKmToMile] = useState(false);
  const [inputMin, setInputMin] = useState('');
  const [inputSec, setInputSec] = useState('');
  const [outputMin, setOutputMin] = useState('');
  const [outputSec, setOutputSec] = useState('');
  const [speedKmh, setSpeedKmh] = useState('');
  const [speedMph, setSpeedMph] = useState('');

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

  // Split Time Calculator states
  const [splitIsKmToMile, setSplitIsKmToMile] = useState(false);
  const [splitMin, setSplitMin] = useState('');
  const [splitSec, setSplitSec] = useState('');
  const [splitType, setSplitType] = useState('track');
  const [distanceType, setDistanceType] = useState('kilometers');
  const [customDistance, setCustomDistance] = useState('');
  const [customDistanceUnit, setCustomDistanceUnit] = useState<CustomDistanceUnit>('m');
  const [calculatedCustomSplit, setCalculatedCustomSplit] = useState('--:--');


  // --- Memoized Calculation Functions --- (Keep existing functions)
  const calculatePace = useCallback(() => {
    if (inputMin === '' && inputSec === '') {
      setOutputMin('');
      setOutputSec('');
      setSpeedKmh('');
      setSpeedMph('');
      return;
    }
    const totalInputSeconds = (parseInt(inputMin || '0') * 60) + parseInt(inputSec || '0');
    if (totalInputSeconds <= 0) {
        setOutputMin('0');
        setOutputSec('00');
        setSpeedKmh('0.00');
        setSpeedMph('0.00');
        return;
    }
    let totalOutputSeconds;
    const kmPerMile = 1.60934;
    if (!isKmToMile) {
      totalOutputSeconds = totalInputSeconds * kmPerMile;
    } else {
      totalOutputSeconds = totalInputSeconds / kmPerMile;
    }
    const minutes = Math.floor(totalOutputSeconds / 60);
    const seconds = Math.round(totalOutputSeconds % 60);
    setOutputMin(minutes.toString());
    setOutputSec(seconds.toString().padStart(2, '0'));
    const totalHours = totalInputSeconds / 3600;
    if (totalHours === 0) {
        setSpeedKmh('0.00');
        setSpeedMph('0.00');
        return;
    }
    if (!isKmToMile) {
      const kmPerHour = 1 / totalHours;
      const milesPerHour = kmPerHour / kmPerMile;
      setSpeedKmh(kmPerHour.toFixed(2));
      setSpeedMph(milesPerHour.toFixed(2));
    } else {
      const milesPerHour = 1 / totalHours;
      const kmPerHour = milesPerHour * kmPerMile;
      setSpeedKmh(kmPerHour.toFixed(2));
      setSpeedMph(milesPerHour.toFixed(2));
    }
  }, [inputMin, inputSec, isKmToMile]);

  const calculateDetailedPace = useCallback(() => {
    const distNum = parseFloat(distance);
    if (!distNum || distNum <= 0 || (!hours && !minutes && !seconds)) {
      setCalculatedPaceKm('');
      setCalculatedPaceMile('');
      setCalculatedSpeedKmh('');
      setCalculatedSpeedMph('');
      return;
    }
    const totalSecondsInput =
      (parseInt(hours || '0') * 3600) +
      (parseInt(minutes || '0') * 60) +
      (parseInt(seconds || '0'));
    if (totalSecondsInput <= 0) {
        setCalculatedPaceKm('');
        setCalculatedPaceMile('');
        setCalculatedSpeedKmh('');
        setCalculatedSpeedMph('');
        return;
    }
    const totalHours = totalSecondsInput / 3600;
    const kmPerMile = 1.60934;
    const metersPerYard = 0.9144;
    let distanceInKm = distNum;
    switch (distanceUnit) {
      case 'm': distanceInKm = distNum / 1000; break;
      case 'mile': distanceInKm = distNum * kmPerMile; break;
      case 'yard': distanceInKm = distNum * metersPerYard / 1000; break;
    }
    if (distanceInKm <= 0) {
        setCalculatedPaceKm('');
        setCalculatedPaceMile('');
        setCalculatedSpeedKmh('');
        setCalculatedSpeedMph('');
        return;
    }
    const speedKmh = distanceInKm / totalHours;
    const speedMph = speedKmh / kmPerMile;
    const paceSecondsPerKm = totalSecondsInput / distanceInKm;
    const paceSecondsPerMile = paceSecondsPerKm * kmPerMile;
    const paceKmMin = Math.floor(paceSecondsPerKm / 60);
    const paceKmSec = Math.round(paceSecondsPerKm % 60);
    const paceMileMin = Math.floor(paceSecondsPerMile / 60);
    const paceMileSec = Math.round(paceSecondsPerMile % 60);
    setCalculatedPaceKm(`${paceKmMin}:${paceKmSec.toString().padStart(2, '0')}`);
    setCalculatedPaceMile(`${paceMileMin}:${paceMileSec.toString().padStart(2, '0')}`);
    setCalculatedSpeedKmh(speedKmh.toFixed(2));
    setCalculatedSpeedMph(speedMph.toFixed(2));
  }, [distance, distanceUnit, hours, minutes, seconds]);

  const calculateSplitTime = useCallback((targetDistanceValue: number, targetDistanceUnit: CustomDistanceUnit): string => {
    if (!splitMin && !splitSec) return '--:--';
    const inputPaceTotalSeconds = (parseInt(splitMin || '0') * 60) + parseInt(splitSec || '0');
    if (inputPaceTotalSeconds <= 0) return '0:00';
    let totalSeconds: number;
    const kmPerMile = 1.60934;
    const metersPerFoot = 0.3048;
    const metersPerYard = 0.9144;
    if (!splitIsKmToMile) {
      const paceSecondsPerKm = inputPaceTotalSeconds;
      switch (targetDistanceUnit) {
        case 'm': totalSeconds = paceSecondsPerKm * (targetDistanceValue / 1000); break;
        case 'mile': totalSeconds = paceSecondsPerKm * (targetDistanceValue * kmPerMile); break;
        case 'ft': totalSeconds = paceSecondsPerKm * (targetDistanceValue * metersPerFoot / 1000); break;
        case 'yd': totalSeconds = paceSecondsPerKm * (targetDistanceValue * metersPerYard / 1000); break;
        case 'km': default: totalSeconds = paceSecondsPerKm * targetDistanceValue; break;
      }
    } else {
      const paceSecondsPerMile = inputPaceTotalSeconds;
      const paceSecondsPerKmEquivalent = paceSecondsPerMile / kmPerMile;
      switch (targetDistanceUnit) {
        case 'm': totalSeconds = paceSecondsPerKmEquivalent * (targetDistanceValue / 1000); break;
        case 'mile': totalSeconds = paceSecondsPerMile * targetDistanceValue; break;
        case 'ft': totalSeconds = paceSecondsPerKmEquivalent * (targetDistanceValue * metersPerFoot / 1000); break;
        case 'yd': totalSeconds = paceSecondsPerKmEquivalent * (targetDistanceValue * metersPerYard / 1000); break;
        case 'km': default: totalSeconds = paceSecondsPerKmEquivalent * targetDistanceValue; break;
      }
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);
    if (isNaN(minutes) || isNaN(seconds) || !isFinite(minutes) || !isFinite(seconds)) {
      return '--:--';
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [splitIsKmToMile, splitMin, splitSec]);

  const generateLongDistanceData = useCallback(() => {
    const distancesInKm = { halfMarathonMidpoint: 10.54875, halfMarathon: 21.0975, marathon: 42.195 };
    const distancesInMiles = { halfMarathonMidpoint: 6.5546875, halfMarathon: 13.109375, marathon: 26.21875 };
    let baseUnitDistances, unitLabel: 'km' | 'mile';
    if (distanceType === 'kilometers') {
      baseUnitDistances = distancesInKm; unitLabel = 'km';
    } else {
      baseUnitDistances = distancesInMiles; unitLabel = 'mile';
    }
    const maxDistance = distanceType === 'kilometers' ? 42 : 26;
    type Point = { distance: number; label: string; unit: 'km' | 'mile'; special?: boolean };
    const points: Array<Point> = [];
    for (let i = 1; i <= maxDistance; i++) { points.push({ distance: i, label: `${i} ${unitLabel}`, unit: unitLabel }); }
    points.push({ distance: baseUnitDistances.halfMarathonMidpoint, label: `Mid point of Half Marathon (${baseUnitDistances.halfMarathonMidpoint.toFixed(2)} ${unitLabel})`, unit: unitLabel, special: true });
    points.push({ distance: baseUnitDistances.halfMarathon, label: `Half Marathon (${baseUnitDistances.halfMarathon.toFixed(2)} ${unitLabel})`, unit: unitLabel, special: true });
    points.push({ distance: baseUnitDistances.marathon, label: `Marathon (${baseUnitDistances.marathon.toFixed(2)} ${unitLabel})`, unit: unitLabel, special: true });
    points.sort((a, b) => a.distance - b.distance);
    const uniquePoints = points.reduce((acc: Array<Point>, current) => {
        const x = acc.find(item => item.distance.toFixed(3) === current.distance.toFixed(3));
        if (!x) { return acc.concat([current]); }
        else { if (current.special && !x.special) { x.label = current.label; x.special = true; } return acc; }
    }, []);
    return uniquePoints;
  }, [distanceType]);

  // --- Effects --- (Keep existing effects)
  useEffect(() => { calculatePace(); }, [calculatePace]);
  useEffect(() => { calculateDetailedPace(); }, [calculateDetailedPace]);
  useEffect(() => {
    if (splitType === 'custom') {
      const distNum = parseFloat(customDistance);
      if (distNum > 0 && (splitMin || splitSec)) {
        const result = calculateSplitTime(distNum, customDistanceUnit);
        setCalculatedCustomSplit(result);
      } else {
        setCalculatedCustomSplit('--:--');
      }
    }
  }, [splitType, customDistance, customDistanceUnit, splitMin, splitSec, calculateSplitTime]);

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
  const hasSplitPace = splitMin !== '' || splitSec !== '';
  const trackDistancesMeters = [50, 60, 100, 110, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500];
  const longDistanceData = splitType === 'long-distance' ? generateLongDistanceData() : [];

  // Function to render the current page content
  const renderPageContent = () => {
    switch (activeSection) {
      case 'plans': return <TrainingPlans />;
      case 'tips': return <TrainingTips />;
      case 'blog': return <Blog />;
      case 'about': return <AboutUs />;
      case 'calculators':
      default:
        return (
          <div className="container mx-auto px-4 py-8">
            {/* Calculator Title */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calculator className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Runner's Pace Calculators</h1>
            </div>

            {/* Calculator Tabs */}
            <div className="flex justify-center mb-8">
              <button
                className={`px-6 py-2 rounded-l-md ${activeCalculatorTab === 'simple' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setActiveCalculatorTab('simple')}
              >
                Simple Converter
              </button>
              <button
                className={`px-6 py-2 ${activeCalculatorTab === 'pace' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setActiveCalculatorTab('pace')}
              >
                Pace Calculator
              </button>
              <button
                className={`px-6 py-2 rounded-r-md ${activeCalculatorTab === 'split' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setActiveCalculatorTab('split')}
              >
                Split Time
              </button>
            </div>

            {/* Calculator Content Area */}
            <div className="max-w-md mx-auto space-y-6">
              {/* Simple Pace Converter */}
              {activeCalculatorTab === 'simple' && (
                <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
                  <div className="mb-6">
                    <h2 className="text-xl mb-1">Simple Pace Converter</h2>
                    {/* ADDED Description */}
                    <p className="text-sm text-gray-400 mb-4">Easily convert your pace between metric (min/km) and imperial (min/mile).</p>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <span className={`text-sm ${!isKmToMile ? 'text-white' : 'text-gray-400'}`}>min/km</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isKmToMile} onChange={() => setIsKmToMile(!isKmToMile)} className="sr-only peer" />
                        <div className="w-14 h-7 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-blue-600 after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600 bg-blue-600/30"></div>
                      </label>
                      <span className={`text-sm ${isKmToMile ? 'text-white' : 'text-gray-400'}`}>min/mile</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Pace ({!isKmToMile ? 'min/km' : 'min/mile'})</label>
                        <div className="flex gap-2">
                          <input type="number" min="0" value={inputMin} onChange={(e) => setInputMin(e.target.value)} placeholder="min" className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          <input type="number" min="0" max="59" value={inputSec} onChange={(e) => setInputSec(e.target.value)} placeholder="sec" className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div className="border-t border-gray-700 pt-4 space-y-4">
                        <div>
                          <h3 className="text-lg mb-2">Converted Pace:</h3>
                          <div className="p-4 rounded-md">
                            <p className="text-xl">
                              {outputMin || outputSec ? (`${outputMin || '0'}:${outputSec || '00'} min/${!isKmToMile ? 'mile' : 'km'}`) : (<span className="text-gray-500">Enter pace above</span>)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg mb-2">Speed:</h3>
                          <div className="p-4 rounded-md space-y-2">
                            <p className="text-xl">{speedKmh ? `${speedKmh} km/h` : <span className="text-gray-500">-- km/h</span>}</p>
                            <p className="text-xl">{speedMph ? `${speedMph} mph` : <span className="text-gray-500">-- mph</span>}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pace Calculator */}
              {activeCalculatorTab === 'pace' && (
                <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
                  <div className="mb-6">
                    <h2 className="text-xl mb-1">Pace Calculator</h2>
                     {/* ADDED Description */}
                    <p className="text-sm text-gray-400 mb-6">Calculate your pace (min/km and min/mile) and speed based on distance and time.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Distance</label>
                        <div className="flex gap-2">
                          <input type="number" min="0" step="any" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="distance" className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          <select value={distanceUnit} onChange={handleDistanceUnitChange} className="px-3 py-2 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="km">Kilometers</option>
                            <option value="mile">Miles</option>
                            <option value="m">Meters</option>
                            <option value="yard">Yards</option>
                            <option value="marathon">Marathon</option>
                            <option value="half-marathon">Half-Marathon</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Time</label>
                        <div className="flex gap-2">
                          <input type="number" min="0" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="h" className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          <input type="number" min="0" max="59" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="min" className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          <input type="number" min="0" max="59" value={seconds} onChange={(e) => setSeconds(e.target.value)} placeholder="sec" className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div className="border-t border-gray-700 pt-4 space-y-4">
                        <div>
                          <h3 className="text-lg mb-2">Calculated Pace:</h3>
                          <div className="p-4 rounded-md space-y-2">
                            <p className="text-xl">{calculatedPaceKm ? `${calculatedPaceKm} min/km` : <span className="text-gray-500">-- min/km</span>}</p>
                            <p className="text-xl">{calculatedPaceMile ? `${calculatedPaceMile} min/mile` : <span className="text-gray-500">-- min/mile</span>}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg mb-2">Calculated Speed:</h3>
                          <div className="p-4 rounded-md space-y-2">
                            <p className="text-xl">{calculatedSpeedKmh ? `${calculatedSpeedKmh} km/h` : <span className="text-gray-500">-- km/h</span>}</p>
                            <p className="text-xl">{calculatedSpeedMph ? `${calculatedSpeedMph} mph` : <span className="text-gray-500">-- mph</span>}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Split Time Calculator */}
              {activeCalculatorTab === 'split' && (
                <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
                  <div className="mb-6">
                    <h2 className="text-xl mb-1">Split Time Calculator</h2>
                     {/* ADDED Description */}
                    <p className="text-sm text-gray-400 mb-4">Calculate split times for various distances based on your target pace.</p>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <span className={`text-sm ${!splitIsKmToMile ? 'text-white' : 'text-gray-400'}`}>min/km</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={splitIsKmToMile} onChange={() => setSplitIsKmToMile(!splitIsKmToMile)} className="sr-only peer" />
                        <div className="w-14 h-7 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-blue-600 after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600 bg-blue-600/30"></div>
                      </label>
                      <span className={`text-sm ${splitIsKmToMile ? 'text-white' : 'text-gray-400'}`}>min/mile</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Target Pace ({!splitIsKmToMile ? 'min/km' : 'min/mile'})</label>
                        <div className="flex gap-2">
                          <input type="number" min="0" value={splitMin} onChange={(e) => setSplitMin(e.target.value)} placeholder="min" className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          <input type="number" min="0" max="59" value={splitSec} onChange={(e) => setSplitSec(e.target.value)} placeholder="sec" className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      {hasSplitPace && (
                        <>
                          <div className="flex gap-2">
                            <button onClick={() => setSplitType('track')} className={`flex-1 px-4 py-2 rounded-md transition-colors text-sm ${splitType === 'track' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}>Track</button>
                            <button onClick={() => setSplitType('long-distance')} className={`flex-1 px-4 py-2 rounded-md transition-colors text-sm ${splitType === 'long-distance' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}>Long Dist.</button>
                            <button onClick={() => setSplitType('custom')} className={`flex-1 px-4 py-2 rounded-md transition-colors text-sm ${splitType === 'custom' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}>Custom</button>
                          </div>
                          {splitType === 'long-distance' && (
                            <div className="flex gap-2">
                              <button onClick={() => setDistanceType('kilometers')} className={`flex-1 px-4 py-2 rounded-md transition-colors ${distanceType === 'kilometers' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}>Kilometers</button>
                              <button onClick={() => setDistanceType('miles')} className={`flex-1 px-4 py-2 rounded-md transition-colors ${distanceType === 'miles' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}>Miles</button>
                            </div>
                          )}
                          {splitType === 'custom' && (
                            <div className="space-y-4 pt-4 border-t border-gray-700">
                              <label className="block text-sm font-medium mb-2">Custom Distance</label>
                              <div className="flex gap-2">
                                <input type="number" min="0" step="any" value={customDistance} onChange={(e) => setCustomDistance(e.target.value)} placeholder="distance" className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <select value={customDistanceUnit} onChange={(e) => setCustomDistanceUnit(e.target.value as CustomDistanceUnit)} className="px-3 py-2 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                  <option value="m">Meters</option>
                                  <option value="km">Kilometers</option>
                                  <option value="mile">Miles</option>
                                  <option value="ft">Feet</option>
                                  <option value="yd">Yards</option>
                                </select>
                              </div>
                              <div>
                                <h3 className="text-lg mb-2">Calculated Split Time:</h3>
                                <div className="p-4 rounded-md bg-gray-800">
                                  <p className="text-xl text-center">{calculatedCustomSplit}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {splitType === 'track' && (
                            <div className="mt-4 overflow-x-auto">
                              <table className="w-full min-w-full">
                                <thead><tr><th className="text-left py-2 px-2">Distance (m)</th><th className="text-right py-2 px-2">Split Time</th></tr></thead>
                                <tbody className="divide-y divide-gray-700">
                                  {trackDistancesMeters.map((distanceM) => (<tr key={distanceM}><td className="py-2 px-2">{distanceM} m</td><td className="text-right py-2 px-2">{calculateSplitTime(distanceM, 'm')}</td></tr>))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          {splitType === 'long-distance' && (
                            <div className="mt-4 overflow-x-auto">
                              <table className="w-full min-w-full">
                                <thead><tr><th className="text-left py-2 px-2">Distance</th><th className="text-right py-2 px-2">Split Time</th></tr></thead>
                                <tbody className="divide-y divide-gray-700">
                                  {longDistanceData.map((item, index) => (<tr key={index} className={item.special ? 'bg-purple-900/20' : ''}><td className="py-2 px-2">{item.label}</td><td className="text-right py-2 px-2">{calculateSplitTime(item.distance, item.unit)}</td></tr>))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Render Navbar */}
      <Navbar onNavigate={setActiveSection} activeSection={activeSection} />

      {/* Render the active page content */}
      {renderPageContent()}
    </div>
  );
}

export default App;
