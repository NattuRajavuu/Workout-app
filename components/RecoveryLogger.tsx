
import React, { useState } from 'react';
import type { RecoveryLog } from '../types';

interface RecoveryLoggerProps {
  onClose: () => void;
  onSave: (log: RecoveryLog) => void;
}

const RecoveryLogger: React.FC<RecoveryLoggerProps> = ({ onClose, onSave }) => {
  const [sleepHours, setSleepHours] = useState(8);
  const [soreness, setSoreness] = useState(2);
  const [readiness, setReadiness] = useState(3);

  const handleSave = () => {
    const newLog: RecoveryLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      sleepHours,
      soreness,
      readiness,
    };
    onSave(newLog);
  };
  
  const sorenessLabels = ["None", "Mild", "Moderate", "High", "Severe"];
  const readinessLabels = ["Very Poor", "Poor", "Okay", "Good", "Excellent"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 space-y-6">
        <h3 className="text-xl font-bold text-gray-100">Log Daily Recovery</h3>
        
        <div className="space-y-2">
            <label className="block text-gray-300">Sleep: <span className="font-bold text-emerald-400">{sleepHours} hours</span></label>
            <input type="range" min="0" max="12" step="0.5" value={sleepHours} onChange={(e) => setSleepHours(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-emerald-500" />
        </div>

        <div className="space-y-2">
            <label className="block text-gray-300">Soreness: <span className="font-bold text-emerald-400">{sorenessLabels[soreness - 1]}</span></label>
            <input type="range" min="1" max="5" value={soreness} onChange={(e) => setSoreness(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-emerald-500" />
        </div>
        
        <div className="space-y-2">
            <label className="block text-gray-300">Readiness: <span className="font-bold text-emerald-400">{readinessLabels[readiness - 1]}</span></label>
            <input type="range" min="1" max="5" value={readiness} onChange={(e) => setReadiness(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-emerald-500" />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecoveryLogger;
