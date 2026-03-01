import { PageLayout } from "../../components/layout/PageLayout"
import { useState } from "react"
import api from "../../api/api"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function CreateServicePage() {

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: ""
  })

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    if (loading) return
  
    setLoading(true)
  
    try {
      await api.post("/api/services", form, {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      })
      toast.success("Service created")
      navigate("/provider/services")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Create Service">

      <div className="max-w-2xl">

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="text-sm text-obsidian-300">Service Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input mt-2"
              placeholder="Haircut"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-obsidian-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input mt-2"
              placeholder="Professional haircut"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="text-sm text-obsidian-300">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="input mt-2"
              placeholder="25"
              required
            />
          </div>

          {/* DURATION */}
          <div>
            <label className="text-sm text-obsidian-300">Duration (minutes)</label>
            <input
              type="number"
              name="durationMinutes"
              value={form.durationMinutes}
              onChange={handleChange}
              className="input mt-2"
              placeholder="30"  
              required
            />
          </div>

            <button
            className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
            type="submit"
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
                <>
                <div className="w-4 h-4 rounded-full border-2 border-obsidian-800/40 border-t-obsidian-950 animate-spin" />
                Creating service...
              </>
            ) : 'Create Service'}
          </button>  
        </form>
      </div>
    </PageLayout>
  )
}           