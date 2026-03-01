import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const serviceIcons = {
  default: '✦',
  hair: '✂️',
  spa: '🌿',
  fitness: '⚡',
  medical: '⚕️',
  beauty: '💎',
  wellness: '🌸',
}

const getIcon = (name = '') => {
  const lower = name.toLowerCase()
  if (lower.includes('hair') || lower.includes('cut')) return serviceIcons.hair
  if (lower.includes('spa') || lower.includes('massage')) return serviceIcons.spa
  if (lower.includes('fit') || lower.includes('gym') || lower.includes('train')) return serviceIcons.fitness
  if (lower.includes('med') || lower.includes('doctor') || lower.includes('health')) return serviceIcons.medical
  if (lower.includes('beauty') || lower.includes('nail') || lower.includes('makeup')) return serviceIcons.beauty
  if (lower.includes('well') || lower.includes('yoga') || lower.includes('mind')) return serviceIcons.wellness
  return serviceIcons.default
}

export const ServiceCard = ({ service, index = 0 }) => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="glass-card group cursor-pointer overflow-hidden"
      onClick={() => navigate(`/services/${service.id}`)}
    >
      {/* Card header */}
      <div className="relative h-44 bg-gradient-to-br from-obsidian-800/80 to-obsidian-900/80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent" />
        {/* Decorative rings */}
        <div className="absolute w-32 h-32 rounded-full border border-gold-500/10 animate-spin-slow" />
        <div className="absolute w-20 h-20 rounded-full border border-gold-500/15 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
          {getIcon(service.name)}
        </span>
        {/* Gold glare on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg text-white group-hover:text-gold-300 transition-colors duration-200 leading-tight">
            {service.name}
          </h3>
          <span className="text-gold-400 font-mono text-sm font-medium whitespace-nowrap">
            ${service.price}
          </span>
        </div>

        <p className="text-obsidian-300 text-sm leading-relaxed line-clamp-2">
          {service.description || 'Premium professional service tailored to your needs.'}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-obsidian-400 text-xs">
            <span className="w-4 h-4 text-gold-500/70">⏱</span>
            <span>{service.durationMinutes} min</span>
          </div>
          <div className="flex items-center gap-1 text-obsidian-400 text-xs">
            <span className="text-gold-500/70">by</span>
            <span className="text-obsidian-200">{service.providerName}</span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full mt-2 py-2.5 rounded-xl text-sm font-medium border border-gold-500/30 text-gold-400 
                     hover:bg-gold-500/10 hover:border-gold-400/60 transition-all duration-200"
        >
          View Slots →
        </motion.button>
      </div>
    </motion.div>
  )
}
