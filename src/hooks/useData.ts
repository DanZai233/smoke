import { useState, useEffect, useCallback } from 'react';
import { SmokeRecord, UserSettings } from '../types';

const defaultSettings: UserSettings = {
  dailyLimit: 10,
  pricePerPack: 20,
  cigsPerPack: 20,
  startDate: Date.now(),
  theme: 'graphite',
};

export function useData() {
  const [records, setRecords] = useState<SmokeRecord[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedRecords = localStorage.getItem('chouleme_records');
    const savedSettings = localStorage.getItem('chouleme_settings');
    
    if (savedRecords) {
      try { setRecords(JSON.parse(savedRecords)); } catch(e) {}
    }
    if (savedSettings) {
      try { 
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) }); 
      } catch(e) {}
    }
    setIsLoaded(true);
  }, []);

  const addRecord = useCallback((count: number, mood?: string, reason?: string, recordType: 'smoke' | 'resist' = 'smoke') => {
    const newRecord: SmokeRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      count,
      mood,
      reason,
      recordType,
    };
    setRecords((prev) => {
      const updated = [...prev, newRecord];
      localStorage.setItem('chouleme_records', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('chouleme_settings', JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  const resetData = useCallback(() => {
    setRecords([]);
    updateSettings({ startDate: Date.now() });
    localStorage.removeItem('chouleme_records');
  }, [updateSettings]);

  return { records, settings, addRecord, updateSettings, isLoaded, resetData };
}
