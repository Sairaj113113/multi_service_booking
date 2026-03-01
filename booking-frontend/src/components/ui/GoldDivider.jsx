import React from 'react'

export const GoldDivider = ({ className = '' }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold-500/40" />
    <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold-500/40" />
  </div>
)

export const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 justify-center">
    <div className="w-8 h-px bg-gold-500/60" />
    <span className="text-gold-400 text-xs font-mono uppercase tracking-[0.3em]">{children}</span>
    <div className="w-8 h-px bg-gold-500/60" />
  </div>
)
