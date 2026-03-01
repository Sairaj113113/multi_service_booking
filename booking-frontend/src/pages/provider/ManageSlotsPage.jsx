import { useParams } from "react-router-dom"
import { useState } from "react"
import api from "../../api/api"

import { PageLayout } from "../../components/layout/PageLayout"

const ManageSlotsPage = () => {

  const { id } = useParams()

  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const createSlot = async () => {

    await api.post("/api/slots", {
      serviceId: id,
      startTime,
      endTime
    },{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })

    alert("Slot created")
  }

  return (
    <PageLayout title="Manage Slots">

      <div className="card-glass mx-auto w-full max-w-3xl p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-obsidian-400">Start time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-obsidian-400">End time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div className="mt-6">
          <button onClick={createSlot} className="btn-gold w-full">
            Create Slot
          </button>
        </div>
      </div>

    </PageLayout>
  )
}

export default ManageSlotsPage      