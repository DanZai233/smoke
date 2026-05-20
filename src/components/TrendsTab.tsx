import { useMemo } from 'react';
import { SmokeRecord, UserSettings } from '../types';
import { startOfDay, subDays, format, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TrendsTabProps {
  records: SmokeRecord[];
  settings: UserSettings;
}

export function TrendsTab({ records, settings }: TrendsTabProps) {
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    
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
  }, [records]);

  const totalSmoked = records.reduce((acc, r) => acc + r.count, 0);
  const totalCost = (totalSmoked * (settings.pricePerPack / settings.cigsPerPack)).toFixed(2);
  
  const daysSinceStart = Math.max(1, Math.ceil((Date.now() - settings.startDate) / (1000 * 60 * 60 * 24)));
  const avgPerDay = (totalSmoked / daysSinceStart).toFixed(1);

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-6 space-y-6 max-w-lg mx-auto w-full">
      <div className="text-center">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">吸烟趋势</h2>
        <p className="text-sm text-gray-500 mt-1">看着这些柱子，你的肺在颤抖吗？</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 p-3 rounded-2xl text-center">
          <p className="text-xs text-gray-500 mb-1">总计抽烟</p>
          <p className="text-lg font-black text-gray-900">{totalSmoked}<span className="text-xs text-gray-400 font-normal ml-1">根</span></p>
        </div>
        <div className="bg-gray-50 p-3 rounded-2xl text-center">
          <p className="text-xs text-gray-500 mb-1">日均消耗</p>
          <p className="text-lg font-black text-gray-900">{avgPerDay}<span className="text-xs text-gray-400 font-normal ml-1">根</span></p>
        </div>
        <div className="bg-gray-50 p-3 rounded-2xl text-center">
          <p className="text-xs text-gray-500 mb-1">化作烟雾的钱</p>
          <p className="text-lg font-black text-red-500">¥{totalCost}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mt-4 h-72">
        <h3 className="text-sm font-bold text-gray-700 mb-4">近7天战绩</h3>
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
              fill="#1f2937" 
              radius={[4, 4, 0, 0]} 
              name="抽烟数量"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fun Fact Area */}
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
        <h4 className="text-sm font-bold text-blue-900 mb-2">残酷的真相</h4>
        <p className="text-sm text-blue-800 leading-relaxed">
          你一共抽了 {totalSmoked} 根烟。假设每根烟缩短 11 分钟寿命，你已经成功去掉了 {(totalSmoked * 11 / 60).toFixed(1)} 小时的人生进度条。惊不惊喜，意不意外？
        </p>
      </div>
    </div>
  );
}
