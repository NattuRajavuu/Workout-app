
import React, { useState } from 'react';
import type { WorkoutLog, ExerciseLog, SetLog } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface WorkoutLoggerProps {
  onWorkoutComplete: (workout: WorkoutLog) => void;
}

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ onWorkoutComplete }) => {
  const [workoutName, setWorkoutName] = useState<string>(`Workout - ${new Date().toLocaleDateString()}`);
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);

  const addExercise = () => {
    setExercises([...exercises, { id: Date.now().toString(), name: '', sets: [] }]);
  };

  const updateExerciseName = (exIndex: number, name: string) => {
    const newExercises = [...exercises];
    newExercises[exIndex].name = name;
    setExercises(newExercises);
  };

  const removeExercise = (exIndex: number) => {
    setExercises(exercises.filter((_, index) => index !== exIndex));
  };
  
  const addSet = (exIndex: number) => {
    const newExercises = [...exercises];
    const lastSet = newExercises[exIndex].sets[newExercises[exIndex].sets.length - 1];
    const newSet: SetLog = {
        id: Date.now().toString(),
        weight: lastSet?.weight || 0,
        reps: lastSet?.reps || 0,
        rpe: lastSet?.rpe || 7,
        restTime: 60
    };
    newExercises[exIndex].sets.push(newSet);
    setExercises(newExercises);
  };

  const updateSet = (exIndex: number, setIndex: number, field: keyof Omit<SetLog, 'id'>, value: number) => {
    const newExercises = [...exercises];
    newExercises[exIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const removeSet = (exIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exIndex].sets = newExercises[exIndex].sets.filter((_, index) => index !== setIndex);
    setExercises(newExercises);
  };

  const handleFinishWorkout = () => {
    const workout: WorkoutLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name: workoutName,
      exercises: exercises.filter(ex => ex.name && ex.sets.length > 0)
    };
    onWorkoutComplete(workout);
  };

  const isFinishDisabled = exercises.every(ex => !ex.name || ex.sets.length === 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-200">Log Workout</h2>
      <input
        type="text"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
        placeholder="Workout Name"
        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2"
      />

      {exercises.map((exercise, exIndex) => (
        <div key={exercise.id} className="bg-gray-800 p-4 rounded-lg space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={exercise.name}
              onChange={(e) => updateExerciseName(exIndex, e.target.value)}
              placeholder="Exercise Name (e.g., Bench Press)"
              className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-md p-2"
            />
            <button onClick={() => removeExercise(exIndex)} className="p-2 text-gray-400 hover:text-red-500">
                <TrashIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 font-semibold px-2">
             <div className="col-span-1">Set</div>
             <div className="col-span-4">Weight</div>
             <div className="col-span-3">Reps</div>
             <div className="col-span-3">RPE</div>
          </div>

          {exercise.sets.map((set, setIndex) => (
            <div key={set.id} className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-1 text-center text-gray-300">{setIndex + 1}</span>
              <input type="number" value={set.weight} onChange={(e) => updateSet(exIndex, setIndex, 'weight', Number(e.target.value))} className="col-span-4 bg-gray-700 rounded p-2 text-center" />
              <input type="number" value={set.reps} onChange={(e) => updateSet(exIndex, setIndex, 'reps', Number(e.target.value))} className="col-span-3 bg-gray-700 rounded p-2 text-center" />
              <input type="number" value={set.rpe} onChange={(e) => updateSet(exIndex, setIndex, 'rpe', Number(e.target.value))} className="col-span-3 bg-gray-700 rounded p-2 text-center" />
              <button onClick={() => removeSet(exIndex, setIndex)} className="col-span-1 p-2 text-gray-500 hover:text-red-500">
                  <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
           <button onClick={() => addSet(exIndex)} className="w-full text-sm bg-gray-700 hover:bg-gray-600 text-emerald-400 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
             <PlusIcon className="w-4 h-4 mr-1" /> Add Set
            </button>
        </div>
      ))}

      <button onClick={addExercise} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
        <PlusIcon className="w-5 h-5 mr-2" /> Add Exercise
      </button>

      <button onClick={handleFinishWorkout} disabled={isFinishDisabled} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
        Finish Workout
      </button>
    </div>
  );
};

export default WorkoutLogger;
