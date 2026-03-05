import React from 'react'

export const StatusBadge = ({ status, size = 'md' }) => {
  const styles = {
    // Booking statuses
    CONFIRMED: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      dot: 'bg-green-500'
    },
    PENDING: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      dot: 'bg-yellow-500'
    },
    CANCELLED: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      dot: 'bg-red-500'
    },
    COMPLETED: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      dot: 'bg-blue-500'
    },
    REFUNDED: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      dot: 'bg-purple-500'
    },
    // User/Provider statuses
    ACTIVE: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      dot: 'bg-green-500'
    },
    INACTIVE: {
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/30',
      text: 'text-gray-400',
      dot: 'bg-gray-500'
    },
    SUSPENDED: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      dot: 'bg-red-500'
    },
    // Payment statuses
    PAID: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      dot: 'bg-green-500'
    },
    UNPAID: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      dot: 'bg-red-500'
    },
    // Role badges
    ROLE_ADMIN: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      dot: 'bg-red-500'
    },
    ROLE_PROVIDER: {
      bg: 'bg-gold-500/10',
      border: 'border-gold-500/30',
      text: 'text-gold-400',
      dot: 'bg-gold-500'
    },
    ROLE_USER: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      dot: 'bg-blue-500'
    }
  }

  const style = styles[status?.toUpperCase()] || styles.ACTIVE
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.border} ${style.text} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status?.replace('ROLE_', '').replace('_', ' ')}
    </span>
  )
}
