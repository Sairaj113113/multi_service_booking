import React from 'react'
import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts'

const data = [
  { name: 'Confirmed', value: 65, color: '#22c55e' },
  { name: 'Pending', value: 25, color: '#f59e0b' },
  { name: 'Cancelled', value: 10, color: '#ef4444' },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="glass-card p-3 rounded-lg border border-gold-500/30">
        <p className="text-white font-medium">{data.name}</p>
        <p className="text-gold-400 font-bold text-lg">{data.value}%</p>
      </div>
    )
  }
  return null
}

export const StatusDistributionChart = ({ stats }) => {
  const chartData = stats?.statusData || data

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="glass-card p-6 rounded-2xl border border-white/10"
    >
      <h3 className="font-display text-lg text-white mb-2">Booking Status</h3>
      <p className="text-obsidian-400 text-sm mb-6">Distribution by status</p>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-obsidian-300 text-sm">{item.name}</span>
            <span className="text-white font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
