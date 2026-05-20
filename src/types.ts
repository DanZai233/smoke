export interface SmokeRecord {
  id: string;
  timestamp: number;
  count: number;
  mood?: string;
  reason?: string;
}

export type ThemeType = 'graphite' | 'matcha' | 'ocean' | 'peach' | 'lavender';

export interface UserSettings {
  dailyLimit: number;
  pricePerPack: number;
  cigsPerPack: number;
  startDate: number;
  theme: ThemeType;
}

export type TabType = 'home' | 'trends' | 'health' | 'settings';
