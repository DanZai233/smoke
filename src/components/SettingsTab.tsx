import { useState } from 'react';
import { UserSettings, ThemeType } from '../types';
import { Settings2, RefreshCw, Info, Palette } from 'lucide-react';

interface SettingsTabProps {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetData: () => void;
}

const THEMES: { id: ThemeType; name: string; color: string }[] = [
  { id: 'graphite', name: '经典黑灰', color: '#111827' },
  { id: 'matcha', name: '清新抹茶', color: '#84cc16' },
  { id: 'ocean', name: '深海湛蓝', color: '#0ea5e9' },
  { id: 'peach', name: '蜜桃猛男', color: '#f43f5e' },
  { id: 'lavender', name: '高雅紫罗', color: '#8b5cf6' },
];

export function SettingsTab({ settings, updateSettings, resetData }: SettingsTabProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    updateSettings(localSettings);
    setSaveStatus('保存成功！');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleReset = () => {
    resetData();
    setShowConfirm(false);
    setSaveStatus('已重新做人！');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-6 space-y-6 max-w-lg mx-auto w-full">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-black text-text-main tracking-tight flex items-center justify-center">
          <Settings2 className="mr-2" />
          系统设置
        </h2>
        <p className="text-sm text-text-muted mt-1">骗我可以，别骗自己。</p>
      </div>

      <div className="space-y-4 pb-8">
        {/* Theme Settings */}
        <div className="bg-card-bg p-5 rounded-3xl border border-brand-light shadow-sm space-y-3">
          <label className="flex flex-col">
            <span className="text-sm font-bold text-text-main mb-1 flex items-center">
              <Palette size={16} className="mr-1" />
              主题配色
            </span>
            <span className="text-xs text-text-muted mb-3">换个皮肤，换个心情（主要是为了美观）。</span>
            
            <div className="grid grid-cols-5 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setLocalSettings({...localSettings, theme: theme.id});
                    updateSettings({ theme: theme.id });
                  }}
                  className={`relative flex flex-col items-center p-2 rounded-xl border-2 transition-all ${localSettings.theme === theme.id ? 'border-brand-main bg-brand-light/20 scale-105' : 'border-transparent hover:bg-black/5'}`}
                >
                  <div className="w-8 h-8 rounded-full shadow-sm mb-1" style={{ backgroundColor: theme.color }} />
                  <span className="text-[10px] font-bold text-text-main text-center leading-tight">{theme.name}</span>
                </button>
              ))}
            </div>
          </label>
        </div>

        {/* Daily Limit */}
        <div className="bg-card-bg p-5 rounded-3xl border border-brand-light shadow-sm space-y-3">
          <label className="flex flex-col">
            <span className="text-sm font-bold text-text-main mb-1">每日抽烟上限 (根)</span>
            <span className="text-xs text-text-muted mb-3">设定一个目标，然后努力不去打破它。</span>
            <input 
              type="number" 
              min="0"
              value={localSettings.dailyLimit}
              onChange={e => setLocalSettings({...localSettings, dailyLimit: parseInt(e.target.value) || 0})}
              className="w-full bg-app-bg p-3 rounded-xl border-none focus:ring-2 focus:ring-brand-main outline-none font-bold text-lg text-text-main"
            />
          </label>
        </div>

        {/* Financial Settings */}
        <div className="bg-card-bg p-5 rounded-3xl border border-brand-light shadow-sm space-y-4">
          <div className="flex items-start space-x-2 bg-brand-light/50 text-text-main p-3 rounded-xl mb-2">
            <Info size={18} className="shrink-0 mt-0.5 text-brand-main" />
            <p className="text-xs leading-relaxed font-medium">
              帮你算算抽烟花了多少钱。别怕，看到数字你可能就想戒了。
            </p>
          </div>
          
          <label className="flex flex-col">
            <span className="text-sm font-bold text-text-main mb-1">每包烟价格 (元)</span>
            <input 
              type="number" 
              min="0"
              value={localSettings.pricePerPack}
              onChange={e => setLocalSettings({...localSettings, pricePerPack: parseInt(e.target.value) || 0})}
              className="w-full bg-app-bg p-3 rounded-xl border-none focus:ring-2 focus:ring-brand-main outline-none font-bold text-lg text-text-main"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-bold text-text-main mb-1">每包烟数量 (通常是20根)</span>
            <input 
              type="number" 
              min="1"
              value={localSettings.cigsPerPack}
              onChange={e => setLocalSettings({...localSettings, cigsPerPack: parseInt(e.target.value) || 1})}
              className="w-full bg-app-bg p-3 rounded-xl border-none focus:ring-2 focus:ring-brand-main outline-none font-bold text-lg text-text-main"
            />
          </label>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-brand-dark text-white font-bold text-lg active:scale-95 transition-all shadow-lg shadow-brand-dark/20"
        >
          {saveStatus || '保存设置'}
        </button>

        {/* Danger Zone */}
        <div className="pt-8">
          <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest pl-2 mb-3">危险区域</h3>
          
          {showConfirm ? (
            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <p className="text-sm font-bold text-red-800 mb-3 text-center">要彻底清空所有记录吗？</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 rounded-lg bg-white text-gray-600 font-bold border border-gray-200 active:scale-95 transition-all"
                >手滑了</button>
                <button 
                  onClick={handleReset}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white font-bold active:scale-95 transition-all shadow-red-500/30"
                >确定清空</button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowConfirm(true)}
              className="w-full py-4 rounded-xl border-2 border-red-100 bg-red-50 text-red-600 font-bold flex items-center justify-center hover:bg-red-100 active:scale-95 transition-all"
            >
              <RefreshCw size={18} className="mr-2" />
              清空所有记录重新做人
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
