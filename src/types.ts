export interface SmokeRecord {
  id: string;
  timestamp: number;
  count: number;
}

export interface UserSettings {
  dailyLimit: number;
  pricePerPack: number;
  cigsPerPack: number;
  startDate: number;
}

export type TabType = 'home' | 'trends' | 'settings';
