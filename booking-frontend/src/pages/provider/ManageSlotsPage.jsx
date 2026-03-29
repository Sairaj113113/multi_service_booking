import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import api from "../../api/api"
import { PageLayout } from "../../components/layout/PageLayout"

const ManageSlotsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [slots, setSlots] = useState([])
  const [service, setService] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  // 🔥 LOCAL TIME FORMAT FIX (NO UTC BUG)
  const formatLocal = (date) => {
    const pad = (n) => n.toString().padStart(2, "0")
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  // 🔥 Fetch service
  useEffect(() => {
    api.get(`/api/services/${id}`)
      .then(res => setService(res.data))
  }, [id])

  // 🔥 Recalculate when service loads
  useEffect(() => {
    if (startTime && service?.durationMinutes) {
      const duration = Number(service.durationMinutes)
      const start = new Date(startTime)
      const end = new Date(start.getTime() + duration * 60000)
      setEndTime(formatLocal(end))
    }
  }, [service])

  // 🔥 Fetch slots
  const fetchSlots = () => {
    api.get(`/api/slots/service/${id}`)
      .then(res => setSlots(res.data))
  }

  useEffect(() => {
    fetchSlots()
  }, [id])

  // 🔥 Auto calculate end time
  const handleStartTimeChange = (value) => {
    setStartTime(value)

    if (!value) return

    const duration = Number(service?.durationMinutes || 30)
    const start = new Date(value)
    const end = new Date(start.getTime() + duration * 60000)

    setEndTime(formatLocal(end))
  }

  // 🔥 Create slot
  const createSlot = async (e) => {
    e.preventDefault()

    if (!startTime || !endTime) {
      toast.error("Please select start time")
      return
    }

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Please login again")
      return
    }

    setIsCreating(true)

    try {
      await api.post("/api/slots", {
        serviceId: id,
        startTime,
        endTime
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success("Slot created successfully!")

      setStartTime("")
      setEndTime("")
      fetchSlots()

    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Failed to create slot (Check login/role)")
    } finally {
      setIsCreating(false)
    }
  }

  return (
  <PageLayout>
    <div className="min-h-screen pt-24 pb-16 px-6">

      {/* 🔥 GRID LAYOUT */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

        {/* ================= LEFT SIDE (FORM) ================= */}
        <div className="glass-card p-8 h-fit">

          <h1 className="text-2xl font-bold text-gold-400 mb-6">
            Create Time Slot
          </h1>

          <form onSubmit={createSlot} className="space-y-6">

            {/* START TIME */}
            <div>
              <label className="text-sm text-gold-400">Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className="input-dark w-full mt-2"
                required
              />
            </div>

            {/* END TIME */}
            <div>
              <label className="text-sm text-gold-400">End Time (Auto)</label>
              <input
                type="datetime-local"
                value={endTime}
                readOnly
                className="input-dark w-full mt-2 opacity-70"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/provider/services')}
                className="btn-ghost w-full"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isCreating}
                className="btn-gold w-full"
              >
                {isCreating ? "Creating..." : "Create Slot"}
              </button>
            </div>

          </form>
        </div>

        {/* ================= RIGHT SIDE (SLOTS) ================= */}
        <div className="space-y-4">

          <h2 className="text-2xl font-bold text-white">
            Created Slots
          </h2>

          {slots.length === 0 && (
            <div className="glass-card p-6 text-center text-obsidian-400">
              No slots created yet
            </div>
          )}

          {/* 🔥 SCROLLABLE SLOT LIST */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">

            {slots.map(slot => (
              <div
                key={slot.id}
                className="glass-card p-4 flex justify-between items-center hover:scale-[1.01] transition"
              >

                {/* LEFT INFO */}
                <div>
                  <p className="text-white font-medium">
                    {new Date(slot.startTime).toLocaleString()}
                  </p>
                  <p className="text-obsidian-400 text-sm">
                    → {new Date(slot.endTime).toLocaleString()}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium
                  ${slot.available
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                  }`}>
                  {slot.available ? "Available" : "Booked"}
                </div>

              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  </PageLayout>
)
}

export default ManageSlotsPage