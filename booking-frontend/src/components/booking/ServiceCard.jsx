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
  consulting: '💼',
  education: '📚',
  photography: '📷',
  design: '🎨',
  technology: '💻',
  business: '📊'
}

const getIcon = (name = '') => {
  const lower = name.toLowerCase()
  if (lower.includes('hair') || lower.includes('cut') || lower.includes('salon')) return serviceIcons.hair
  if (lower.includes('spa') || lower.includes('massage') || lower.includes('relax')) return serviceIcons.spa
  if (lower.includes('fit') || lower.includes('gym') || lower.includes('train')) return serviceIcons.fitness
  if (lower.includes('med') || lower.includes('doctor') || lower.includes('health')) return serviceIcons.medical
  if (lower.includes('beauty') || lower.includes('nail') || lower.includes('makeup')) return serviceIcons.beauty
  if (lower.includes('well') || lower.includes('yoga') || lower.includes('mind')) return serviceIcons.wellness
  if (lower.includes('consult') || lower.includes('coach') || lower.includes('advisor')) return serviceIcons.consulting
  if (lower.includes('educat') || lower.includes('learn') || lower.includes('course')) return serviceIcons.education
  if (lower.includes('photo') || lower.includes('camera') || lower.includes('video')) return serviceIcons.photography
  if (lower.includes('design') || lower.includes('creative') || lower.includes('art')) return serviceIcons.design
  if (lower.includes('tech') || lower.includes('software') || lower.includes('app')) return serviceIcons.technology
  if (lower.includes('business') || lower.includes('market') || lower.includes('finance')) return serviceIcons.business
  return serviceIcons.default
}

export const ServiceCard = ({ service, index = 0 }) => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card group cursor-pointer overflow-hidden relative"
      onClick={() => navigate(`/services/${service.id}`)}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/10 to-transparent animate-shimmer" />
      </div>
      
      {/* Card header */}
      <div className="relative h-48 bg-gradient-to-br from-obsidian-800/80 to-obsidian-900/80 flex items-center justify-center overflow-hidden">
        {service.imageUrl ? (
          <>
            <img
              src={service.imageUrl}
              alt={service.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/60 via-obsidian-950/20 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent" />
            {/* Decorative rings */}
            <motion.div 
              className="absolute w-32 h-32 rounded-full border border-gold-500/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute w-20 h-20 rounded-full border border-gold-500/15"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
            <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
              {getIcon(service.name)}
            </span>
          </>
        )}
        
        {/* Gold glare on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category badge */}
        {service.category && (
          <div className="absolute top-3 left-3">
            <span className="status-badge info text-xs">
              {service.category}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl text-white group-hover:text-gold-300 transition-colors duration-200 leading-tight flex-1">
            {service.name}
          </h3>
          <div className="text-right flex-shrink-0">
            <div className="text-gold-400 font-display text-lg font-semibold">
              ${service.price}
            </div>
            <div className="text-obsidian-500 text-xs">
              per session
            </div>
          </div>
        </div>

        <p className="text-obsidian-300 text-sm leading-relaxed line-clamp-3">
          {service.description || 'Premium professional service tailored to your needs. Experience excellence and quality.'}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-obsidian-400 text-sm">
            <svg className="w-4 h-4 text-gold-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{service.durationMinutes} min</span>
          </div>
          
          <div className="flex items-center gap-2 text-obsidian-400 text-sm">
            <svg className="w-4 h-4 text-gold-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-obsidian-200">{service.providerName || 'Professional'}</span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full mt-4 py-3 rounded-xl text-sm font-semibold tracking-wide border border-gold-500/30 text-gold-400 
                   hover:bg-gold-500/10 hover:border-gold-400/60 hover:text-gold-300 transition-all duration-200
                   relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            View Available Slots
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          
          {/* Button shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </motion.button>
      </div>
    </motion.div>
  )
}
