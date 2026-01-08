
import { useState, useEffect, useCallback } from 'react';
import type { WorkoutLog } from '../types';
import { storageService } from '../services/storageService';
import { sampleWorkouts } from '../utils/sampleData';

export const useWorkoutData = (clientId: string | null) => {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    if (!clientId) {
        setWorkouts([]);
        return;
    }

    const WORKOUTS_KEY = `lifttrack-workouts-${clientId}`;
    const savedWorkouts = storageService.getItem<WorkoutLog[]>(WORKOUTS_KEY);
    
    const ownerId = storageService.getItem<string>('lifttrack-owner-id');
    const isOwner = clientId === ownerId;

    if (isOwner && !savedWorkouts) {
        setWorkouts(sampleWorkouts);
        storageService.setItem(WORKOUTS_KEY, sampleWorkouts);
    } else {
        setWorkouts(savedWorkouts || []);
    }
  }, [clientId]);

  const addWorkout = useCallback((newWorkout: WorkoutLog) => {
    if (!clientId) return;
    const WORKOUTS_KEY = `lifttrack-workouts-${clientId}`;

    setWorkouts(prevWorkouts => {
      const updatedWorkouts = [newWorkout, ...prevWorkouts];
      storageService.setItem(WORKOUTS_KEY, updatedWorkouts);
      return updatedWorkouts;
    });
  }, [clientId]);
  
  return { workouts, addWorkout };
};
