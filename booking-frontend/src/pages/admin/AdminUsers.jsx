import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { adminAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'

export const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [promoting, setPromoting] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data } = await adminAPI.getAllUsers()
      setUsers(data)
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handlePromote = async (userId) => {
    setPromoting(userId)
    try {
      await adminAPI.promoteUser(userId)
      toast.success('User promoted to provider successfully')
      loadUsers() // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to promote user')
    } finally {
      setPromoting(null)
    }
  }

  const getRoleBadge = (role) => {
    const styles = {
      ROLE_ADMIN: 'bg-red-500/20 border-red-500/40 text-red-400',
      ROLE_PROVIDER: 'bg-gold-500/20 border-gold-500/40 text-gold-400',
      ROLE_USER: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
    }
    return styles[role] || styles.ROLE_USER
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
        <h2 className="font-display text-xl gold-text">User Management</h2>
        <p className="text-obsidian-400 text-sm">{users.length} total users</p>
      </div>

      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-obsidian-900/50">
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Name</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Email</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Role</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-sm font-medium">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-obsidian-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                      {user.role?.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'ROLE_USER' && (
                      <button
                        onClick={() => handlePromote(user.id)}
                        disabled={promoting === user.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gold-500/20 border border-gold-500/40 text-gold-400 hover:bg-gold-500/30 transition-all disabled:opacity-50"
                      >
                        {promoting === user.id ? 'Promoting...' : 'Promote to Provider'}
                      </button>
                    )}
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
