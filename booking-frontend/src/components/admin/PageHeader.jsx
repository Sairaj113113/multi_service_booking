import React from 'react'
import { motion } from 'framer-motion'

export const PageHeader = ({ title, subtitle, action, icon: Icon }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
            <Icon className="w-6 h-6 text-gold-400" />
          </div>
        )}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-white">{title}</h1>
          {subtitle && (
            <p className="text-obsidian-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      
      {action && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  )
}
