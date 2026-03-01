import { PageLayout } from "../../components/layout/PageLayout"
import { useEffect, useState } from "react"
import api from "../../api/api"
import { Link } from "react-router-dom"

export default function MyServicesPage() {

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ fetch services
  const fetchServices = async () => {
    try {
      const res = await api.get("/api/services")
      
      // 🔐 show ONLY logged-in provider services
      const user = JSON.parse(localStorage.getItem("user"))
      const myServices = res.data.filter(
        s => s.providerId === user.id
      )

      setServices(myServices)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // ✅ DELETE SERVICE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this service?")
    if (!confirmDelete) return

    try {
      await api.delete(`/api/services/${id}`)
      fetchServices() // 🔄 reload list
    } catch (err) {
      console.error(err)
      alert("Failed to delete service")
    }
  }

  if (loading) {
    return (
      <PageLayout title="My Services">
        <p className="text-obsidian-400">Loading...</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="My Services">

      {services.length === 0 ? (
        <p className="text-obsidian-400">No services created yet.</p>
      ) : (

        <div className="grid md:grid-cols-3 gap-6">

          {services.map((s) => (
            <div key={s.id} className="card-glass p-5 flex flex-col justify-between">

              <div>
                <h3 className="gold-text text-lg">{s.name}</h3>
                <p className="text-obsidian-400 text-sm">{s.description}</p>
              </div>

              <div className="mt-4 space-y-2">

                <Link
                  to={`/provider/services/${s.id}/slots`}
                  className="btn-ghost block text-center"
                >
                  Manage Slots
                </Link>

                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-red-400 hover:text-red-500 text-sm w-full"
                >
                  Delete Service
                </button>

              </div>

            </div>
          ))}

        </div>

      )}

    </PageLayout>
  )
}