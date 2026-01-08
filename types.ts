
export interface SetLog {
  id: string;
  weight: number;
  reps: number;
  rpe: number;
  restTime: number; // in seconds
}

export interface ExerciseLog {
  id: string;
  name: string;
  sets: SetLog[];
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO string format
  name: string;
  exercises: ExerciseLog[];
}

export interface RecoveryLog {
  id: string;
  date: string; // ISO string format
  sleepHours: number;
  soreness: number; // Scale 1-5
  readiness: number; // Scale 1-5
}

export interface AIInsight {
  readinessScore: number;
  analysis: string;
  suggestion: string;
}
