import React from 'react'
import { motion } from 'framer-motion'

const activities = [
  {
    id: 1,
    type: 'booking',
    title: 'New booking confirmed',
    description: 'John Doe booked Premium Haircut with Style Studio',
    time: '2 minutes ago',
    icon: '📅',
    color: 'green'
  },
  {
    id: 2,
    type: 'user',
    title: 'New user registered',
    description: 'Sarah Smith joined the platform',
    time: '15 minutes ago',
    icon: '👤',
    color: 'blue'
  },
  {
    id: 3,
    type: 'provider',
    title: 'Provider approved',
    description: 'Glow Spa verified and approved as new provider',
    time: '1 hour ago',
    icon: '✅',
    color: 'gold'
  },
  {
    id: 4,
    type: 'payment',
    title: 'Payment received',
    description: '$129 payment received for booking #1234',
    time: '2 hours ago',
    icon: '💰',
    color: 'green'
  },
  {
    id: 5,
    type: 'booking',
    title: 'Booking cancelled',
    description: 'User cancelled Deep Tissue Massage appointment',
    time: '3 hours ago',
    icon: '❌',
    color: 'red'
  }
]

const getColorClass = (color) => {
  const colors = {
    green: 'bg-green-500/20 border-green-500/30 text-green-400',
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    gold: 'bg-gold-500/20 border-gold-500/30 text-gold-400',
    red: 'bg-red-500/20 border-red-500/30 text-red-400'
  }
  return colors[color] || colors.gold
}

export const ActivityFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="glass-card p-6 rounded-2xl border border-white/10 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-lg text-white">Recent Activity</h3>
          <p className="text-obsidian-400 text-sm">Latest platform events</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
          <span className="text-gold-400 text-lg">🔔</span>
        </div>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
            className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg flex-shrink-0 ${getColorClass(activity.color)}`}>
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">{activity.title}</p>
              <p className="text-obsidian-400 text-sm mt-1 truncate">{activity.description}</p>
              <p className="text-obsidian-500 text-xs mt-2">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 py-3 text-gold-400 text-sm font-medium hover:bg-gold-500/10 rounded-xl transition-colors">
        View All Activity
      </button>
    </motion.div>
  )
}
