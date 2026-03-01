import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PageLayout } from '../components/layout/PageLayout'
import { ServiceCard } from '../components/booking/ServiceCard'
import { SkeletonCard } from '../components/ui/SkeletonCard'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionLabel } from '../components/ui/GoldDivider'
import { servicesAPI } from '../api/endpoints'

export const ServicesPage = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    servicesAPI.getAll()
      .then(r => setServices(r.data))
      .catch(() => setError('Failed to load services'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative py-24 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-600/4 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SectionLabel>Explore</SectionLabel>
            <h1 className="font-display text-5xl md:text-6xl mt-6 mb-4">
              Our <span className="gold-text italic">Services</span>
            </h1>
            <p className="text-obsidian-300 max-w-xl mx-auto mb-10">
              Browse our curated selection of premium services from verified providers.
            </p>
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian-400">🔍</span>
              <input
                type="text"
                className="input-dark pl-10"
                placeholder="Search services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <EmptyState
            icon="⚠️"
            title="Failed to Load Services"
            description={error}
            action={{ label: 'Retry', onClick: () => window.location.reload() }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔭"
            title={search ? 'No Results Found' : 'No Services Yet'}
            description={search ? `No services match "${search}". Try a different search.` : 'Services will appear here once providers list them.'}
            action={search ? { label: 'Clear Search', onClick: () => setSearch('') } : undefined}
          />
        ) : (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-obsidian-400 text-sm mb-8 font-mono"
            >
              {filtered.length} service{filtered.length !== 1 ? 's' : ''} available
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
            </div>
          </>
        )}
      </section>
    </PageLayout>
  )
}
