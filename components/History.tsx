
import React, { useState, useMemo } from 'react';
import type { WorkoutLog, SetLog } from '../types';
import { calculateE1RM } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUpIcon, ListChecksIcon } from './Icons';

interface HistoryProps {
  workouts: WorkoutLog[];
}

type ProgressionMetric = 'e1RM' | 'maxWeight' | 'totalVolume';

const metricConfig = {
    e1RM: { name: 'Est. 1RM', color: '#34D399', unit: 'kg/lbs' },
    maxWeight: { name: 'Max Weight', color: '#60A5FA', unit: 'kg/lbs' },
    totalVolume: { name: 'Total Volume', color: '#FBBF24', unit: 'kg/lbs' }
};

const History: React.FC<HistoryProps> = ({ workouts }) => {
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [progressionMetric, setProgressionMetric] = useState<ProgressionMetric>('e1RM');

  const uniqueExercises = useMemo(() => {
    const exerciseSet = new Set<string>();
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exerciseSet.add(exercise.name);
      });
    });
    return Array.from(exerciseSet).sort();
  }, [workouts]);

  if (uniqueExercises.length > 0 && !selectedExercise) {
    setSelectedExercise(uniqueExercises[0]);
  }
  
  const findBestSet = (sets: SetLog[]): SetLog | null => {
      if (!sets || sets.length === 0) return null;
      return sets.reduce((best, current) => {
          return calculateE1RM(current.weight, current.reps) > calculateE1RM(best.weight, best.reps) ? current : best;
      });
  };

  const chartData = useMemo(() => {
    if (!selectedExercise) return [];
    
    return workouts
      .map(workout => {
        const exercise = workout.exercises.find(ex => ex.name === selectedExercise);
        if (!exercise || exercise.sets.length === 0) return null;

        let value;
        switch (progressionMetric) {
            case 'maxWeight':
                value = Math.max(0, ...exercise.sets.map(s => s.weight));
                break;
            case 'totalVolume':
                value = exercise.sets.reduce((sum, s) => sum + (s.weight * s.reps), 0);
                break;
            case 'e1RM':
            default:
                const bestSet = findBestSet(exercise.sets);
                value = bestSet ? calculateE1RM(bestSet.weight, bestSet.reps) : 0;
                break;
        }
        
        return {
          date: new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: value,
        };
      })
      .filter(item => item !== null && item.value > 0)
      .reverse();
  }, [workouts, selectedExercise, progressionMetric]);
  
  const sessionHighlights = useMemo(() => {
     if (!selectedExercise) return [];
     return workouts
        .map(workout => {
            const exercise = workout.exercises.find(ex => ex.name === selectedExercise);
            if (!exercise) return null;
            
            const bestSet = findBestSet(exercise.sets);
            if (!bestSet) return null;
            
            return {
                date: new Date(workout.date).toLocaleDateString(),
                set: bestSet,
            };
        })
        .filter((item): item is { date: string; set: SetLog } => item !== null)
        .reverse();
  }, [workouts, selectedExercise]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-200">Progression History</h2>

      {workouts.length === 0 ? (
         <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
            <p>No workouts logged yet.</p>
            <p>Complete a workout to see your progression here.</p>
        </div>
      ) : (
        <>
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg">
                <div className="mb-4">
                    <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-400 mb-1">
                        Select Exercise
                    </label>
                    <select
                        id="exercise-select"
                        value={selectedExercise}
                        onChange={(e) => setSelectedExercise(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        {uniqueExercises.map(ex => (
                            <option key={ex} value={ex}>{ex}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Progression Metric</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(Object.keys(metricConfig) as ProgressionMetric[]).map(metric => (
                            <button
                                key={metric}
                                onClick={() => setProgressionMetric(metric)}
                                className={`py-2 px-1 text-sm rounded-md transition-colors ${progressionMetric === metric ? 'bg-emerald-600 text-white font-semibold' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                            >
                                {metricConfig[metric].name}
                            </button>
                        ))}
                    </div>
                </div>
                
                {chartData.length > 1 ? (
                    <div className="h-64 md:h-80">
                        <h3 className="flex items-center text-lg font-semibold text-gray-300 mb-4">
                            <TrendingUpIcon className="w-6 h-6 mr-2" />
                            {metricConfig[progressionMetric].name} Progression
                        </h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                <XAxis dataKey="date" stroke="#A0AEC0" fontSize={12} />
                                <YAxis stroke="#A0AEC0" fontSize={12} domain={['dataMin - 10', 'dataMax + 10']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#2D3748', borderColor: '#4A5568', color: '#E2E8F0' }}
                                    labelStyle={{ color: '#A0AEC0' }}
                                />
                                <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                                <Line type="monotone" dataKey="value" name={metricConfig[progressionMetric].name} stroke={metricConfig[progressionMetric].color} strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-10">
                        <p>Not enough data to show a chart for this exercise.</p>
                        <p>Log at least two sessions to see your progress.</p>
                    </div>
                )}
            </div>

            {sessionHighlights.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg">
                     <h3 className="flex items-center text-lg font-semibold text-gray-300 mb-4">
                        <ListChecksIcon className="w-6 h-6 mr-2" />
                        Session Highlights
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {sessionHighlights.map(({ date, set }) => (
                            <div key={set.id} className="bg-gray-700/50 p-3 rounded-md flex justify-between items-center">
                                <span className="text-sm text-gray-400">{date}</span>
                                <span className="font-semibold text-white">{set.weight} {metricConfig.e1RM.unit} x {set.reps} reps</span>
                                <span className="text-sm text-gray-300">@ RPE {set.rpe}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default History;
