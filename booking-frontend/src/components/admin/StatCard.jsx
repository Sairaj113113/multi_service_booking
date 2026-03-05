import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const AnimatedNumber = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(value) || 0
    const incrementTime = (duration * 1000) / end
    
    if (end === 0) {
      setCount(0)
      return
    }

    const timer = setInterval(() => {
      start += Math.ceil(end / 50)
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, duration * 20)

    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}

export const StatCard = ({ title, value, icon, delay = 0, trend, trendUp }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ 
      y: -5, 
      boxShadow: '0 25px 50px -12px rgba(245, 158, 11, 0.25)',
      transition: { duration: 0.3 }
    }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500" />
    <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-gold-500/30 transition-all duration-500 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl group-hover:bg-gold-500/20 transition-all duration-700" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-obsidian-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-4xl font-display font-bold gold-text">
            <AnimatedNumber value={value} />
          </p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
              <span>{trendUp ? '↑' : '↓'}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>
        <motion.div 
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 border border-gold-500/20 flex items-center justify-center text-2xl"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
      </div>
    </div>
  </motion.div>
)
