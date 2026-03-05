import React from 'react'
import { motion } from 'framer-motion'

const topServices = [
  {
    id: 1,
    name: 'Premium Spa Package',
    provider: 'Glow Wellness Center',
    bookings: 156,
    revenue: 12480,
    trend: '+12%'
  },
  {
    id: 2,
    name: 'Executive Hair Styling',
    provider: 'Elite Barbershop',
    bookings: 134,
    revenue: 9380,
    trend: '+8%'
  },
  {
    id: 3,
    name: 'Deep Tissue Massage',
    provider: 'Serenity Spa',
    bookings: 128,
    revenue: 10240,
    trend: '+15%'
  },
  {
    id: 4,
    name: 'Luxury Facial Treatment',
    provider: 'Beauty Haven',
    bookings: 98,
    revenue: 7840,
    trend: '+5%'
  }
]

export const TopServices = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="glass-card p-6 rounded-2xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-lg text-white">Most Popular Services</h3>
          <p className="text-obsidian-400 text-sm">Top performing by bookings</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
          <span className="text-gold-400 text-lg">⭐</span>
        </div>
      </div>

      <div className="space-y-4">
        {topServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-obsidian-950 font-bold text-lg">#{index + 1}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{service.name}</p>
              <p className="text-obsidian-400 text-sm">{service.provider}</p>
            </div>
            
            <div className="text-right flex-shrink-0">
              <p className="text-white font-medium">{service.bookings} bookings</p>
              <p className="text-gold-400 text-sm">${service.revenue.toLocaleString()}</p>
            </div>
            
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                {service.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 py-3 text-gold-400 text-sm font-medium hover:bg-gold-500/10 rounded-xl transition-colors">
        View All Services
      </button>
    </motion.div>
  )
}
