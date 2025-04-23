import React from 'react';
import { DetailedPaceState } from '../types';
import { calculateDetailedPace } from '../utils/calculations';

interface DetailedPaceCalculatorProps {
  state: DetailedPaceState;
  setState: React.Dispatch<React.SetStateAction<DetailedPaceState>>;
}

export const DetailedPaceCalculator: React.FC<DetailedPaceCalculatorProps> = ({ state, setState }) => {
  const handleInputChange = (field: keyof DetailedPaceState, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleDistanceUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    if (newUnit === 'marathon') {
      setState(prev => ({ ...prev, distance: '42.195', distanceUnit: newUnit }));
    } else if (newUnit === 'half-marathon') {
      setState(prev => ({ ...prev, distance: '21.0975', distanceUnit: newUnit }));
    } else if (['km', 'mile', 'm', 'yard'].includes(newUnit)) {
      setState(prev => ({ ...prev, distanceUnit: newUnit }));
    }
  };

  React.useEffect(() => {
    // For marathon and half-marathon, we need to convert to km for calculations
    let calculationUnit = state.distanceUnit;
    let calculationDistance = state.distance;

    if (state.distanceUnit === 'marathon') {
      calculationUnit = 'km';
      calculationDistance = '42.195';
    } else if (state.distanceUnit === 'half-marathon') {
      calculationUnit = 'km';
      calculationDistance = '21.0975';
    }

    const result = calculateDetailedPace(
      calculationDistance,
      calculationUnit,
      state.hours,
      state.minutes,
      state.seconds
    );
    setState(prev => ({
      ...prev,
      calculatedPaceKm: result.calculatedPaceKm,
      calculatedPaceMile: result.calculatedPaceMile,
      calculatedSpeedKmh: result.calculatedSpeedKmh,
      calculatedSpeedMph: result.calculatedSpeedMph,
    }));
  }, [state.distance, state.distanceUnit, state.hours, state.minutes, state.seconds]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Detailed Pace Calculator</h2>
      <p className="text-sm text-gray-600 mb-6">
        Calculate your pace (min/km and min/mile) and speed based on distance and time.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="any"
              value={state.distance}
              onChange={(e) => handleInputChange('distance', e.target.value)}
              placeholder="Distance"
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={state.distanceUnit}
              onChange={handleDistanceUnitChange}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="km">Kilometers</option>
              <option value="mile">Miles</option>
              <option value="m">Meters</option>
              <option value="yard">Yards</option>
              <option value="half-marathon">Half-Marathon</option>
              <option value="marathon">Marathon</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              value={state.hours}
              onChange={(e) => handleInputChange('hours', e.target.value)}
              placeholder="Hours"
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              min="0"
              max="59"
              value={state.minutes}
              onChange={(e) => handleInputChange('minutes', e.target.value)}
              placeholder="Minutes"
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              min="0"
              max="59"
              value={state.seconds}
              onChange={(e) => handleInputChange('seconds', e.target.value)}
              placeholder="Seconds"
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="border-t pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Calculated Pace:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Minutes per Kilometer</p>
                <p className="text-xl font-medium">
                  {state.calculatedPaceKm || '--:--'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Minutes per Mile</p>
                <p className="text-xl font-medium">
                  {state.calculatedPaceMile || '--:--'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Speed:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Kilometers per Hour</p>
                <p className="text-xl font-medium">
                  {state.calculatedSpeedKmh ? `${state.calculatedSpeedKmh} km/h` : '--'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Miles per Hour</p>
                <p className="text-xl font-medium">
                  {state.calculatedSpeedMph ? `${state.calculatedSpeedMph} mph` : '--'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 