import { useState } from 'react';
import { UserSettings } from '../types';
import { Settings2, RefreshCw, Info } from 'lucide-react';

interface SettingsTabProps {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetData: () => void;
}

export function SettingsTab({ settings, updateSettings, resetData }: SettingsTabProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = () => {
    updateSettings(localSettings);
    setSaveStatus('保存成功！');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-6 space-y-6 max-w-lg mx-auto w-full">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center justify-center">
          <Settings2 className="mr-2" />
          系统设置
        </h2>
        <p className="text-sm text-gray-500 mt-1">骗我可以，别骗自己。</p>
      </div>

      <div className="space-y-4">
        {/* Daily Limit */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <label className="flex flex-col">
            <span className="text-sm font-bold text-gray-700 mb-1">每日抽烟上限 (根)</span>
            <span className="text-xs text-gray-500 mb-3">设定一个目标，然后努力不去打破它。</span>
            <input 
              type="number" 
              min="0"
              value={localSettings.dailyLimit}
              onChange={e => setLocalSettings({...localSettings, dailyLimit: parseInt(e.target.value) || 0})}
              className="w-full bg-gray-50 p-3 rounded-xl border-none focus:ring-2 focus:ring-gray-800 outline-none font-bold text-lg"
            />
          </label>
        </div>

        {/* Financial Settings */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-start space-x-2 bg-blue-50 text-blue-800 p-3 rounded-xl mb-2">
            <Info size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              帮你算算抽烟花了多少钱。别怕，看到数字你可能就想戒了。
            </p>
          </div>
          
          <label className="flex flex-col">
            <span className="text-sm font-bold text-gray-700 mb-1">每包烟价格 (元)</span>
            <input 
              type="number" 
              min="0"
              value={localSettings.pricePerPack}
              onChange={e => setLocalSettings({...localSettings, pricePerPack: parseInt(e.target.value) || 0})}
              className="w-full bg-gray-50 p-3 rounded-xl border-none focus:ring-2 focus:ring-gray-800 outline-none font-bold text-lg"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-bold text-gray-700 mb-1">每包烟数量 (通常是20根)</span>
            <input 
              type="number" 
              min="1"
              value={localSettings.cigsPerPack}
              onChange={e => setLocalSettings({...localSettings, cigsPerPack: parseInt(e.target.value) || 1})}
              className="w-full bg-gray-50 p-3 rounded-xl border-none focus:ring-2 focus:ring-gray-800 outline-none font-bold text-lg"
            />
          </label>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-lg hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-gray-300"
        >
          {saveStatus || '保存设置'}
        </button>

        {/* Danger Zone */}
        <div className="pt-8">
          <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest pl-2 mb-3">危险区域</h3>
          <button 
            onClick={resetData}
            className="w-full py-4 rounded-xl border-2 border-red-100 bg-red-50 text-red-600 font-bold flex items-center justify-center hover:bg-red-100 active:scale-95 transition-all"
          >
            <RefreshCw size={18} className="mr-2" />
            清空所有记录重新做人
          </button>
        </div>
      </div>
    </div>
  );
}
