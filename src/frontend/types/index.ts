export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: string;
  goal: string;
  dailyTargetMinutes: number;
  dailyCompletedMinutes: number;
  streakDays: number;
  xp: number;
  interests: string[];
}

export interface Message {
  sender: 'ai' | 'user';
  text: string;
  pt: string;
}

export interface Scenario {
  id: string;
  title: string;
  prompt: string;
  icon: string;
}

export interface Tutor {
  name: string;
  avatar: string;
  role: string;
  accent: string;
}