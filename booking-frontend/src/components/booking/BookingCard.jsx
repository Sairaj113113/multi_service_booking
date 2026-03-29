import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StatusBadge } from '../ui/Badge'
import { bookingsAPI, paymentsAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'

const formatDateTime = (dt) => {
  const d = new Date(dt)
  return {
    date: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const openRazorpayCheckout = async (orderData, bookingId, booking) => {
  const options = {
    key: orderData.key,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'Booking System',
    description: booking.serviceName,
    order_id: orderData.orderId,
    handler: async (response) => {
      try {
        await paymentsAPI.verifyPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        })
        toast.success('Payment successful!')
        window.location.reload()
      } catch (error) {
        toast.error('Payment verification failed')
      }
    },
    modal: {
      ondismiss: () => {
        toast.error('Payment cancelled')
      },
    },
    theme: {
      color: '#f59e0b',
    },
  }

  const razorpay = new window.Razorpay(options)
  razorpay.open()
}

export const BookingCard = ({ booking, onCancelled }) => {
  const [cancelling, setCancelling] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [paying, setPaying] = useState(false)

  const start = formatDateTime(booking.slotStartTime)

  const method = (booking.paymentMethod || '').toUpperCase();

  const handleCancel = async () => {
    setCancelling(true)
    try {
     const bookingId = booking.bookingId || booking.id;

await bookingsAPI.cancel(bookingId)
onCancelled(bookingId)
toast.success('Booking cancelled successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancelling(false)
      setShowConfirm(false)
    }
  }

  const handlePayNow = async () => {
    setPaying(true)
    try {
     const bookingId = booking.bookingId || booking.id;

const { data: orderData } = await paymentsAPI.createOrder(bookingId);

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway')
        setPaying(false)
        return
      }

     await openRazorpayCheckout(orderData, bookingId, booking)
    } catch (error) {
      toast.error('Payment initialization failed')
      setPaying(false)
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
        
        {/* LEFT CONTENT */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-obsidian-800/80 border border-white/10 flex items-center justify-center text-xl">
            📅
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-white text-base">{booking.serviceName}</h3>
              <StatusBadge status={booking.status} />
            </div>

            <p className="text-obsidian-300 text-sm mt-1">{start.date}</p>
            <p className="text-gold-400 text-sm font-mono mt-0.5">{start.time}</p>

            <p className="text-obsidian-500 text-xs mt-1 font-mono">
              Booking #{booking.bookingId || booking.id}
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs text-obsidian-400">
              <span>{booking.paymentMethod}</span>
              <span>•</span>
              <span>{booking.paymentStatus}</span>

              {booking.amount && (
                <>
                  <span>•</span>
                  <span className="text-gold-300 font-mono">
                    {booking.currency || 'USD'} {booking.amount}
                  </span>
                </>
              )}
            </div>

            {/* 📍 LOCATION BUTTON */}
           {/* 📍 LOCATION BUTTON */}
{booking?.location && (
  <div className="mt-3">
    <a
      href={
        booking.location.startsWith("http")
          ? booking.location
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.location)}`
      }
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1.5 rounded-lg shadow hover:scale-105 transition"
    >
      📍 View Location
    </a>
  </div>
)}
            
          </div>
        </div>


        {/* RIGHT ACTIONS */}
        <div className="flex flex-col gap-2">

         {/* PAY BUTTON */}
{booking.status === 'PENDING_PAYMENT' && 
 (method === 'UPI' || method === 'CARD') && (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={handlePayNow}
    disabled={paying}
    className="px-4 py-2 rounded-xl text-xs border border-gold-500/40 text-gold-300 hover:bg-gold-500/10 transition-all"
  >
    {paying ? 'Processing...' : 'Pay Now'}
  </motion.button>
)}

          {/* CANCEL BUTTON */}
          {booking.status !== 'CANCELLED' && (
  <AnimatePresence mode="wait">
    {showConfirm ? (
      <motion.div className="flex flex-col gap-2">
        <p className="text-xs text-obsidian-400 text-center">Cancel?</p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfirm(false)}
            className="px-3 py-1 text-xs border border-white/10"
          >
            No
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-xs bg-red-500/20 text-red-400"
          >
            Yes
          </button>
        </div>
      </motion.div>
    ) : (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowConfirm(true)}
        className="px-4 py-2 rounded-xl text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10"
      >
        Cancel
      </motion.button>
    )}
  </AnimatePresence>
)}
        </div>

      </div>
    </motion.div>
  )
}