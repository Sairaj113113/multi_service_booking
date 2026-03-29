import { PageLayout } from "../../components/layout/PageLayout"
import { useEffect, useState } from "react"
import api from "../../api/api"
import { Link } from "react-router-dom"

export default function MyServicesPage() {

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchServices = async () => {
    try {
      const res = await api.get("/api/services")
      const user = JSON.parse(localStorage.getItem("user"))
      const myServices = res.data.filter(s => s.providerId === user.id)
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

  const openDeleteConfirm = (service) => {
    setServiceToDelete(service)
    setConfirmOpen(true)
  }

  const closeDeleteConfirm = () => {
    if (deleting) return
    setConfirmOpen(false)
    setServiceToDelete(null)
  }

  const handleDelete = async () => {
    if (!serviceToDelete) return
    setDeleting(true)

    try {
      await api.delete(`/api/services/${serviceToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      closeDeleteConfirm()
      fetchServices()

    } catch (err) {
      console.error(err)
      alert("Failed to delete service")
    } finally {
      setDeleting(false)
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
        <div className="card-glass mx-auto max-w-2xl p-8 text-center">
          <h3 className="gold-text text-xl">No services yet</h3>
          <p className="mt-2 text-obsidian-400">
            Create your first service to start accepting bookings.
          </p>
        </div>
      ) : (

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {services.map((s) => (
            <div
              key={s.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-obsidian-900/60 backdrop-blur transition hover:shadow-2xl hover:shadow-gold-500/10"
            >

              {/* IMAGE */}
              <div className="relative h-48 w-full overflow-hidden">
                {s.imageUrl ? (
                  <img
                    src={s.imageUrl}
                    alt={s.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-obsidian-500">
                    No image
                  </div>
                )}

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-3">

                <h3 className="text-lg font-semibold text-gold-400">
                  {s.name}
                </h3>

                <p className="text-sm text-obsidian-300 line-clamp-2">
                  {s.description || "No description provided."}
                </p>
                
                <p className="text-xs text-obsidian-400">
                  {s.location || "Location not specified."}
                </p>

                {/* BUTTONS */}
                <div className="flex gap-3 pt-3">   

                  <Link
                    to={`/provider/services/${s.id}/slots`}
                    className="flex-1 text-center rounded-lg border border-gold-500/40 px-4 py-2 text-sm text-gold-300 hover:bg-gold-500/10 transition"
                  >
                    Manage
                  </Link>

                  <button
                    onClick={() => openDeleteConfirm(s)}
                    className="flex-1 rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      )}

      {/* 🔥 MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-obsidian-900 p-6 shadow-2xl">

            <h3 className="text-lg font-semibold text-gold-400">
              Delete service
            </h3>

            <p className="mt-3 text-sm text-obsidian-400">
              This will permanently delete{" "}
              <span className="text-white font-medium">
                {serviceToDelete?.name}
              </span>
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={closeDeleteConfirm}
                className="flex-1 btn-ghost"
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>

          </div>
        </div>
      )}
  
    </PageLayout>
  )
}