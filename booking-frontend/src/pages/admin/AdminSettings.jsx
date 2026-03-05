import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, Loader2 } from 'lucide-react'
import { adminSettingsAPI } from '../../api/endpoints'
import { PageHeader } from '../../components/admin/PageHeader'
import toast from 'react-hot-toast'

export const AdminSettings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    platformName: '',
    supportEmail: '',
    contactPhone: '',
    currency: 'USD',
    timezone: 'UTC',
    bookingDuration: 60,
    maxBookingsPerSlot: 1,
    cancellationHours: 24,
    platformCommission: 10,
    enablePayments: true,
    enableNotifications: true
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data } = await adminSettingsAPI.getSettings()
      setSettings(data)
    } catch (error) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }))
  }

  const validateSettings = () => {
    if (!settings.platformName?.trim()) {
      toast.error('Platform name is required')
      return false
    }
    if (!settings.supportEmail?.trim()) {
      toast.error('Support email is required')
      return false
    }
    if (!settings.supportEmail?.includes('@')) {
      toast.error('Please enter a valid email address')
      return false
    }
    if (settings.bookingDuration < 15 || settings.bookingDuration > 480) {
      toast.error('Booking duration must be between 15 and 480 minutes')
      return false
    }
    if (settings.maxBookingsPerSlot < 1) {
      toast.error('Max bookings per slot must be at least 1')
      return false
    }
    if (settings.cancellationHours < 1) {
      toast.error('Cancellation hours must be at least 1')
      return false
    }
    if (settings.platformCommission < 0 || settings.platformCommission > 100) {
      toast.error('Platform commission must be between 0 and 100')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateSettings()) return
    
    setSaving(true)
    try {
      await adminSettingsAPI.updateSettings(settings)
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Settings"
        subtitle="Configure your booking platform settings"
        icon={Settings}
      />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-card p-6 rounded-xl border border-white/5 space-y-6"
      >
        {/* Platform Info */}
        <div className="space-y-4">
          <h3 className="text-white font-medium text-lg">Platform Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-obsidian-400 text-sm mb-2">Platform Name</label>
              <input
                type="text"
                name="platformName"
                value={settings.platformName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-obsidian-400 text-sm mb-2">Support Email</label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-obsidian-400 text-sm mb-2">Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={settings.contactPhone || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-obsidian-400 text-sm mb-2">Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10"></div>

        {/* Booking Configuration */}
        <div className="space-y-4">
          <h3 className="text-white font-medium text-lg">Booking Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-obsidian-400 text-sm mb-2">Booking Duration (minutes)</label>
              <input
                type="number"
                name="bookingDuration"
                value={settings.bookingDuration}
                onChange={handleChange}
                min="15"
                max="480"
                className="w-full px-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-obsidian-400 text-sm mb-2">Max Bookings Per Slot</label>
              <input
                type="number"
                name="maxBookingsPerSlot"
                value={settings.maxBookingsPerSlot}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-obsidian-400 text-sm mb-2">Cancellation Hours</label>
              <input
                type="number"
                name="cancellationHours"
                value={settings.cancellationHours}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-obsidian-400 text-sm mb-2">Platform Commission (%)</label>
              <input
                type="number"
                name="platformCommission"
                value={settings.platformCommission}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 transition-all"
                required
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10"></div>

        {/* Feature Toggles */}
        <div className="space-y-4">
          <h3 className="text-white font-medium text-lg">Feature Settings</h3>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-12 h-6 rounded-full transition-colors ${settings.enablePayments ? 'bg-gold-500' : 'bg-obsidian-700'}`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.enablePayments ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
              </div>
              <input
                type="checkbox"
                name="enablePayments"
                checked={settings.enablePayments}
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-white text-sm">Enable Payments</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-12 h-6 rounded-full transition-colors ${settings.enableNotifications ? 'bg-gold-500' : 'bg-obsidian-700'}`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.enableNotifications ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
              </div>
              <input
                type="checkbox"
                name="enableNotifications"
                checked={settings.enableNotifications}
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-white text-sm">Enable Notifications</span>
            </label>
          </div>
        </div>

        <div className="border-t border-white/10"></div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gold-gradient text-obsidian-950 font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
