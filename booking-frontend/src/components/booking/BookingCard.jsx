import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StatusBadge } from '../ui/Badge'
import { bookingsAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'

const formatDateTime = (dt) => {
  const d = new Date(dt)
  return {
    date: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }
}

export const BookingCard = ({ booking, onCancelled }) => {
  const [cancelling, setCancelling] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const start = formatDateTime(booking.slotStartTime)

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await bookingsAPI.cancel(booking.id)
      toast.success('Booking cancelled successfully')
      onCancelled(booking.id)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancelling(false)
      setShowConfirm(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="glass-card p-5 hover:border-gold-500/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-obsidian-800/80 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
            📅
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-white text-base">{booking.serviceName}</h3>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-obsidian-300 text-sm mt-1">{start.date}</p>
            <p className="text-gold-400 text-sm font-mono mt-0.5">{start.time}</p>
            <p className="text-obsidian-500 text-xs mt-1 font-mono">Booking #{booking.id}</p>
          </div>
        </div>

        {booking.status === 'BOOKED' && (
          <div className="flex-shrink-0">
            <AnimatePresence mode="wait">
              {showConfirm ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col gap-2"
                >
                  <p className="text-xs text-obsidian-400 text-center">Cancel booking?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-obsidian-300 hover:text-white transition-colors"
                    >
                      No
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
                    >
                      {cancelling ? '...' : 'Yes, cancel'}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="cancel-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowConfirm(true)}
                  className="px-4 py-2 rounded-xl text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200"
                >
                  Cancel
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}
