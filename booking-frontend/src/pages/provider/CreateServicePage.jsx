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
    durationMinutes: "",
    location: ""    
  })

  

  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0])
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return
    if (!imageFile) {
      toast.error("Please select an image")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("description", form.description)
      formData.append("price", form.price)
      formData.append("durationMinutes", form.durationMinutes)
      formData.append("image", imageFile)
      formData.append("location", form.location)
      
      await api.post("/api/services", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      })

      toast.success("Service created 🚀")
      navigate("/provider/services")

    } catch (err) {
      toast.error("Failed to create service")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Create Service">

      {/* 🔥 MAIN GRID */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* ================= LEFT (FORM) ================= */}
        <form onSubmit={handleSubmit} className="card-glass space-y-6 p-8">

          <h2 className="text-2xl font-semibold text-gold-400">
            Create Service
          </h2>

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
              rows={4}
              placeholder="Professional haircut"
            />
          </div>

          <div>
  <label className="text-sm text-obsidian-300">Location</label>
  <input
    name="location"
    value={form.location}
    onChange={handleChange}
    className="input mt-2"
    placeholder="Hyderabad, Madhapur"
    required
  />
</div>

          {/* IMAGE */}
          <div>
            <label className="text-sm text-obsidian-300">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input mt-2"
              required
            />

            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                className="mt-3 rounded-lg w-32 h-32 object-cover border border-white/10"
              />
            )}
          </div>

          {/* PRICE + DURATION */}
          <div className="grid gap-5 md:grid-cols-2">
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

            <div>
              <label className="text-sm text-obsidian-300">Duration</label>
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
          </div>

          {/* BUTTON */}
          <button
            className="btn-gold w-full flex items-center justify-center gap-2 text-lg"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-obsidian-800/40 border-t-obsidian-950 animate-spin" />
                Creating...
              </>
            ) : 'Create Service'}     
          </button>

        </form>

        {/* ================= RIGHT (LIVE PREVIEW) ================= */}
        <div className="card-glass p-6">

          <h3 className="text-lg text-white mb-4">
            Live Preview
          </h3>

          <div className="rounded-xl overflow-hidden border border-white/10">

            {/* IMAGE */}
            <div className="h-48 bg-obsidian-900 flex items-center justify-center">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-obsidian-500 text-sm">
                  Image Preview
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-2">

              <h3 className="text-gold-400 font-semibold text-lg">
                {form.name || "Service Name"}
              </h3>

              <p className="text-sm text-obsidian-300">
                {form.description || "Service description"}
              </p>

              <div className="flex justify-between text-sm pt-2">
                <span className="text-white">
                  ₹{form.price || "0"}
                </span>
                <span className="text-obsidian-400">
                  {form.durationMinutes || "0"} mins
                </span>
              </div>

            </div>
          </div>
        </div>
              
      </div>


    </PageLayout>
  )
}