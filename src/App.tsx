import { useState } from 'react';
import { Home, LineChart, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType } from './types';
import { useData } from './hooks/useData';
import { HomeTab } from './components/HomeTab';
import { TrendsTab } from './components/TrendsTab';
import { SettingsTab } from './components/SettingsTab';

export default function App() {
  const { records, settings, addRecord, updateSettings, resetData, isLoaded } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  if (!isLoaded) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">加载中...</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab records={records} settings={settings} onAddRecord={addRecord} />;
      case 'trends':
        return <TrendsTab records={records} settings={settings} />;
      case 'settings':
        return <SettingsTab settings={settings} updateSettings={updateSettings} resetData={resetData} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex justify-center font-sans">
      <div className="w-full max-w-md bg-white h-[100dvh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Top Header */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md z-10">
          <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
            抽了么 <span className="ml-2 text-xs font-semibold bg-gray-900 text-white px-2 py-0.5 rounded-md">PRO</span>
          </h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative bg-gray-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav className="border-t border-gray-100 bg-white px-6 py-3 pb-safe z-10 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center">
            <NavItem 
              icon={<Home size={24} />} 
              label="记录" 
              isActive={activeTab === 'home'} 
              onClick={() => setActiveTab('home')} 
            />
            <NavItem 
              icon={<LineChart size={24} />} 
              label="趋势" 
              isActive={activeTab === 'trends'} 
              onClick={() => setActiveTab('trends')} 
            />
            <NavItem 
              icon={<Settings size={24} />} 
              label="设置" 
              isActive={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
          </div>
        </nav>

      </div>
    </div>
  );
}

// NavItem Component
function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-12 relative ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
    >
      <motion.div
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {icon}
      </motion.div>
      <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
      {isActive && (
        <motion.div 
          layoutId="nav-indicator"
          className="absolute -top-3 w-8 h-1 bg-gray-900 rounded-b-full"
        />
      )}
    </button>
  );
}
