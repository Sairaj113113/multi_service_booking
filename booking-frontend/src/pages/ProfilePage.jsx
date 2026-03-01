import React, { useEffect, useState } from "react"
import { PageLayout } from "../components/layout/PageLayout"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import { usersAPI } from "../api/endpoints"
import toast from "react-hot-toast"

const emptyProfile = {
  id: null,
  name: "",
  email: "",
  role: "",
  avatarUrl: "",
  phone: "",
  bio: "",
  address: "",
  city: "",
  country: "",
  companyName: "",
  website: "",
  timezone: "",
}

export const ProfilePage = () => {
  const { user, updateUser, isUser, isProvider, isAdmin } = useAuth()
  const [profile, setProfile] = useState(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    usersAPI.getMe()
      .then((res) => {
        setProfile(res.data)
      })
      .catch(() => {
        if (user) setProfile({ ...emptyProfile, ...user })
      })
      .finally(() => setLoading(false))
  }, [user])

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      const { data } = await usersAPI.updateMe({
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        phone: profile.phone,
        bio: profile.bio,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        companyName: profile.companyName,
        website: profile.website,
        timezone: profile.timezone,
      })
      setProfile(data)
      updateUser({ ...user, ...data })
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageLayout title="My Profile">
        <p className="text-obsidian-400">Loading profile...</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="My Profile">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="card-glass p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-obsidian-900/70">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-obsidian-400">
                    No Image
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-obsidian-400">Account</p>
                <h2 className="mt-2 text-2xl font-semibold gold-text">{profile.name}</h2>
                <p className="mt-1 text-obsidian-300 text-sm">{profile.email}</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-obsidian-900/70 px-4 py-3 text-sm text-obsidian-300">
              Role:{" "}
              <span className="text-gold-300">
                {isProvider ? "Service Provider" : isUser ? "Customer" : isAdmin ? "Admin" : "User"}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="card-glass p-6 md:p-8 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm text-obsidian-300">Full Name</label>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="input mt-2"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="text-sm text-obsidian-300">Email</label>
              <input
                value={profile.email}
                className="input mt-2 opacity-70"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-obsidian-300">Avatar URL</label>
            <input
              name="avatarUrl"
              value={profile.avatarUrl}
              onChange={handleChange}
              className="input mt-2"
              placeholder="https://images.example.com/profile.jpg"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm text-obsidian-300">Phone</label>
              <input
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                className="input mt-2"
                placeholder="+1 555 000 000"
              />
            </div>
            <div>
              <label className="text-sm text-obsidian-300">Timezone</label>
              <input
                name="timezone"
                value={profile.timezone || ""}
                onChange={handleChange}
                className="input mt-2"
                placeholder="Asia/Kolkata"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-obsidian-300">Bio</label>
            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              className="input mt-2"
              rows={4}
              placeholder="Write a short professional bio"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="text-sm text-obsidian-300">Address</label>
              <input
                name="address"
                value={profile.address || ""}
                onChange={handleChange}
                className="input mt-2"
                placeholder="Street, building"
              />
            </div>
            <div>
              <label className="text-sm text-obsidian-300">City</label>
              <input
                name="city"
                value={profile.city || ""}
                onChange={handleChange}
                className="input mt-2"
                placeholder="City"
              />
            </div>
            <div>
              <label className="text-sm text-obsidian-300">Country</label>
              <input
                name="country"
                value={profile.country || ""}
                onChange={handleChange}
                className="input mt-2"
                placeholder="Country"
              />
            </div>
          </div>

          {isProvider && (
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm text-obsidian-300">Company / Brand</label>
                <input
                  name="companyName"
                  value={profile.companyName || ""}
                  onChange={handleChange}
                  className="input mt-2"
                  placeholder="Business name"
                />
              </div>
              <div>
                <label className="text-sm text-obsidian-300">Website</label>
                <input
                  name="website"
                  value={profile.website || ""}
                  onChange={handleChange}
                  className="input mt-2"
                  placeholder="https://yourbusiness.com"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="btn-gold px-6 py-2 text-sm disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {isProvider && (
              <Link to="/provider/services" className="btn-ghost px-6 py-2 text-sm">
                My Services
              </Link>
            )}
            {isUser && (
              <Link to="/my-bookings" className="btn-ghost px-6 py-2 text-sm">
                My Bookings
              </Link>
            )}
          </div>
        </form>
      </div>
    </PageLayout>
  )
}
