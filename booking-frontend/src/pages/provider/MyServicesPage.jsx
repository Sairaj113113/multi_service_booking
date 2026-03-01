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
      await api.delete(`/api/services/${serviceToDelete.id}`)
      closeDeleteConfirm()
      fetchServices() // 🔄 reload list
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
        <div className="card-glass mx-auto max-w-2xl p-6 text-center">
          <h3 className="gold-text text-lg">No services yet</h3>
          <p className="mt-2 text-obsidian-400 text-sm">
            Create your first service to start accepting bookings.
          </p>
        </div>
      ) : (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {services.map((s) => (
            <div
              key={s.id}
              className="card-glass flex h-full flex-col justify-between p-5"
            >

              <div>
                <div className="mb-4 h-36 w-full overflow-hidden rounded-xl border border-white/10 bg-obsidian-900/70">
                  {s.imageUrl ? (
                    <img
                      src={s.imageUrl}
                      alt={s.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-obsidian-500">
                      No image
                    </div>
                  )}
                </div>
                <h3 className="gold-text text-lg">{s.name}</h3>
                <p className="mt-2 text-obsidian-300 text-sm">
                  {s.description || "No description provided."}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2">

                <Link
                  to={`/provider/services/${s.id}/slots`}
                  className="btn-ghost flex-1 text-center"
                >
                  Manage Slots
                </Link>

                <button
                  onClick={() => openDeleteConfirm(s)}
                  className="flex-1 rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200"
                >
                  Delete Service
                </button>

              </div>

            </div>
          ))}

        </div>

      )}

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-service-title"
        >
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-obsidian-900 p-6 shadow-2xl">
            <h3 id="delete-service-title" className="gold-text text-lg">
              Delete service
            </h3>
            <p className="mt-2 text-obsidian-400 text-sm">
              This will permanently delete{" "}
              <span className="text-obsidian-200">
                {serviceToDelete?.name || "this service"}
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={closeDeleteConfirm}
                className="btn-ghost w-full"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
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