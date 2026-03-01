import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'

export const NotFoundPage = () => (
  <PageLayout noFooter>
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-display text-[120px] md:text-[160px] leading-none gold-text font-semibold opacity-30">
            404
          </p>
          <h1 className="font-display text-3xl -mt-6 mb-4">Page Not Found</h1>
          <p className="text-obsidian-400 mb-10">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/" className="btn-gold px-8 py-3 inline-block">Go Home</Link>
            <Link to="/services" className="btn-ghost px-8 py-3 inline-block">Browse Services</Link>
          </div>
        </motion.div>
      </div>
    </div>
  </PageLayout>
)
