import React from 'react'
import { motion } from 'framer-motion'

const metrics = [
  {
    id: 1,
    label: 'Total Providers',
    value: '24',
    icon: '🏢',
    progress: 80,
    color: 'gold'
  },
  {
    id: 2,
    label: 'Avg. Booking Value',
    value: '$85',
    icon: '💵',
    progress: 65,
    color: 'green'
  },
  {
    id: 3,
    label: 'Cancellation Rate',
    value: '8.2%',
    icon: '📉',
    progress: 12,
    color: 'red',
    trend: '↓ 2.1%'
  },
  {
    id: 4,
    label: 'Confirmation Rate',
    value: '87.5%',
    icon: '📈',
    progress: 87,
    color: 'green',
    trend: '↑ 5.3%'
  },
  {
    id: 5,
    label: 'Top Category',
    value: 'Spa',
    icon: '✨',
    progress: 92,
    color: 'blue'
  }
]

const getColorClasses = (color) => {
  const colors = {
    gold: 'from-gold-500 to-gold-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600'
  }
  return colors[color] || colors.gold
}

const getProgressColor = (color) => {
  const colors = {
    gold: 'bg-gold-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500'
  }
  return colors[color] || colors.gold
}

export const OverviewMetrics = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="glass-card p-6 rounded-2xl border border-white/10"
    >
      <h3 className="font-display text-lg text-white mb-2">Platform Overview</h3>
      <p className="text-obsidian-400 text-sm mb-6">Key performance indicators</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getColorClasses(metric.color)} bg-opacity-20 flex items-center justify-center text-lg`}>
                {metric.icon}
              </div>
              {metric.trend && (
                <span className={`text-xs font-medium ${metric.trend.includes('↑') ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.trend}
                </span>
              )}
            </div>
            
            <p className="text-obsidian-400 text-xs mb-1">{metric.label}</p>
            <p className="text-xl font-bold text-white mb-3">{metric.value}</p>
            
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.progress}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${getProgressColor(metric.color)}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
