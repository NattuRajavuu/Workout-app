
/**
 * Calculates the estimated 1 Rep Max (e1RM) using the Brzycki formula.
 * @param weight The weight lifted.
 * @param reps The number of repetitions performed.
 * @returns The estimated 1 Rep Max, rounded to the nearest integer.
 */
export const calculateE1RM = (weight: number, reps: number): number => {
  if (reps < 1 || reps > 10) {
    // Formula is most accurate for reps between 1 and 10
    // For single reps, e1RM is the weight itself. For > 10, it's less reliable.
    // We'll still calculate but it's a rough estimate.
    if (reps === 1) return weight;
  }
  
  if (weight <= 0) return 0;

  const e1rm = weight / (1.0278 - 0.0278 * reps);
  return Math.round(e1rm);
};

/**
 * Generates a standard RFC4122 version 4 UUID.
 * @returns A unique identifier string.
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
