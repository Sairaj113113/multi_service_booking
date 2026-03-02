import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import api from "../../api/api"
import { PageLayout } from "../../components/layout/PageLayout"

const ManageSlotsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const createSlot = async (e) => {
    e.preventDefault()
    
    if (!startTime || !endTime) {
      toast.error("Please select both start and end times")
      return
    }
    
    if (new Date(startTime) >= new Date(endTime)) {
      toast.error("End time must be after start time")
      return
    }

    setIsCreating(true)
    
    try {
      await api.post("/api/slots", {
        serviceId: id,
        startTime,
        endTime
      },{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      })
      
      toast.success("Slot created successfully!")
      setStartTime("")
      setEndTime("")
      
      // Navigate back to service management after a short delay
      setTimeout(() => {
        navigate('/provider/services')
      }, 1500)
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create slot")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <PageLayout>
      <div className="min-h-screen pt-24 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="gold-text">Create</span>
              <span className="text-white"> Time Slot</span>
            </h1>
            <p className="text-obsidian-400 text-lg max-w-2xl mx-auto">
              Add availability time slots for your service. Clients can book these slots for appointments.
            </p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 md:p-10"
          >
            <form onSubmit={createSlot} className="space-y-8">
              {/* Time Selection Grid */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* Start Time */}
                <div className="space-y-3">
                  <label className="block text-sm font-body font-medium text-gold-400 tracking-wide">
                    Start Time
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="input-dark w-full"
                      min={new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)}
                      required
                    />
                    <div className="absolute inset-0 rounded-xl shimmer pointer-events-none" />
                  </div>
                  <p className="text-xs text-obsidian-500">
                    Must be at least 1 hour from now
                  </p>
                </div>

                {/* End Time */}
                <div className="space-y-3">
                  <label className="block text-sm font-body font-medium text-gold-400 tracking-wide">
                    End Time
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="input-dark w-full"
                      min={startTime || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                      required
                    />
                    <div className="absolute inset-0 rounded-xl shimmer pointer-events-none" />
                  </div>
                  <p className="text-xs text-obsidian-500">
                    Must be after start time
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/provider/services')}
                  className="btn-ghost flex-1"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isCreating}
                  className="btn-gold flex-1 relative overflow-hidden"
                >
                  {isCreating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    <span>Create Slot</span>
                  )}
                  
                  {!isCreating && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 glass-card p-6 border-l-4 border-gold-500/30"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-gold-gradient/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white mb-2">Pro Tips</h3>
                <ul className="text-sm text-obsidian-400 space-y-1">
                  <li>• Set slots in minimum 30-minute increments</li>
                  <li>• Consider buffer time between appointments</li>
                  <li>• Create multiple slots for recurring availability</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  )
}

export default ManageSlotsPage