import { useState, useEffect, useCallback } from 'react';
import { SmokeRecord, UserSettings } from '../types';

const defaultSettings: UserSettings = {
  dailyLimit: 10,
  pricePerPack: 20,
  cigsPerPack: 20,
  startDate: Date.now(),
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

  const addRecord = useCallback((count: number) => {
    const newRecord: SmokeRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      count,
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
    if(confirm('确定要清空所有数据重新开始吗？这对戒烟可能是个好主意！')) {
       setRecords([]);
       updateSettings({ startDate: Date.now() });
       localStorage.removeItem('chouleme_records');
    }
  }, [updateSettings]);

  return { records, settings, addRecord, updateSettings, isLoaded, resetData };
}
