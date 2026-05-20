import { useMemo } from 'react';
import { SmokeRecord, UserSettings } from '../types';
import { HeartPulse, Medal, ShieldAlert, Award, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface HealthTabProps {
  records: SmokeRecord[];
  settings: UserSettings;
}

const ACHIEVEMENTS = [
  { id: 'first_day', name: '首日告捷', desc: '成功戒烟超过24小时', thresholdMinutes: 24 * 60, icon: Medal, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { id: 'three_days', name: '初见成效', desc: '坚持3天，尼古丁排出', thresholdMinutes: 3 * 24 * 60, icon: ShieldAlert, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 'one_week', name: '脱胎换骨', desc: '坚持7天，肺部开始清洁', thresholdMinutes: 7 * 24 * 60, icon: Award, color: 'text-purple-500', bg: 'bg-purple-100' },
];

export function HealthTab({ records, settings }: HealthTabProps) {
  // Get time since last smoke
  const timeSinceLast = useMemo(() => {
    if (records.length === 0) {
      return Date.now() - settings.startDate;
    }
    const sorted = [...records].sort((a, b) => b.timestamp - a.timestamp);
    return Date.now() - sorted[0].timestamp;
  }, [records, settings.startDate]);

  const minutesSince = Math.floor(timeSinceLast / (1000 * 60));
  const hoursSince = Math.floor(minutesSince / 60);
  const daysSince = Math.floor(hoursSince / 24);

  const getFormatTime = () => {
    if (daysSince > 0) return `${daysSince} 天 ${hoursSince % 24} 小时`;
    if (hoursSince > 0) return `${hoursSince} 小时 ${minutesSince % 60} 分钟`;
    return `${minutesSince} 分钟`;
  };

  // Health Timeline Data
  const HEALTH_TIMELINE = [
    { title: '20分钟', desc: '心率和血压降至正常', required: 20 },
    { title: '8小时', desc: '血液含氧量恢复正常', required: 8 * 60 },
    { title: '24小时', desc: '一氧化碳排出体外', required: 24 * 60 },
    { title: '48小时', desc: '味觉和嗅觉开始改善', required: 48 * 60 },
    { title: '72小时', desc: '呼吸变得更轻松', required: 72 * 60 },
    { title: '1个月', desc: '血液循环和肺功能改善', required: 30 * 24 * 60 },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-6 space-y-6 max-w-lg mx-auto w-full pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-black text-text-main tracking-tight flex items-center justify-center">
          <HeartPulse className="mr-2 text-brand-main" />
          健康与成就
        </h2>
        <p className="text-sm text-text-muted mt-1">身体正在努力修复你的过错</p>
      </div>

      {/* Hero Stats */}
      <div className="bg-gradient-to-br from-brand-main to-brand-dark rounded-3xl p-6 text-white shadow-lg shadow-brand-dark/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-4 -translate-y-4">
          <HeartPulse size={120} />
        </div>
        <p className="text-sm font-bold opacity-80 mb-1">距离上次抽烟已过</p>
        <p className="text-3xl font-black mb-4 tracking-tight">{getFormatTime()}</p>
        
        <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
          <Clock size={16} />
          <p className="text-xs font-semibold">坚持住，熬过这一刻就赢了！</p>
        </div>
      </div>

      {/* Achievements Focus */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-text-main px-1">戒烟里程碑</h3>
        <div className="grid gap-3">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = minutesSince >= ach.thresholdMinutes;
            const ProgressIcon = ach.icon;
            return (
              <div key={ach.id} className={`flex items-center p-4 rounded-2xl border transition-all ${isUnlocked ? 'bg-card-bg border-brand-light shadow-sm' : 'bg-app-bg border-transparent opacity-60 grayscale'}`}>
                <div className={`p-3 rounded-xl ${ach.bg} ${ach.color} mr-4`}>
                  <ProgressIcon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-text-main">{ach.name}</h4>
                  <p className="text-xs text-text-muted mt-0.5">{ach.desc}</p>
                </div>
                {isUnlocked && <div className="text-xs font-bold text-brand-main bg-brand-light px-2 py-1 rounded-lg">已解锁</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Health Timeline */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-text-main px-1">健康恢复时间表</h3>
        <div className="bg-card-bg rounded-3xl border border-brand-light p-5 space-y-4">
          {HEALTH_TIMELINE.map((item, i) => {
            const isReached = minutesSince >= item.required;
            let progress = Math.min(100, (minutesSince / item.required) * 100);
            
            return (
              <div key={i} className="relative">
                <div className="flex justify-between text-xs mb-1">
                  <span className={`font-bold ${isReached ? 'text-brand-main' : 'text-text-main'}`}>{item.title}</span>
                  <span className={isReached ? 'text-brand-main opacity-80' : 'text-text-muted'}>
                    {isReached ? '完成修复' : `${progress.toFixed(0)}%`}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted mb-2">{item.desc}</p>
                <div className="h-1.5 w-full bg-app-bg rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full rounded-full ${isReached ? 'bg-brand-main' : 'bg-text-muted/30'}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  );
}
