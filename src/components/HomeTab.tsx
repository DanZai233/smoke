import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SmokeRecord, UserSettings } from '../types';
import { getQuote, getRandomTip } from '../utils/quotes';
import { formatDistanceToNow, isSameDay, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Cigarette, Flame, Wind, Clock, Sparkles, ShieldCheck } from 'lucide-react';

interface HomeTabProps {
  records: SmokeRecord[];
  settings: UserSettings;
  onAddRecord: (count: number, mood?: string, reason?: string, recordType?: 'smoke' | 'resist') => void;
}

const MOODS = ['😌 平静', '😄 开心', '😠 心烦', '😭 焦虑', '🥱 疲惫'];
const REASONS = ['🚬 习惯', '🥱 无聊', '🤝 社交', '🧠 提神', '🍺 喝酒', '😎 装酷'];

export function HomeTab({ records, settings, onAddRecord }: HomeTabProps) {
  const [tip, setTip] = useState(getRandomTip());
  const [showInput, setShowInput] = useState(false);
  const [showBreathe, setShowBreathe] = useState(false);
  const [showResistAnim, setShowResistAnim] = useState(false);
  const [count, setCount] = useState(1);
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

  const todayRecords = records.filter(r => isSameDay(r.timestamp, new Date()));
  const todaySmokeRecords = todayRecords.filter(r => r.recordType !== 'resist');
  const todayResistRecords = todayRecords.filter(r => r.recordType === 'resist');
  const todayCount = todaySmokeRecords.reduce((acc, r) => acc + r.count, 0);
  const resistCount = todayResistRecords.length;
  
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
    onAddRecord(count, selectedMood, selectedReason, 'smoke');
    setShowInput(false);
    setCount(1);
    setSelectedMood(MOODS[0]);
    setSelectedReason(REASONS[0]);
    setTip(getRandomTip()); // change tip on record
  };

  const handleResist = () => {
    onAddRecord(0, undefined, undefined, 'resist');
    setShowResistAnim(true);
    setTimeout(() => setShowResistAnim(false), 2000);
    setTip("好样的！每一次克制，都是更强大的自己。");
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-6 space-y-8 max-w-lg mx-auto w-full pb-20 relative">
      <AnimatePresence>
        {showBreathe && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-card-bg/95 backdrop-blur-md flex flex-col items-center justify-center -mx-4"
          >
            <h2 className="text-2xl font-black text-brand-main mb-2">深呼吸急救</h2>
            <p className="text-sm text-text-muted mb-16 text-center px-8">跟着节奏深呼吸，<br/>冲动通常只持续3-5分钟。</p>
            
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div 
                animate={{ 
                  scale: [1, 2, 2, 1],
                  opacity: [0.3, 0.6, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  times: [0, 0.4, 0.6, 1], // Inhale(4s)-Hold(2s)-Exhale(4s)
                  ease: "easeInOut"
                }}
                className="absolute w-32 h-32 rounded-full bg-brand-main blur-xl flex items-center justify-center"
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.8, 1.8, 1]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  times: [0, 0.4, 0.6, 1],
                  ease: "easeInOut"
                }}
                className="absolute w-32 h-32 rounded-full border border-brand-main opacity-50"
              />
              <div className="z-10 text-brand-dark font-black text-xl bg-card-bg/50 w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg">
                 吸气...
              </div>
            </div>

            <button 
              onClick={() => setShowBreathe(false)}
              className="mt-20 px-8 py-3 rounded-full bg-brand-light text-text-main font-bold hover:bg-black/5 active:scale-95 transition-all"
            >
               我好多了，不抽了
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info */}
      <div className="text-center space-y-2 z-10">
        <h2 className="text-xl font-bold text-text-main">今天战况</h2>
        <div className="text-5xl font-black text-text-main flex items-baseline justify-center">
          <span className={isOverLimit ? 'text-red-500' : 'text-text-main'}>{todayCount}</span>
          <span className="text-2xl text-text-muted font-medium ml-1">/ {settings.dailyLimit} 根</span>
        </div>
        {resistCount > 0 && (
          <div className="mt-2 inline-block bg-brand-main/10 text-brand-main px-3 py-1 rounded-full text-xs font-bold">
            🛡️ 今日成功击退烟瘾 {resistCount} 次
          </div>
        )}
        <p className="text-sm font-medium text-text-muted italic mt-2">
          {getQuote(todayCount, settings.dailyLimit)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-6 bg-brand-light rounded-full overflow-hidden shadow-inner">
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

      {/* Breathing Rescue Trigger */}
      <div className="flex justify-center -mt-2">
         <button onClick={() => setShowBreathe(true)} className="flex items-center space-x-1.5 text-xs font-bold bg-brand-main/10 text-brand-main px-4 py-1.5 rounded-full hover:bg-brand-main/20 active:scale-95 transition-all">
            <Sparkles size={14} />
            <span>实在忍不住？点我急救</span>
         </button>
      </div>

      {/* Action Button */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        <AnimatePresence mode="wait">
          {!showInput ? (
            <motion.div
              key="btn"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-6 w-full"
            >
              <div className="relative">
                  <AnimatePresence>
                      {showResistAnim && (
                          <motion.div
                             initial={{ opacity: 0, y: 0, scale: 0.5 }}
                             animate={{ opacity: 1, y: -80, scale: 1.2 }}
                             exit={{ opacity: 0 }}
                             className="absolute left-1/2 -ml-16 top-0 w-32 text-center text-brand-main font-black text-xl z-50 drop-shadow-md pointer-events-none"
                          >
                             +1 意志力
                          </motion.div>
                      )}
                  </AnimatePresence>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInput(true)}
                    className="w-48 h-48 rounded-full bg-gradient-to-tr from-brand-dark to-brand-main text-white shadow-xl flex flex-col items-center justify-center space-y-2 shadow-brand-dark/20 relative z-10"
                  >
                    <Flame size={48} className="text-orange-400 drop-shadow-md" />
                    <span className="text-2xl font-black tracking-widest">抽了</span>
                  </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResist}
                className="px-8 py-3.5 rounded-full bg-brand-light/50 border-2 border-brand-main/20 text-brand-main font-bold shadow-sm flex items-center space-x-2 active:bg-brand-main/10 transition-colors"
              >
                <ShieldCheck size={20} />
                <span>我忍住了！</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="input-smoke"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card-bg p-5 rounded-3xl shadow-xl w-full border border-brand-light flex flex-col items-center z-20"
            >
              <h3 className="text-lg font-bold mb-4 text-text-main">抽了几根？</h3>
              <div className="flex items-center space-x-6 mb-6">
                <button 
                  onClick={() => setCount(Math.max(1, count - 1))}
                  className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-2xl font-bold text-text-main hover:bg-black/5 active:scale-95 transition-transform"
                >-</button>
                <span className="text-4xl font-black text-text-main w-12 text-center">{count}</span>
                <button 
                  onClick={() => setCount(count + 1)}
                  className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-2xl font-bold text-text-main hover:bg-black/5 active:scale-95 transition-transform"
                >+</button>
              </div>

              <div className="w-full mb-4">
                <p className="text-xs font-bold text-text-muted mb-2 px-1">当前心情</p>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(m => (
                    <button
                      key={m}
                      onClick={() => setSelectedMood(m)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        selectedMood === m 
                          ? 'border-brand-main bg-brand-main/10 text-brand-main' 
                          : 'border-transparent bg-brand-light text-text-muted hover:bg-brand-light/70'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full mb-6">
                <p className="text-xs font-bold text-text-muted mb-2 px-1">抽烟原因</p>
                <div className="flex flex-wrap gap-2">
                  {REASONS.map(r => (
                    <button
                      key={r}
                      onClick={() => setSelectedReason(r)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        selectedReason === r 
                          ? 'border-brand-main bg-brand-main/10 text-brand-main' 
                          : 'border-transparent bg-brand-light text-text-muted hover:bg-brand-light/70'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 w-full mt-auto">
                <button 
                  onClick={() => setShowInput(false)}
                  className="flex-1 py-3 rounded-xl bg-brand-light text-text-main font-bold hover:bg-black/5 active:scale-95 transition-colors"
                >取消</button>
                <button 
                  onClick={handleRecord}
                  className="flex-1 py-3 rounded-xl bg-brand-dark text-white font-bold active:scale-95 transition-colors"
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
            ¥{Math.max(0, (settings.dailyLimit - todayCount) * (settings.pricePerPack / settings.cigsPerPack)).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tip Banner */}
      <div className="bg-card-bg border-2 border-brand-light rounded-2xl p-5 shadow-sm mt-4">
        <div className="flex items-start space-x-3">
          <div className="bg-brand-light/50 p-2 rounded-xl text-brand-main shrink-0">
            <Cigarette size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-main mb-1">戒烟小贴士</h4>
            <p className="text-sm text-text-muted leading-relaxed">{tip}</p>
          </div>
        </div>
      </div>

      {/* Today's Timeline */}
      {todayRecords.length > 0 && (
        <div className="mt-4 pb-4">
          <h4 className="text-sm font-bold text-text-main mb-3 px-1">今日流水账</h4>
          <div className="space-y-2">
            {[...todayRecords]
              .sort((a,b) => b.timestamp - a.timestamp)
              .slice(0, isTimelineExpanded ? undefined : 20)
              .map(r => (
              <div key={r.id} className={`flex items-center justify-between p-3.5 rounded-2xl border ${r.recordType === 'resist' ? 'bg-brand-main/5 border-brand-main/20' : 'bg-card-bg border-brand-light'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${r.recordType === 'resist' ? 'bg-brand-main/10 text-brand-main' : 'bg-brand-light text-text-muted'}`}>
                     {r.recordType === 'resist' ? <ShieldCheck size={18} /> : <Cigarette size={18} />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${r.recordType === 'resist' ? 'text-brand-main' : 'text-text-main'}`}>
                      {r.recordType === 'resist' ? '成功击退烟瘾' : `抽了 ${r.count} 根`}
                    </p>
                    {(r.mood || r.reason) && r.recordType !== 'resist' && (
                      <p className="text-[11px] text-text-muted mt-0.5 font-medium">
                        {r.mood} · {r.reason}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-text-muted font-bold tracking-wider">
                  {format(r.timestamp, 'HH:mm')}
                </span>
              </div>
            ))}
          </div>
          {todayRecords.length > 20 && !isTimelineExpanded && (
            <button
              onClick={() => setIsTimelineExpanded(true)}
              className="w-full mt-3 py-2 text-xs font-bold text-text-muted bg-brand-light/50 rounded-xl hover:bg-brand-light transition-colors"
            >
              展开更多 ({todayRecords.length - 20})
            </button>
          )}
          {todayRecords.length > 20 && isTimelineExpanded && (
            <button
              onClick={() => setIsTimelineExpanded(false)}
              className="w-full mt-3 py-2 text-xs font-bold text-text-muted bg-brand-light/50 rounded-xl hover:bg-brand-light transition-colors"
            >
              收起
            </button>
          )}
        </div>
      )}
    </div>
  );
}
