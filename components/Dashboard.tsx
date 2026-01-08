
import React, { useState, useEffect } from 'react';
import type { WorkoutLog, RecoveryLog, AIInsight } from '../types';
import { getAIInsights } from '../services/geminiService';
import RecoveryLogger from './RecoveryLogger';
import { BrainCircuitIcon, DumbbellIcon, TrendingUpIcon } from './Icons';

interface DashboardProps {
  workouts: WorkoutLog[];
  recoveryLogs: RecoveryLog[];
  addRecoveryLog: (log: RecoveryLog) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ workouts, recoveryLogs, addRecoveryLog }) => {
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      if (workouts.length > 0 || recoveryLogs.length > 0) {
        const result = await getAIInsights(workouts, recoveryLogs);
        setInsights(result);
      } else {
        setInsights({
          readinessScore: 75,
          analysis: "Ready to go! Log a workout and recovery data to get personalized insights.",
          suggestion: "Start with a solid warm-up and your main compound lift."
        });
      }
      setIsLoading(false);
    };

    fetchInsights();
  }, [workouts, recoveryLogs]);

  const lastWorkout = workouts.length > 0 ? workouts[0] : null;

  const getReadinessColor = (score: number) => {
    if (score > 75) return 'text-emerald-400';
    if (score > 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const today = new Date().toISOString().split('T')[0];
  const hasLoggedRecoveryToday = recoveryLogs.some(log => log.date === today);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-200">Dashboard</h2>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="flex items-center text-lg font-semibold text-emerald-400 mb-4">
          <BrainCircuitIcon className="w-6 h-6 mr-2" />
          AI Readiness Analysis
        </h3>
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          </div>
        ) : insights ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-400">Readiness Score</p>
              <p className={`text-6xl font-bold ${getReadinessColor(insights.readinessScore)}`}>
                {insights.readinessScore}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-300">Analysis:</p>
              <p className="text-gray-400">{insights.analysis}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-300">Suggestion:</p>
              <p className="text-gray-400">{insights.suggestion}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No insights available. Log some data to get started.</p>
        )}
      </div>

      {!hasLoggedRecoveryToday && (
         <button
            onClick={() => setIsRecoveryModalOpen(true)}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Log Today's Recovery
        </button>
      )}

      {lastWorkout && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="flex items-center text-lg font-semibold text-gray-300 mb-4">
            <DumbbellIcon className="w-6 h-6 mr-2" />
            Last Workout
          </h3>
          <p className="text-gray-400 text-sm">{new Date(lastWorkout.date).toLocaleDateString()}</p>
          <p className="text-xl font-bold text-gray-100">{lastWorkout.name}</p>
          <ul className="mt-2 space-y-1 text-gray-400">
            {lastWorkout.exercises.slice(0,3).map(ex => (
              <li key={ex.id}>{ex.name}: {ex.sets.length} sets</li>
            ))}
            {lastWorkout.exercises.length > 3 && <li>...and more</li>}
          </ul>
        </div>
      )}
      
      {isRecoveryModalOpen && (
        <RecoveryLogger 
            onClose={() => setIsRecoveryModalOpen(false)}
            onSave={(log) => {
                addRecoveryLog(log);
                setIsRecoveryModalOpen(false);
            }}
        />
      )}
    </div>
  );
};

export default Dashboard;
