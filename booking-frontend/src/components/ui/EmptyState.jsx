import React from 'react'
import { motion } from 'framer-motion'

export const EmptyState = ({ icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-8 text-center"
  >
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-full bg-obsidian-800/80 flex items-center justify-center border border-gold-500/20">
        <span className="text-4xl">{icon}</span>
      </div>
      <div className="absolute inset-0 rounded-full bg-gold-500/10 animate-pulse" />
    </div>
    <h3 className="font-display text-xl text-white mb-2">{title}</h3>
    <p className="text-obsidian-300 text-sm max-w-xs mb-6">{description}</p>
    {action && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={action.onClick}
        className="btn-gold text-sm"
      >
        {action.label}
      </motion.button>
    )}
  </motion.div>
)
