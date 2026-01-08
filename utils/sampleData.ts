
import type { WorkoutLog, RecoveryLog } from '../types';

const generatePastDate = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
}

export const sampleWorkouts: WorkoutLog[] = [
    {
        id: 'w3',
        date: generatePastDate(1),
        name: "Leg Day",
        exercises: [
            { id: 'e31', name: 'Squat', sets: [
                { id: 's311', weight: 275, reps: 5, rpe: 8, restTime: 180 },
                { id: 's312', weight: 275, reps: 5, rpe: 8, restTime: 180 },
                { id: 's313', weight: 275, reps: 5, rpe: 9, restTime: 180 },
            ]},
            { id: 'e32', name: 'Romanian Deadlift', sets: [
                { id: 's321', weight: 225, reps: 8, rpe: 7, restTime: 120 },
                { id: 's322', weight: 225, reps: 8, rpe: 8, restTime: 120 },
            ]}
        ]
    },
    {
        id: 'w2',
        date: generatePastDate(3),
        name: "Push Day",
        exercises: [
            { id: 'e21', name: 'Bench Press', sets: [
                { id: 's211', weight: 205, reps: 6, rpe: 8, restTime: 120 },
                { id: 's212', weight: 205, reps: 6, rpe: 8, restTime: 120 },
                { id: 's213', weight: 205, reps: 5, rpe: 9, restTime: 120 },
            ]},
            { id: 'e22', name: 'Overhead Press', sets: [
                { id: 's221', weight: 135, reps: 5, rpe: 8, restTime: 120 },
                { id: 's222', weight: 135, reps: 5, rpe: 8, restTime: 120 },
            ]}
        ]
    },
    {
        id: 'w1',
        date: generatePastDate(5),
        name: "Pull Day",
        exercises: [
            { id: 'e11', name: 'Deadlift', sets: [
                { id: 's111', weight: 315, reps: 5, rpe: 8, restTime: 180 },
                { id: 's112', weight: 315, reps: 5, rpe: 9, restTime: 180 },
            ]},
            { id: 'e12', name: 'Pull Ups', sets: [
                { id: 's121', weight: 0, reps: 8, rpe: 7, restTime: 90 },
                { id: 's122', weight: 0, reps: 7, rpe: 8, restTime: 90 },
            ]}
        ]
    },
];


export const sampleRecoveryLogs: RecoveryLog[] = [
    { id: 'r4', date: generatePastDate(0).split('T')[0], sleepHours: 7, soreness: 4, readiness: 2 },
    { id: 'r3', date: generatePastDate(1).split('T')[0], sleepHours: 6.5, soreness: 2, readiness: 3 },
    { id: 'r2', date: generatePastDate(2).split('T')[0], sleepHours: 8, soreness: 1, readiness: 5 },
    { id: 'r1', date: generatePastDate(3).split('T')[0], sleepHours: 7.5, soreness: 3, readiness: 4 },
];
