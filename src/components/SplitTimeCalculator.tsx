import React from 'react';
import { SplitTimeState, CustomDistanceUnit, SplitType } from '../types';
import { calculateSplitTime } from '../utils/calculations';

interface SplitTimeCalculatorProps {
  state: SplitTimeState;
  setState: React.Dispatch<React.SetStateAction<SplitTimeState>>;
}

const TRACK_DISTANCES_METERS = [
  50, 60, 100, 110, 200, 300, 400, 500, 600, 700, 800, 900,
  1000, 1100, 1200, 1300, 1400, 1500
];

interface Point {
  distance: number;
  label: string;
  unit: 'km' | 'mile';
  special?: boolean;
}

const generateLongDistanceData = (distanceType: 'kilometers' | 'miles'): Point[] => {
  const distancesInKm = {
    halfMarathonMidpoint: 10.54875,
    halfMarathon: 21.0975,
    marathon: 42.195
  };
  const distancesInMiles = {
    halfMarathonMidpoint: 6.5546875,
    halfMarathon: 13.109375,
    marathon: 26.21875
  };

  const baseUnitDistances = distanceType === 'kilometers' ? distancesInKm : distancesInMiles;
  const unitLabel = distanceType === 'kilometers' ? 'km' : 'mile';
  const maxDistance = distanceType === 'kilometers' ? 42 : 26;

  const points: Point[] = [];
  
  // Regular distances
  for (let i = 1; i <= maxDistance; i++) {
    points.push({
      distance: i,
      label: `${i} ${unitLabel}`,
      unit: unitLabel === 'km' ? 'km' : 'mile'
    });
  }

  // Special distances
  points.push({
    distance: baseUnitDistances.halfMarathonMidpoint,
    label: `Mid point of Half Marathon (${baseUnitDistances.halfMarathonMidpoint.toFixed(2)} ${unitLabel})`,
    unit: unitLabel === 'km' ? 'km' : 'mile',
    special: true
  });
  points.push({
    distance: baseUnitDistances.halfMarathon,
    label: `Half Marathon (${baseUnitDistances.halfMarathon.toFixed(2)} ${unitLabel})`,
    unit: unitLabel === 'km' ? 'km' : 'mile',
    special: true
  });
  points.push({
    distance: baseUnitDistances.marathon,
    label: `Marathon (${baseUnitDistances.marathon.toFixed(2)} ${unitLabel})`,
    unit: unitLabel === 'km' ? 'km' : 'mile',
    special: true
  });

  // Sort and remove duplicates
  points.sort((a, b) => a.distance - b.distance);
  return points.reduce((acc: Point[], current) => {
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
};

export const SplitTimeCalculator: React.FC<SplitTimeCalculatorProps> = ({ state, setState }) => {
  const handleInputChange = (field: keyof SplitTimeState, value: string | boolean) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleSplitTypeChange = (newType: SplitType) => {
    setState(prev => ({ ...prev, splitType: newType }));
  };

  const hasSplitPace = state.splitMin !== '' || state.splitSec !== '';
  const longDistanceData = state.splitType === 'long-distance' ? generateLongDistanceData(state.distanceType) : [];

  const handlePaceUnitChange = () => {
    const newIsKmToMile = !state.splitIsKmToMile;
    handleInputChange('splitIsKmToMile', newIsKmToMile);
    
    // Recalculate split time immediately when switching units
    if (state.splitType === 'custom' && state.customDistance) {
      const newSplitTime = calculateSplitTime(
        state.splitMin,
        state.splitSec,
        newIsKmToMile,
        parseFloat(state.customDistance),
        state.customDistanceUnit
      );
      handleInputChange('calculatedCustomSplit', newSplitTime);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Split Time Calculator</h2>
      <p className="text-sm text-gray-600 mb-6">
        Calculate split times for various distances based on your target pace.
      </p>

      <div className="space-y-6">
        {/* Pace Unit Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <span className={state.splitIsKmToMile ? 'text-gray-500' : 'text-gray-900'}>
            min/km
          </span>
          <button
            onClick={handlePaceUnitChange}
            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{ backgroundColor: state.splitIsKmToMile ? '#3B82F6' : '#E5E7EB' }}
          >
            <span
              className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              style={{ transform: `translateX(${state.splitIsKmToMile ? '20px' : '0'})` }}
            />
          </button>
          <span className={state.splitIsKmToMile ? 'text-gray-900' : 'text-gray-500'}>
            min/mile
          </span>
        </div>

        {/* Target Pace Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Pace ({state.splitIsKmToMile ? 'min/mile' : 'min/km'})
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              value={state.splitMin}
              onChange={(e) => handleInputChange('splitMin', e.target.value)}
              placeholder="min"
              className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="flex items-center">:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={state.splitSec}
              onChange={(e) => handleInputChange('splitSec', e.target.value)}
              placeholder="sec"
              className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {hasSplitPace && (
          <>
            {/* Split Type Selection */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSplitTypeChange('track')}
                className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                  state.splitType === 'track'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Track
              </button>
              <button
                onClick={() => handleSplitTypeChange('long-distance')}
                className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                  state.splitType === 'long-distance'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Long Distance
              </button>
              <button
                onClick={() => handleSplitTypeChange('custom')}
                className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                  state.splitType === 'custom'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Long Distance Unit Selection */}
            {state.splitType === 'long-distance' && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleInputChange('distanceType', 'kilometers')}
                  className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                    state.distanceType === 'kilometers'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Kilometers
                </button>
                <button
                  onClick={() => handleInputChange('distanceType', 'miles')}
                  className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                    state.distanceType === 'miles'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Miles
                </button>
              </div>
            )}

            {/* Custom Distance Input */}
            {state.splitType === 'custom' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Custom Distance</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={state.customDistance}
                    onChange={(e) => handleInputChange('customDistance', e.target.value)}
                    placeholder="distance"
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={state.customDistanceUnit}
                    onChange={(e) => handleInputChange('customDistanceUnit', e.target.value as CustomDistanceUnit)}
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="m">Meters</option>
                    <option value="km">Kilometers</option>
                    <option value="mile">Miles</option>
                    <option value="ft">Feet</option>
                    <option value="yd">Yards</option>
                  </select>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Split Time:</h3>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-xl text-center font-medium">
                      {state.calculatedCustomSplit}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Track Distances Table */}
            {state.splitType === 'track' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-2">Distance (m)</th>
                      <th className="text-right py-2 px-2">Split Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {TRACK_DISTANCES_METERS.map((distance) => (
                      <tr key={distance}>
                        <td className="py-2 px-2">{distance} m</td>
                        <td className="text-right py-2 px-2">
                          {calculateSplitTime(
                            state.splitMin,
                            state.splitSec,
                            state.splitIsKmToMile,
                            distance,
                            'm'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Long Distance Table */}
            {state.splitType === 'long-distance' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-2">Distance</th>
                      <th className="text-right py-2 px-2">Split Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {longDistanceData.map((item, index) => (
                      <tr
                        key={index}
                        className={item.special ? 'bg-blue-50' : undefined}
                      >
                        <td className="py-2 px-2">{item.label}</td>
                        <td className="text-right py-2 px-2">
                          {calculateSplitTime(
                            state.splitMin,
                            state.splitSec,
                            state.splitIsKmToMile,
                            item.distance,
                            item.unit
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 