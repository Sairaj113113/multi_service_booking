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

<input
  type="datetime-local"
  value={startTime}
  onChange={(e) => setStartTime(e.target.value)}
  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-400"
/>

<input
  type="datetime-local"
  value={endTime}
  onChange={(e) => setEndTime(e.target.value)}
  className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-400"
/>

      <button onClick={createSlot} className="btn-gold w-full">Create Slot</button>

    </PageLayout>
  )
}

export default ManageSlotsPage