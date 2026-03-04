import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { adminAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'

export const AdminProviders = () => {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = async () => {
    try {
      const { data } = await adminAPI.getAllProviders()
      setProviders(data)
    } catch (error) {
      toast.error('Failed to load providers')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-card p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl gold-text">Provider Management</h2>
        <p className="text-obsidian-400 text-sm">{providers.length} total providers</p>
      </div>

      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-obsidian-900/50">
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Name</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Email</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Phone</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Services</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Bookings Handled</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider, index) => (
                <motion.tr
                  key={provider.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-medium">
                        {provider.name?.charAt(0)?.toUpperCase() || 'P'}
                      </div>
                      <span className="text-white font-medium">{provider.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-obsidian-300">{provider.email}</td>
                  <td className="px-6 py-4 text-obsidian-300">{provider.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="text-gold-400 font-medium">{provider.totalServices}</span>
                  </td>
                  <td className="px-6 py-4 text-obsidian-300">
                    {provider.totalBookingsHandled || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-500/20 border-green-500/40 text-green-400">
                      Active
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
