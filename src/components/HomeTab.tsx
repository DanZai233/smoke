import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SmokeRecord, UserSettings } from '../types';
import { getQuote, getRandomTip } from '../utils/quotes';
import { formatDistanceToNow, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Cigarette, Flame, Wind, Clock } from 'lucide-react';

interface HomeTabProps {
  records: SmokeRecord[];
  settings: UserSettings;
  onAddRecord: (count: number) => void;
}

export function HomeTab({ records, settings, onAddRecord }: HomeTabProps) {
  const [tip, setTip] = useState(getRandomTip());
  const [showInput, setShowInput] = useState(false);
  const [count, setCount] = useState(1);

  const todayRecords = records.filter(r => isSameDay(r.timestamp, new Date()));
  const todayCount = todayRecords.reduce((acc, r) => acc + r.count, 0);
  
  const lastRecord = records.length > 0 ? records[records.length - 1] : null;
  const timeSinceLast = lastRecord 
    ? formatDistanceToNow(lastRecord.timestamp, { locale: zhCN, addSuffix: true }) 
    : '很久以前';

  const progress = Math.min((todayCount / settings.dailyLimit) * 100, 100);
  const isOverLimit = todayCount >= settings.dailyLimit;

  // Update tip occasionally
  useEffect(() => {
    const interval = setInterval(() => setTip(getRandomTip()), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRecord = () => {
    onAddRecord(count);
    setShowInput(false);
    setCount(1);
    setTip(getRandomTip()); // change tip on record
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-6 space-y-8 max-w-lg mx-auto w-full">
      
      {/* Header Info */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-800">今天战况</h2>
        <div className="text-5xl font-black text-gray-900 flex items-baseline justify-center">
          <span className={isOverLimit ? 'text-red-500' : 'text-gray-900'}>{todayCount}</span>
          <span className="text-2xl text-gray-400 font-medium ml-1">/ {settings.dailyLimit} 根</span>
        </div>
        <p className="text-sm font-medium text-gray-500 italic mt-2">
          {getQuote(todayCount, settings.dailyLimit)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`absolute top-0 left-0 h-full rounded-full ${
            isOverLimit ? 'bg-red-500' : progress > 80 ? 'bg-orange-400' : 'bg-emerald-400'
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4 relative">
        <AnimatePresence mode="wait">
          {!showInput ? (
            <motion.button
              key="btn-smoke"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInput(true)}
              className="w-48 h-48 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 text-white shadow-xl flex flex-col items-center justify-center space-y-2 shadow-gray-400/50"
            >
              <Flame size={48} className="text-orange-400 drop-shadow-md" />
              <span className="text-2xl font-black tracking-widest">抽了</span>
            </motion.button>
          ) : (
            <motion.div
              key="input-smoke"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-3xl shadow-xl w-full border border-gray-100 flex flex-col items-center"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-700">抽了几根？</h3>
              <div className="flex items-center space-x-6 mb-6">
                <button 
                  onClick={() => setCount(Math.max(1, count - 1))}
                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600 hover:bg-gray-200 active:scale-95 transition-transform"
                >-</button>
                <span className="text-4xl font-black text-gray-800 w-12 text-center">{count}</span>
                <button 
                  onClick={() => setCount(count + 1)}
                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600 hover:bg-gray-200 active:scale-95 transition-transform"
                >+</button>
              </div>
              <div className="flex space-x-3 w-full">
                <button 
                  onClick={() => setShowInput(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 active:scale-95 transition-colors"
                >取消</button>
                <button 
                  onClick={handleRecord}
                  className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-bold hover:bg-gray-700 active:scale-95 transition-colors"
                >确认</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 p-4 rounded-3xl flex flex-col items-center justify-center text-center space-y-1">
          <Clock size={24} className="text-orange-400 mb-1" />
          <p className="text-xs text-orange-800 font-medium opacity-80">上次抽烟</p>
          <p className="text-sm font-bold text-orange-900">{timeSinceLast}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-3xl flex flex-col items-center justify-center text-center space-y-1">
          <Wind size={24} className="text-emerald-500 mb-1" />
          <p className="text-xs text-emerald-800 font-medium opacity-80">今日省钱</p>
          <p className="text-sm font-bold text-emerald-900">
            ¥{Math.max(0, ((settings.dailyLimit - todayCount) * (settings.pricePerPack / settings.cigsPerPack)).toFixed(2))}
          </p>
        </div>
      </div>

      {/* Tip Banner */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm mt-4">
        <div className="flex items-start space-x-3">
          <div className="bg-indigo-100 p-2 rounded-xl text-indigo-500 shrink-0">
            <Cigarette size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-1">戒烟小贴士</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
