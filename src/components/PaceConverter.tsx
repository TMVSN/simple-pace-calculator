import React from 'react';
import { PaceConverterState } from '../types';
import { calculatePaceConversion } from '../utils/calculations';

interface PaceConverterProps {
  state: PaceConverterState;
  setState: React.Dispatch<React.SetStateAction<PaceConverterState>>;
}

export const PaceConverter: React.FC<PaceConverterProps> = ({ state, setState }) => {
  const handleInputChange = (field: keyof PaceConverterState, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  React.useEffect(() => {
    const result = calculatePaceConversion(state.inputMin, state.inputSec, state.isKmToMile);
    setState(prev => ({
      ...prev,
      outputMin: result.outputMin,
      outputSec: result.outputSec,
      speedKmh: result.speedKmh,
      speedMph: result.speedMph,
    }));
  }, [state.inputMin, state.inputSec, state.isKmToMile]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Simple Pace Converter</h2>
      
      {/* Unit Toggle Switch */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <span className={!state.isKmToMile ? 'text-gray-900' : 'text-gray-500'}>
          min/km
        </span>
        <button
          onClick={() => setState(prev => ({ ...prev, isKmToMile: !prev.isKmToMile }))}
          className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{ backgroundColor: state.isKmToMile ? '#3B82F6' : '#E5E7EB' }}
        >
          <span
            className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            style={{ transform: `translateX(${state.isKmToMile ? '20px' : '0'})` }}
          />
        </button>
        <span className={state.isKmToMile ? 'text-gray-900' : 'text-gray-500'}>
          min/mile
        </span>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2">
            {state.isKmToMile ? 'Minutes per Mile' : 'Minutes per Kilometer'}
          </h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={state.inputMin}
              onChange={(e) => handleInputChange('inputMin', e.target.value)}
              placeholder="min"
              className="w-20 p-2 border rounded"
              min="0"
            />
            <span>:</span>
            <input
              type="number"
              value={state.inputSec}
              onChange={(e) => handleInputChange('inputSec', e.target.value)}
              placeholder="sec"
              className="w-20 p-2 border rounded"
              min="0"
              max="59"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">
            {state.isKmToMile ? 'Minutes per Kilometer' : 'Minutes per Mile'}
          </h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={state.outputMin}
              readOnly
              className="w-20 p-2 border rounded bg-gray-50"
              placeholder="min"
            />
            <span>:</span>
            <input
              type="text"
              value={state.outputSec}
              readOnly
              className="w-20 p-2 border rounded bg-gray-50"
              placeholder="sec"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2">
            Speed ({state.isKmToMile ? 'mph' : 'km/h'})
          </h3>
          <input
            type="text"
            value={state.isKmToMile ? state.speedMph : state.speedKmh}
            readOnly
            className="w-24 p-2 border rounded bg-gray-50"
          />
        </div>
        <div>
          <h3 className="font-semibold mb-2">
            Speed ({state.isKmToMile ? 'km/h' : 'mph'})
          </h3>
          <input
            type="text"
            value={state.isKmToMile ? state.speedKmh : state.speedMph}
            readOnly
            className="w-24 p-2 border rounded bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}; 