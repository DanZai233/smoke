import { useMemo } from 'react';
import { SmokeRecord, UserSettings } from '../types';
import { subDays, format, isSameDay, startOfMonth, getDaysInMonth, getDay, addDays, isSameMonth } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TrendsTabProps {
  records: SmokeRecord[];
  settings: UserSettings;
}

export function TrendsTab({ records, settings }: TrendsTabProps) {
  const today = useMemo(() => new Date(), []);
  
  const chartData = useMemo(() => {
    const data = [];
    
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayRecords = records.filter(r => isSameDay(r.timestamp, date));
      const count = dayRecords.reduce((acc, r) => acc + r.count, 0);
      
      data.push({
        date: format(date, 'eee', { locale: zhCN }),
        fullDate: format(date, 'MM/dd'),
        count,
      });
    }
    return data;
  }, [records, today]);

  const totalSmoked = records.reduce((acc, r) => acc + r.count, 0);
  const totalCost = (totalSmoked * (settings.pricePerPack / settings.cigsPerPack)).toFixed(2);
  
  const daysSinceStart = Math.max(1, Math.ceil((Date.now() - settings.startDate) / (1000 * 60 * 60 * 24)));
  const avgPerDay = (totalSmoked / daysSinceStart).toFixed(1);

  // Calendar logic
  const monthStart = startOfMonth(today);
  const daysInMonth = getDaysInMonth(today);
  const startDayOfWeek = getDay(monthStart); // 0 = Sun, 1 = Mon ...
  
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null); // empty padding
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = addDays(monthStart, i - 1);
        const dayRecords = records.filter(r => isSameDay(r.timestamp, currentDate));
        const dayCount = dayRecords.reduce((acc, r) => acc + r.count, 0);
        days.push({
            dayNumber: i,
            date: currentDate,
            count: dayCount,
            isToday: isSameDay(today, currentDate)
        });
    }
    return days;
  }, [records, today, monthStart, daysInMonth, startDayOfWeek]);

  const currentMonthRecords = records.filter(r => isSameMonth(r.timestamp, today));
  const monthTotal = currentMonthRecords.reduce((acc, r) => acc + r.count, 0);
  const monthCost = (monthTotal * (settings.pricePerPack / settings.cigsPerPack)).toFixed(2);

  // Parse moods and reasons for current month
  const moodCounts: Record<string, number> = {};
  const reasonCounts: Record<string, number> = {};
  currentMonthRecords.forEach(r => {
    if (r.mood) moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1;
    if (r.reason) reasonCounts[r.reason] = (reasonCounts[r.reason] || 0) + 1;
  });
  
  const topMood = Object.keys(moodCounts).length > 0 ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b) : '暂无';
  const topReason = Object.keys(reasonCounts).length > 0 ? Object.keys(reasonCounts).reduce((a, b) => reasonCounts[a] > reasonCounts[b] ? a : b) : '暂无';

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-6 space-y-6 max-w-lg mx-auto w-full">
      <div className="text-center">
        <h2 className="text-2xl font-black text-text-main tracking-tight">吸烟趋势</h2>
        <p className="text-sm text-text-muted mt-1">看着这些柱子，你的肺在颤抖吗？</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-brand-light/30 p-3 rounded-2xl text-center">
          <p className="text-xs text-text-muted mb-1">总计抽烟</p>
          <p className="text-lg font-black text-text-main">{totalSmoked}<span className="text-xs text-text-muted font-normal ml-1">根</span></p>
        </div>
        <div className="bg-brand-light/30 p-3 rounded-2xl text-center">
          <p className="text-xs text-text-muted mb-1">日均消耗</p>
          <p className="text-lg font-black text-text-main">{avgPerDay}<span className="text-xs text-text-muted font-normal ml-1">根</span></p>
        </div>
        <div className="bg-brand-light/30 p-3 rounded-2xl text-center">
          <p className="text-xs text-text-muted mb-1">化作烟雾的钱</p>
          <p className="text-lg font-black text-red-500">¥{totalCost}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card-bg p-5 rounded-3xl shadow-sm border border-brand-light mt-4 h-72">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-text-main">近7天战绩</h3>
            <span className="text-[10px] font-semibold bg-brand-light text-brand-dark px-2 py-0.5 rounded-full">
                柱子越高，离天堂越近
            </span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9ca3af' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#4b5563', fontWeight: 'bold', marginBottom: '4px' }}
            />
            <ReferenceLine y={settings.dailyLimit} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '上限', fill: '#ef4444', fontSize: 10 }} />
            <Bar 
              dataKey="count" 
              fill="var(--color-brand-main)" 
              radius={[4, 4, 0, 0]} 
              name="抽烟数量"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-brand-light/30 p-4 rounded-3xl border border-brand-light relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-main opacity-5 rounded-full -mr-8 -mt-8" />
            <p className="text-xs text-text-muted mb-1 font-bold">本月抽掉的钱</p>
            <p className="text-2xl font-black text-red-500">¥{monthCost}</p>
            <p className="text-[10px] mt-1 text-text-muted">总计抽了 <span className="font-bold text-text-main">{monthTotal}</span> 根</p>
        </div>
        <div className="bg-brand-light/30 p-4 rounded-3xl border border-brand-light space-y-2 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-brand-dark opacity-5 rounded-full -ml-8 -mb-8" />
            <div>
                <p className="text-[10px] text-text-muted mb-0.5 font-bold">最常因为...</p>
                <p className="text-sm font-bold text-text-main truncate">{topReason}</p>
            </div>
            <div>
                <p className="text-[10px] text-text-muted mb-0.5 font-bold">当时心情是...</p>
                <p className="text-sm font-bold text-text-main truncate">{topMood}</p>
            </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-card-bg p-5 rounded-3xl shadow-sm border border-brand-light mt-4">
        <h3 className="text-sm font-bold text-text-main mb-4 flex items-center justify-between">
            {format(today, 'yyyy年M月', { locale: zhCN })} 抽烟日历
            <span className="text-[10px] font-normal text-text-muted">颜色越深抽得越多</span>
        </h3>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-text-muted py-1">
                    {d}
                </div>
            ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="h-8" />;
                
                let opacity = 0;
                if (day.count > 0) {
                    opacity = Math.max(0.15, Math.min(day.count / settings.dailyLimit, 1));
                }

                return (
                    <div 
                        key={day.dayNumber} 
                        className={`relative h-10 rounded-xl flex items-center justify-center flex-col transition-all border ${
                            day.isToday ? 'border-brand-main shadow-sm' : 'border-transparent'
                        }`}
                        style={{
                           backgroundColor: day.count > 0 ? `color-mix(in srgb, var(--color-brand-main) ${opacity * 100}%, transparent)` : 'var(--color-app-bg)',
                        }}
                    >
                        <span className={`text-xs font-bold ${day.count > 0 && opacity > 0.5 ? 'text-white' : 'text-text-main'}`}>
                            {day.dayNumber}
                        </span>
                        {day.count > 0 && (
                            <span className={`text-[8px] font-black absolute bottom-0.5 ${day.count > 0 && opacity > 0.5 ? 'text-white/80' : 'text-brand-dark/60'}`}>
                                {day.count}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
      </div>

      {/* Fun Fact Area */}
      <div className="bg-brand-light/20 rounded-2xl p-5 border border-brand-light">
        <h4 className="text-sm font-bold text-brand-dark mb-2">残酷的真相</h4>
        <p className="text-sm text-text-main leading-relaxed">
          你一共抽了 {totalSmoked} 根烟。假设每根烟缩短 11 分钟寿命，你已经成功去掉了 {(totalSmoked * 11 / 60).toFixed(1)} 小时的人生进度条。惊不惊喜，意不意外？
        </p>
      </div>
    </div>
  );
}
