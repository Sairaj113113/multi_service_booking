import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PageLayout } from '../components/layout/PageLayout'
import { ServiceCard } from '../components/booking/ServiceCard'
import { SkeletonCard } from '../components/ui/SkeletonCard'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionLabel } from '../components/ui/GoldDivider'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { servicesAPI } from '../api/endpoints'
import toast from 'react-hot-toast'

export const ServicesPage = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const response = await servicesAPI.getAll()
      setServices(response.data || [])
      setError(null)
    } catch (err) {
      console.error('Failed to load services:', err)
      setError('Failed to load services. Please try again.')
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSorted = services
    .filter(service => {
      const matchesSearch = 
        service.name?.toLowerCase().includes(search.toLowerCase()) ||
        service.description?.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = filterCategory === 'all' || 
        service.category?.toLowerCase() === filterCategory.toLowerCase()
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0)
        case 'price-high':
          return (b.price || 0) - (a.price || 0)
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '')
      }
    })

  const categories = ['all', ...new Set(services.map(s => s.category).filter(Boolean))]

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-24 px-6 border-b border-white/5 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.08, 0.05] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-600/4 blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.04, 0.06, 0.04] 
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Explore Our</SectionLabel>
            <h1 className="font-display text-5xl md:text-6xl mt-6 mb-4">
              Premium <span className="gold-text italic">Services</span>
            </h1>
            <p className="text-obsidian-300 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
              Discover exceptional services from verified professionals. Book with confidence and elevate your experience.
            </p>
            
            {/* Search and Filters */}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="input-dark pl-12 pr-4 py-4 text-lg"
                  placeholder="Search services, providers, or keywords..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              
              {/* Filter Controls */}
              <div className="flex flex-wrap gap-3 justify-center">
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="input-dark max-w-xs"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="input-dark max-w-xs"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                
                {(search || filterCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearch('')
                      setFilterCategory('all')
                      setSortBy('name')
                    }}
                    className="btn-ghost text-sm"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="space-y-8">
            <div className="flex items-center justify-center">
              <LoadingSpinner size="lg" text="Loading amazing services..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <SkeletonCard />
                </motion.div>
              ))}
            </div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="glass-card max-w-md mx-auto p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Oops!</h3>
              <p className="text-obsidian-400 mb-6">{error}</p>
              <button
                onClick={loadServices}
                className="btn-gold w-full"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        ) : filteredAndSorted.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <EmptyState
              icon={search ? "�" : "📋"}
              title={search ? 'No Results Found' : 'No Services Available'}
              description={
                search 
                  ? `No services match "${search}". Try different keywords or browse categories.`
                  : 'Services will appear here once providers add them to the platform.'
              }
              action={
                search 
                  ? { label: 'Clear Search', onClick: () => setSearch('') }
                  : undefined
              }
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-obsidian-400 font-medium"
              >
                Showing <span className="text-white font-semibold">{filteredAndSorted.length}</span> service{filteredAndSorted.length !== 1 ? 's' : ''}
                {search && ` for "${search}"`}
              </motion.p>
              
              <div className="flex items-center gap-2 text-sm text-obsidian-400">
                <span>Sorted by:</span>
                <span className="text-gold-400 font-medium">
                  {sortBy === 'name' ? 'Name' : 
                   sortBy === 'price-low' ? 'Price (Low to High)' : 
                   'Price (High to Low)'}
                </span>
              </div>
            </div>
            
            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSorted.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ServiceCard service={service} index={index} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </PageLayout>
  )
}

