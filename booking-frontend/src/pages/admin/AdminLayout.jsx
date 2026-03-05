import React, { useState, useEffect, useCallback } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Building2, 
  Search, 
  Bell, 
  LogOut, 
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  Settings,
  BarChart3,
  CheckCheck
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { adminNotificationAPI } from '../../api/endpoints'
import toast from 'react-hot-toast'

// Format relative time
const getRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

// Get notification icon based on type
const getNotificationIcon = (type) => {
  const icons = {
    'USER_REGISTRATION': '👤',
    'NEW_BOOKING': '📅',
    'NEW_SERVICE': '🏢',
    'USER_PROMOTED': '⭐',
    'PAYMENT_COMPLETED': '💰'
  }
  return icons[type] || '📢'
}

// Sidebar Item Component with premium styling
const SidebarItem = ({ to, icon: Icon, label, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
          isActive
            ? 'bg-gold-500/10 text-gold-400'
            : 'text-obsidian-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300 ${
            isActive ? 'bg-gold-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'opacity-0'
          }`} />
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-gold-400' : 'group-hover:text-gold-400'}`} />
          </motion.div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-medium text-sm whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  )
}

// Breadcrumb Component
const Breadcrumb = ({ location }) => {
  const paths = location.pathname.split('/').filter(Boolean)
  
  const getLabel = (path) => {
    const labels = {
      'admin': 'Admin',
      'dashboard': 'Dashboard',
      'users': 'Users',
      'bookings': 'Bookings',
      'providers': 'Providers'
    }
    return labels[path] || path.charAt(0).toUpperCase() + path.slice(1)
  }

  return (
    <nav className="flex items-center gap-2 text-sm">
      <span className="text-obsidian-500">LuxeBook</span>
      {paths.map((path, index) => (
        <React.Fragment key={path}>
          <ChevronRight className="w-4 h-4 text-obsidian-600" />
          <span className={index === paths.length - 1 ? 'text-white font-medium' : 'text-obsidian-400'}>
            {getLabel(path)}
          </span>
        </React.Fragment>
      ))}
    </nav>
  )
}

export const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        adminNotificationAPI.getNotifications(),
        adminNotificationAPI.getUnreadCount()
      ])
      setNotifications(notifRes.data)
      setUnreadCount(countRes.data.count)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }, [])

  // Mark notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await adminNotificationAPI.markAsRead(id)
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      toast.error('Failed to mark notification as read')
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await adminNotificationAPI.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all as read')
    }
  }

  // Initial fetch and auto-refresh every 30 seconds
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Premium Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Left: Logo & Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-obsidian-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold">
                <span className="text-obsidian-950 font-display font-bold text-sm">L</span>
              </div>
              <span className="font-display text-lg font-semibold tracking-wide hidden sm:block">
                <span className="gold-text">Luxe</span>
                <span className="text-white">Book</span>
              </span>
            </div>

            <div className="hidden md:block ml-6 pl-6 border-l border-white/10">
              <Breadcrumb location={location} />
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
              <input
                type="text"
                placeholder="Search users, bookings, providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-obsidian-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500/50 focus:bg-obsidian-900 transition-all"
              />
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gold-400 border border-gold-500/50 rounded-lg hover:bg-gold-500 hover:text-obsidian-950 transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Website</span>
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-obsidian-400 hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-obsidian-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <h3 className="font-medium text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1"
                        >
                          <CheckCheck className="w-3 h-3" />
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-obsidian-500 text-sm">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                            className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                              !notif.isRead ? 'bg-gold-500/5' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white">{notif.message}</p>
                                <p className="text-xs text-obsidian-500 mt-1">{getRelativeTime(notif.createdAt)}</p>
                              </div>
                              {!notif.isRead && (
                                <span className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-white/10">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                <p className="text-xs text-obsidian-500">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
                <span className="text-obsidian-950 font-bold text-sm">
                  {(user?.name || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-obsidian-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar - Desktop */}
        <motion.aside
          initial={false}
          animate={{ width: isCollapsed ? 80 : 280 }}
          className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#0f0f15] border-r border-white/5 z-40"
        >
          <div className="h-full flex flex-col p-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="self-end p-2 text-obsidian-500 hover:text-white transition-colors mb-4"
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </button>

            {/* Admin Badge */}
            <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br from-gold-500/10 to-transparent border border-gold-500/20 ${isCollapsed ? 'px-2' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold flex-shrink-0">
                  <span className="text-obsidian-950 text-xl">👑</span>
                </div>
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <h2 className="font-display text-lg gold-text">Admin</h2>
                      <p className="text-obsidian-500 text-xs">Control Center</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
              <SidebarItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} />
              <SidebarItem to="/admin/users" icon={Users} label="Users" isCollapsed={isCollapsed} />
              <SidebarItem to="/admin/bookings" icon={Calendar} label="Bookings" isCollapsed={isCollapsed} />
              <SidebarItem to="/admin/providers" icon={Building2} label="Providers" isCollapsed={isCollapsed} />
              
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pt-6 pb-2"
                  >
                    <p className="text-xs font-medium text-obsidian-500 uppercase tracking-wider px-4">Analytics</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <SidebarItem to="/admin/analytics" icon={BarChart3} label="Analytics" isCollapsed={isCollapsed} />
              <SidebarItem to="/admin/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} />
            </nav>

            {/* Bottom Status */}
            <div className={`mt-auto p-4 rounded-xl bg-obsidian-900/50 border border-white/5 ${isCollapsed ? 'px-2' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-green-400 text-sm font-medium"
                    >
                      System Online
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -280 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -280 }}
              className="lg:hidden fixed inset-0 z-40"
            >
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
              <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0f0f15] border-r border-white/5 pt-16">
                <div className="p-4 space-y-1">
                  <SidebarItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" isCollapsed={false} />
                  <SidebarItem to="/admin/users" icon={Users} label="Users" isCollapsed={false} />
                  <SidebarItem to="/admin/bookings" icon={Calendar} label="Bookings" isCollapsed={false} />
                  <SidebarItem to="/admin/providers" icon={Building2} label="Providers" isCollapsed={false} />
                  <SidebarItem to="/admin/analytics" icon={BarChart3} label="Analytics" isCollapsed={false} />
                  <SidebarItem to="/admin/settings" icon={Settings} label="Settings" isCollapsed={false} />
                </div>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className={`flex-1 lg:ml-[280px] transition-all duration-300 ${isCollapsed ? 'lg:ml-[80px]' : ''}`}>
          <div className="p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
