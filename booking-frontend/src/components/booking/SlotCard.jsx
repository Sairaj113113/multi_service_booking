import React from 'react'
import { motion } from 'framer-motion'

const formatDate = (dt) => {
  const d = new Date(dt)
  return {
    date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }
}

export const SlotCard = ({ slot, selected, onSelect, index = 0 }) => {
  const start = formatDate(slot.startTime)
  const end = formatDate(slot.endTime)
  const isAvailable = slot.available

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={isAvailable ? { scale: 1.02 } : {}}
      onClick={() => isAvailable && onSelect(slot)}
      className={`
        relative p-4 rounded-xl border transition-all duration-200
        ${!isAvailable
          ? 'opacity-40 cursor-not-allowed border-obsidian-700/40 bg-obsidian-800/20'
          : selected
            ? 'cursor-pointer border-gold-500 bg-gold-500/10 shadow-gold'
            : 'cursor-pointer border-white/10 bg-obsidian-800/40 hover:border-gold-500/40 hover:bg-obsidian-800/60'
        }
      `}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center"
        >
          <span className="text-obsidian-950 text-xs font-bold">✓</span>
        </motion.div>
      )}

      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
          selected ? 'bg-gold-500/20' : 'bg-obsidian-700/60'
        }`}>
          🗓
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium ${selected ? 'text-gold-300' : 'text-white'}`}>
            {start.date}
          </p>
          <p className="text-obsidian-400 text-xs mt-0.5">
            {start.time} — {end.time}
          </p>
        </div>
      </div>

      {!isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl">
          <span className="text-xs text-obsidian-500 bg-obsidian-900/80 px-3 py-1 rounded-full border border-obsidian-700/50">
            Unavailable
          </span>
        </div>
      )}
    </motion.div>
  )
}
