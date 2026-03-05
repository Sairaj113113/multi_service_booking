import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'
import { Search, Filter, MoreVertical, ChevronLeft, ChevronRight, UserCheck, UserX, Eye, Users } from 'lucide-react'
import { PageHeader } from '../../components/admin/PageHeader'
import { StatusBadge } from '../../components/admin/StatusBadge'

export const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [promoting, setPromoting] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showActions, setShowActions] = useState(null)
  const itemsPerPage = 10

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
      loadUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to promote user')
    } finally {
      setPromoting(null)
      setShowActions(null)
    }
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const stats = {
    total: users.length,
    users: users.filter(u => u.role === 'ROLE_USER').length,
    providers: users.filter(u => u.role === 'ROLE_PROVIDER').length,
    admins: users.filter(u => u.role === 'ROLE_ADMIN').length
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.total, icon: Users, color: 'gold' },
          { label: 'Regular Users', value: stats.users, icon: UserCheck, color: 'blue' },
          { label: 'Providers', value: stats.providers, icon: UserCheck, color: 'green' },
          { label: 'Admins', value: stats.admins, icon: UserCheck, color: 'red' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 rounded-xl border border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-obsidian-400 text-xs">{stat.label}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <PageHeader
        title="User Management"
        subtitle="Manage users, providers, and permissions"
        icon={Users}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-obsidian-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
          >
            <option value="ALL">All Roles</option>
            <option value="ROLE_USER">User</option>
            <option value="ROLE_PROVIDER">Provider</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card border border-white/5 overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-obsidian-900/50">
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">User</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Email</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Role</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Joined</th>
                <th className="text-left px-6 py-4 text-obsidian-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginatedUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-950 font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <span className="text-white font-medium block">{user.name}</span>
                          <span className="text-obsidian-500 text-xs">ID: {user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-obsidian-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.role} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-obsidian-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-obsidian-400" />
                        </button>
                        
                        <AnimatePresence>
                          {showActions === user.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-2 w-48 bg-obsidian-900 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                            >
                              <button
                                onClick={() => { setSelectedUser(user); setShowActions(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Profile
                              </button>
                              {user.role === 'ROLE_USER' && (
                                <button
                                  onClick={() => handlePromote(user.id)}
                                  disabled={promoting === user.id}
                                  className="w-full px-4 py-2 text-left text-sm text-gold-400 hover:bg-white/5 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <UserCheck className="w-4 h-4" />
                                  {promoting === user.id ? 'Promoting...' : 'Promote to Provider'}
                                </button>
                              )}
                              <button
                                onClick={() => { toast.info('Feature coming soon'); setShowActions(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                              >
                                <UserX className="w-4 h-4" />
                                Disable User
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-obsidian-500 mx-auto mb-4" />
            <p className="text-obsidian-400">No users found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-obsidian-400 text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-white text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
