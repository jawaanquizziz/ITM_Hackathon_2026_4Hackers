import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';

const areaData = [
  { day: 'Mon', spent: 45, received: 120 },
  { day: 'Tue', spent: 85, received: 50 },
  { day: 'Wed', spent: 60, received: 90 },
  { day: 'Thu', spent: 120, received: 30 },
  { day: 'Fri', spent: 75, received: 180 },
  { day: 'Sat', spent: 95, received: 45 },
  { day: 'Sun', spent: 55, received: 75 },
];

const categoryData = [
  { name: 'Food & Drinks', value: 35, color: '#6366F1' },
  { name: 'Transport', value: 20, color: '#22D3EE' },
  { name: 'Shopping', value: 25, color: '#EC4899' },
  { name: 'Entertainment', value: 15, color: '#10B981' },
  { name: 'Other', value: 5, color: '#F59E0B' },
];

const weeklyData = [
  { week: 'W1', amount: 450 },
  { week: 'W2', amount: 380 },
  { week: 'W3', amount: 520 },
  { week: 'W4', amount: 410 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111118] border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur-xl">
        <p className="text-white/60 text-xs mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: ${entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ExpenseChart() {
  const [view, setView] = useState<'area' | 'bar' | 'pie'>('area');

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2 justify-center">
        {(['area', 'bar', 'pie'] as const).map((v) => (
          <motion.button
            key={v}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView(v)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${view === v
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }
            `}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)} View
          </motion.button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="h-[280px]">
        {view === 'area' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="day"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="#EC4899"
                  strokeWidth={2}
                  fill="url(#colorSpent)"
                  name="Spent"
                />
                <Area
                  type="monotone"
                  dataKey="received"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fill="url(#colorReceived)"
                  name="Received"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {view === 'bar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="week"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="amount"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Spent"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {view === 'pie' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex items-center"
          >
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryData.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white/70 text-sm flex-1">{item.name}</span>
                  <span className="text-white font-medium text-sm">{item.value}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-white/50 text-sm">Total Spent</p>
          <p className="text-xl font-bold text-pink-400">$535.00</p>
        </div>
        <div className="text-center">
          <p className="text-white/50 text-sm">Total Received</p>
          <p className="text-xl font-bold text-emerald-400">$590.00</p>
        </div>
      </div>
    </div>
  );
}