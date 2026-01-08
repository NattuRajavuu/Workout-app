
import { GoogleGenAI, Type } from '@google/genai';
import type { WorkoutLog, RecoveryLog, AIInsight } from '../types';

export async function getAIInsights(
  workouts: WorkoutLog[],
  recoveryLogs: RecoveryLog[],
): Promise<AIInsight | null> {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return {
      readinessScore: 0,
      analysis: 'API Key not configured.',
      suggestion: 'Please configure your Gemini API key.',
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `You are a sports science AI expert for advanced strength lifters. Analyze the following training and recovery data. The user needs concise, no-nonsense insights.

  **Recent Workouts (up to last 5, sorted newest to oldest):**
  ${JSON.stringify(workouts.slice(0, 5), null, 2)}

  **Recent Recovery Logs (up to last 7, sorted newest to oldest):**
  ${JSON.stringify(recoveryLogs.slice(0, 7), null, 2)}

  **Instructions:**
  Based on the provided data, generate a JSON object with three keys:
  1.  "readinessScore": An integer from 0 to 100 representing the lifter's readiness for a demanding session. Consider training volume, intensity (RPE), frequency, soreness (1=low, 5=high), and sleep.
  2.  "analysis": A short, direct sentence (max 20 words) analyzing the current training state (e.g., "High training volume is accumulating fatigue.", "Recovery is excellent, indicating readiness for progression.", "Soreness is high after leg day, prioritize recovery.").
  3.  "suggestion": A single, actionable training suggestion for today or the next session (max 20 words). Examples: "Consider reducing volume by 1-2 sets on main lifts.", "A deload or active recovery day is recommended.", "Excellent conditions for a potential PR attempt."

  Do not include any introductory text, explanations, or markdown formatting. Only return the raw JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
          responseMimeType: 'application/json',
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  readinessScore: { type: Type.INTEGER, description: "Lifter's readiness score from 0-100" },
                  analysis: { type: Type.STRING, description: "A short analysis of training state." },
                  suggestion: { type: Type.STRING, description: "An actionable training suggestion." },
              },
              required: ['readinessScore', 'analysis', 'suggestion'],
          },
      },
    });
    
    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("Empty response from AI");
    }
    
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as AIInsight;

  } catch (error) {
    console.error('Error fetching AI insights:', error);
    return {
      readinessScore: 50,
      analysis: 'Could not fetch AI insights.',
      suggestion: 'Check your API key and connection.',
    };
  }
}
