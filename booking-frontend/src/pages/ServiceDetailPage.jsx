import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PageLayout } from '../components/layout/PageLayout'
import { SlotCard } from '../components/booking/SlotCard'
import { SkeletonCard } from '../components/ui/SkeletonCard'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionLabel, GoldDivider } from '../components/ui/GoldDivider'
import { Badge } from '../components/ui/Badge'
import { servicesAPI, slotsAPI, bookingsAPI, paymentsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────
// SUCCESS MODAL
// ─────────────────────────────────────────────────────────────

const BookingSuccessModal = ({ booking, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/70 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className="glass-card p-10 max-w-md w-full text-center relative overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />

      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
        className="w-20 h-20 rounded-full bg-gold-500/20 border-2 border-gold-500 flex items-center justify-center mx-auto mb-6 relative"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl"
        >
          ✓
        </motion.span>
        <motion.div
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="absolute inset-0 rounded-full border-2 border-gold-500"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-display text-3xl mb-2">
          Booking <span className="gold-text italic">Confirmed!</span>
        </h2>
        <p className="text-obsidian-300 text-sm mb-6">
          Your appointment has been successfully booked.
        </p>

        <div className="glass-card p-4 text-left space-y-2 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-obsidian-400">Booking ID</span>
            <span className="text-white font-mono">#{booking?.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-obsidian-400">Status</span>
            <span className="text-emerald-400">
              {booking?.paymentStatus === 'PAID' ? 'Paid' : 'Pay at Venue'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-obsidian-400">Method</span>
            <span className="text-white capitalize">
              {booking?.paymentMethod?.toLowerCase() || '—'}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="flex-1 btn-ghost py-3"
          >
            Stay Here
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              onClose()
              window.location.href = '/my-bookings'
            }}
            className="flex-1 btn-gold py-3"
          >
            My Bookings
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  </motion.div>
)

// ─────────────────────────────────────────────────────────────
// RAZORPAY SCRIPT LOADER (singleton — only loads once)
// ─────────────────────────────────────────────────────────────

let razorpayScriptLoaded = false

const loadRazorpayScript = () => {
  if (razorpayScriptLoaded && window.Razorpay) return Promise.resolve(true)

  return new Promise((resolve) => {
    // Already in DOM from a previous render
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
      razorpayScriptLoaded = true
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      razorpayScriptLoaded = true
      resolve(true)
    }
    script.onerror = () => {
      console.error('Failed to load Razorpay script')
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export const ServiceDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isUser } = useAuth()

  const [service, setService] = useState(null)
  const [slots, setSlots] = useState([])
  const [loadingService, setLoadingService] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookingInProgress, setBookingInProgress] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('CARD')
  const [successBooking, setSuccessBooking] = useState(null)

  // ── Data loading ────────────────────────────────────────────

  useEffect(() => {
    servicesAPI
      .getById(id)
      .then((res) => setService(res.data))
      .catch(() => navigate('/services'))
      .finally(() => setLoadingService(false))

    slotsAPI
      .getAvailableByService(id)
      .then((r) => setSlots(r.data))
      .catch(() => {})
      .finally(() => setLoadingSlots(false))
  }, [id, navigate])

  // Preload Razorpay script in the background as soon as the page loads
  useEffect(() => {
    loadRazorpayScript()
  }, [])

  // ── Slot update helper ──────────────────────────────────────

  const markSlotUnavailable = (slotId) => {
    setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, available: false } : s)))
    setSelectedSlot(null)
  }

  // ── Razorpay checkout opener ────────────────────────────────

  const openRazorpayCheckout = (orderData, bookingId, slotId) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay not loaded'))
        return
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Booking System',
        description: service?.name || 'Service Booking',
        order_id: orderData.orderId,

        handler: async (response) => {
          // Payment success — verify server-side
          try {
            await paymentsAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })

            // Fetch the updated booking to pass into success modal
            const { data: myBookings } = await bookingsAPI.getMyBookings()
            const updated = myBookings.find((b) => b.id === bookingId) || { id: bookingId }

            markSlotUnavailable(slotId)
            resolve(updated)
          } catch (err) {
            reject(new Error('Payment verification failed'))
          }
        },

        modal: {
          // User closed the Razorpay popup — allow retry
          ondismiss: () => {
            toast('Payment cancelled. You can retry anytime.', { icon: '⚠️' })
            resolve(null) // null = user dismissed, not an error
          },
        },

        prefill: {
          name: '',
          email: '',
          contact: '',
        },

        theme: { color: '#f59e0b' },
      }

      const razorpay = new window.Razorpay(options)

      razorpay.on('payment.failed', (response) => {
        console.error('Razorpay payment failed', response.error)
        toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`)
        resolve(null) // allow retry
      })

      razorpay.open()
    })
  }

  // ── Core booking handler ────────────────────────────────────

  const handleBook = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!isUser) { toast.error('Only clients can book slots'); return }
    if (!selectedSlot) { toast.error('Please select a slot'); return }
    if (bookingInProgress) return

    setBookingInProgress(true)

    try {
      if (paymentMethod === 'CASH') {
        // ── CASH FLOW ────────────────────────────────────────
        // Backend creates BOOKED booking + blocks slot immediately
        const { data: created } = await bookingsAPI.book({
          slotId: selectedSlot.id,
          paymentMethod: 'CASH',
        })

        markSlotUnavailable(selectedSlot.id)
        setSuccessBooking(created)

      } else {
        // ── CARD / UPI FLOW ──────────────────────────────────

        // Step 1: Determine if there's already a PENDING_PAYMENT booking for this slot
        //         (from a previous attempt). If so, reuse it instead of creating a new one.
        let bookingId = null
        let slotId = selectedSlot.id

        try {
          const { data: myBookings } = await bookingsAPI.getMyBookings()
          const pendingBooking = myBookings.find(
            (b) => b.slotId === selectedSlot.id && b.status === 'PENDING_PAYMENT',
          )
          if (pendingBooking) {
            bookingId = pendingBooking.id
            toast('Resuming your previous payment attempt.', { icon: '🔄' })
          }
        } catch {
          // non-fatal — will create a fresh booking below
        }

        // Step 2: If no existing pending booking, create one
        if (!bookingId) {
          const { data: created } = await bookingsAPI.book({
            slotId: selectedSlot.id,
            paymentMethod,
          })
          bookingId = created.id
        }

        // Step 3: Ensure Razorpay script is loaded
        const scriptReady = await loadRazorpayScript()
        if (!scriptReady) {
          toast.error('Payment gateway unavailable. Please try again.')
          setBookingInProgress(false)
          return
        }

        // Step 4: Create Razorpay order (backend returns key + orderId)
        let orderData
        try {
          const { data } = await paymentsAPI.createOrder(bookingId)
          orderData = data
        } catch (err) {
          const msg = err.response?.data?.message || 'Failed to initialise payment'
          toast.error(msg)
          setBookingInProgress(false)
          return
        }

        // Step 5: Open Razorpay popup
        // setBookingInProgress(false) here so user can retry if they dismiss
        setBookingInProgress(false)
        const result = await openRazorpayCheckout(orderData, bookingId, slotId)

        if (result) {
          // Verification succeeded
          toast.success('Payment successful!')
          setSuccessBooking(result)
        }
        // result === null means user dismissed or payment failed — already toasted
        return
      }
    } catch (err) {
      // Handle the special PENDING_PAYMENT signal from BookingService
      const message = err.response?.data?.message || err.message || 'Booking failed'

      if (message.startsWith('PENDING_PAYMENT:')) {
        // Extract existing booking ID and jump straight to payment
        const existingId = parseInt(message.split(':')[1], 10)
        toast('You have a pending payment for this slot. Resuming…', { icon: '🔄' })

        try {
          const scriptReady = await loadRazorpayScript()
          if (!scriptReady) {
            toast.error('Payment gateway unavailable. Please try again.')
            return
          }
          const { data: orderData } = await paymentsAPI.createOrder(existingId)
          setBookingInProgress(false)
          const result = await openRazorpayCheckout(orderData, existingId, selectedSlot.id)
          if (result) {
            toast.success('Payment successful!')
            setSuccessBooking(result)
          }
        } catch (retryErr) {
          toast.error('Failed to resume payment. Please try again.')
        }
        return
      }

      toast.error(message)
    } finally {
      setBookingInProgress(false)
    }
  }

  // ── Derived data ────────────────────────────────────────────

  const availableSlots = slots.filter((s) => s.available)

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  return (
    <PageLayout>
      <AnimatePresence>
        {successBooking && (
          <BookingSuccessModal
            booking={successBooking}
            onClose={() => setSuccessBooking(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Header ─────────────────────────────────────────── */}
      <section className="relative py-20 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-obsidian-400 hover:text-gold-400 transition-colors text-sm mb-8"
          >
            ← Back to Services
          </motion.button>

          {loadingService ? (
            <div className="space-y-4">
              <div className="shimmer h-8 rounded-lg bg-obsidian-800/60 w-64" />
              <div className="shimmer h-5 rounded-lg bg-obsidian-800/60 w-96" />
            </div>
          ) : (
            service && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-start gap-6 justify-between"
              >
                <div>
                  <SectionLabel>Service Details</SectionLabel>
                  <h1 className="font-display text-4xl md:text-5xl mt-4 mb-3">{service.name}</h1>
                  <p className="text-obsidian-300 max-w-xl leading-relaxed">
                    {service.description || 'A premium service tailored to your needs.'}
                  </p>

                  {service.location && (
                    <div className="mt-5 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-obsidian-900/50 border border-white/10">
                      <span className="text-sm text-obsidian-400">📍</span>
                      <span className="text-sm text-white">{service.location}</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gold-400 hover:text-gold-300 transition-colors underline underline-offset-2"
                      >
                        Open Maps
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-5 flex-wrap">
                    <Badge label={`${service.durationMinutes} min`} variant="blue" />
                    <Badge label={`by ${service.providerName}`} variant="gray" />
                    <span className="text-gold-400 font-mono text-lg font-semibold">
                      ${service.price}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* ── Slots + Booking Summary ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Slot grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl">
                Available <span className="gold-text">Slots</span>
              </h2>
              {!loadingSlots && (
                <span className="text-obsidian-400 text-sm font-mono">
                  {availableSlots.length}/{slots.length} available
                </span>
              )}
            </div>

            {loadingSlots ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="shimmer h-20 rounded-xl bg-obsidian-800/40" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <EmptyState
                icon="📭"
                title="No Slots Available"
                description="This service has no scheduled slots yet. Check back soon."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slots.map((slot, i) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    selected={selectedSlot?.id === slot.id}
                    onSelect={setSelectedSlot}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Booking summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <h3 className="font-display text-xl mb-4">Booking Summary</h3>
                <GoldDivider className="mb-4" />

                {service && (
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-obsidian-400">Service</span>
                      <span className="text-white">{service.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-obsidian-400">Duration</span>
                      <span className="text-white">{service.durationMinutes} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-obsidian-400">Price</span>
                      <span className="text-gold-400 font-mono font-semibold">${service.price}</span>
                    </div>
                  </div>
                )}

                {/* Selected slot display */}
                <AnimatePresence mode="wait">
                  {selectedSlot ? (
                    <motion.div
                      key="selected"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 mb-4"
                    >
                      <p className="text-gold-300 text-sm font-medium">Selected Slot</p>
                      <p className="text-white text-xs mt-1">
                        {new Date(selectedSlot.startTime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-obsidian-300 text-xs">
                        {new Date(selectedSlot.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' → '}
                        {new Date(selectedSlot.endTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 rounded-xl border border-dashed border-obsidian-700 text-center mb-4"
                    >
                      <p className="text-obsidian-500 text-xs">Select a slot to continue</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Payment method selector */}
                <div className="mb-5">
                  <p className="text-obsidian-400 text-xs mb-2">Payment Method</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['CARD', 'UPI', 'CASH'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`rounded-xl px-3 py-2 text-xs border transition-colors ${
                          paymentMethod === m
                            ? 'border-gold-400/70 bg-gold-500/10 text-gold-300'
                            : 'border-white/10 text-obsidian-300 hover:text-white'
                        }`}
                      >
                        {m === 'CARD' ? '💳 Card' : m === 'UPI' ? '⚡ UPI' : '💵 Cash'}
                      </button>
                    ))}
                  </div>
                  <p className="text-obsidian-500 text-xs mt-2">
                    {paymentMethod === 'CASH'
                      ? 'Pay at the venue after your appointment.'
                      : 'Secure online payment via Razorpay.'}
                  </p>
                </div>

                {/* CTA button */}
                <motion.button
                  whileHover={{ scale: selectedSlot && !bookingInProgress ? 1.02 : 1 }}
                  whileTap={{ scale: selectedSlot && !bookingInProgress ? 0.98 : 1 }}
                  onClick={handleBook}
                  disabled={!selectedSlot || bookingInProgress}
                  className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingInProgress ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-obsidian-800/40 border-t-obsidian-950 animate-spin" />
                      Processing…
                    </>
                  ) : !isAuthenticated ? (
                    'Sign In to Book'
                  ) : paymentMethod === 'CASH' ? (
                    'Confirm Booking'
                  ) : (
                    'Pay & Confirm'
                  )}
                </motion.button>

                {!isAuthenticated && (
                  <p className="text-obsidian-500 text-xs text-center mt-3">
                    You need to{' '}
                    <a
                      href="/login"
                      className="text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      sign in
                    </a>{' '}
                    to book
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}