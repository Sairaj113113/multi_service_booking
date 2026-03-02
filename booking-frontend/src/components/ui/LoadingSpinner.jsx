import { motion } from 'framer-motion'

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-2 border-gold-500/30 border-t-gold-400`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <motion.span
          className="text-obsidian-400 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.span>
      )}
    </div>
  )
}

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="w-16 h-16 mx-auto mb-4 relative">
        <div className="absolute inset-0 rounded-full bg-gold-gradient/20 animate-pulse" />
        <motion.div
          className="absolute inset-2 rounded-full bg-gold-gradient"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <h2 className="text-xl font-display gold-text mb-2">LuxeBook</h2>
      <p className="text-obsidian-400 text-sm">Preparing your experience...</p>
    </motion.div>
  </div>
)

export const SkeletonCard = () => (
  <div className="glass-card p-6">
    <div className="space-y-4">
      <div className="loading-skeleton h-4 w-3/4 rounded" />
      <div className="loading-skeleton h-3 w-full rounded" />
      <div className="loading-skeleton h-3 w-5/6 rounded" />
      <div className="flex gap-2 pt-4">
        <div className="loading-skeleton h-8 w-20 rounded-lg" />
        <div className="loading-skeleton h-8 w-16 rounded-lg" />
      </div>
    </div>
  </div>
)
