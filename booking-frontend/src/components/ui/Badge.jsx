import React from 'react'

const variants = {
  gold: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  gray: 'bg-obsidian-700/60 text-obsidian-300 border-obsidian-600/30',
}

export const Badge = ({ label, variant = 'gold', className = '' }) => (
  <span className={`
    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
    ${variants[variant]} ${className}
  `}>
    {label}
  </span>
)

export const StatusBadge = ({ status }) => {
  const map = {
    PENDING_PAYMENT: { label: 'Pending Payment', variant: 'gold' },
    BOOKED: { label: 'Booked', variant: 'green' },
    CANCELLED: { label: 'Cancelled', variant: 'red' },
    AVAILABLE: { label: 'Available', variant: 'gold' },
    UNAVAILABLE: { label: 'Unavailable', variant: 'gray' },
  }
  const config = map[status] || { label: status, variant: 'gray' }
  return <Badge {...config} />
}
