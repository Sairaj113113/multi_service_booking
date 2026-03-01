import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { SectionLabel, GoldDivider } from '../components/ui/GoldDivider'
import { ServiceCard } from '../components/booking/ServiceCard'
import { SkeletonCard } from '../components/ui/SkeletonCard'
import { servicesAPI } from '../api/endpoints'

const testimonials = [
  { name: 'Amara Osei', role: 'Creative Director', text: 'An unparalleled booking experience. Every appointment feels curated and seamless — truly elevated service.', avatar: 'AO' },
  { name: 'Rafael Mendez', role: 'Entrepreneur', text: 'LuxeBook transformed how I manage my time. The interface is as refined as the services themselves.', avatar: 'RM' },
  { name: 'Sophie Laurent', role: 'Wellness Coach', text: 'The attention to detail in every interaction. From booking to the appointment itself — pure elegance.', avatar: 'SL' },
]

const stats = [
  { value: '2,400+', label: 'Appointments Booked' },
  { value: '180+', label: 'Premium Services' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '50+', label: 'Expert Providers' },
]

const HeroOrb = ({ style, className }) => (
  <motion.div
    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: style?.delay || 0 }}
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    style={style}
  />
)

export const LandingPage = () => {
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 200])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    servicesAPI.getAll()
      .then(r => setServices(r.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingServices(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <PageLayout>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax orbs */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
          <HeroOrb className="w-[600px] h-[600px] bg-gold-500/10" style={{ top: '-10%', left: '-10%' }} />
          <HeroOrb className="w-[400px] h-[400px] bg-gold-600/8" style={{ bottom: '10%', right: '-5%', delay: 2 }} />
          <HeroOrb className="w-[300px] h-[300px] bg-gold-400/6" style={{ top: '40%', left: '30%', delay: 4 }} />
        </motion.div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Premium Service Booking</SectionLabel>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 font-display text-6xl md:text-8xl font-semibold leading-none tracking-tight"
          >
            Reserve Your{' '}
            <span className="relative inline-block">
              <span className="gold-text italic">Perfect</span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent origin-left"
              />
            </span>
            <br />
            Moment
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-obsidian-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-body font-light"
          >
            Discover and book premium services from world-class providers. 
            Effortless scheduling, exceptional experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 flex items-center justify-center gap-4 flex-wrap"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/services" className="btn-gold text-base px-10 py-4 inline-block">
                Explore Services
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="btn-ghost text-base px-10 py-4 inline-block">
                Create Account
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-20 flex flex-col items-center gap-2"
          >
            <span className="text-obsidian-500 text-xs font-mono uppercase tracking-widest">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-8 bg-gradient-to-b from-gold-500/60 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-3xl md:text-4xl gold-text font-semibold">{stat.value}</p>
                <p className="text-obsidian-400 text-sm mt-1 font-mono">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES SHOWCASE ──────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <SectionLabel>What We Offer</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl mt-6 mb-4">
            Featured <span className="gold-text italic">Services</span>
          </h2>
          <p className="text-obsidian-300 max-w-lg mx-auto">
            Handpicked premium services from verified providers. 
            Every detail crafted for excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loadingServices
            ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : services.length > 0
              ? services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)
              : (
                <div className="col-span-3 text-center py-12 text-obsidian-400">
                  No services available yet. Check back soon.
                </div>
              )
          }
        </div>

        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link to="/services" className="btn-ghost inline-block">
              View All Services →
            </Link>
          </motion.div>
        )}
      </section>

      {/* ─── FEATURE HIGHLIGHTS ─────────────────────────────────── */}
      <section className="py-24 bg-obsidian-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <SectionLabel>The LuxeBook Difference</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl mt-6">
              Booking, <span className="gold-text italic">Elevated</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Instant Confirmation', desc: 'Real-time availability with immediate booking confirmation. No waiting, no uncertainty.' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Bank-level encryption protects your data. Your bookings, your privacy — always.' },
              { icon: '✦', title: 'Curated Providers', desc: 'Every service provider is vetted and verified. Only the best make it onto LuxeBook.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-8 text-center hover:border-gold-500/20 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl text-white mb-3">{feature.title}</h3>
                <p className="text-obsidian-300 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────────── */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <SectionLabel>Client Stories</SectionLabel>
        <h2 className="font-display text-4xl md:text-5xl mt-6 mb-16">
          What Our <span className="gold-text italic">Clients</span> Say
        </h2>

        <div className="relative h-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-10 absolute inset-0"
            >
              <p className="text-obsidian-200 text-lg md:text-xl font-light italic leading-relaxed mb-8">
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-sm font-mono font-medium">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{testimonials[activeTestimonial].name}</p>
                  <p className="text-obsidian-400 text-xs">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`transition-all duration-300 rounded-full ${
                i === activeTestimonial ? 'w-6 h-2 bg-gold-500' : 'w-2 h-2 bg-obsidian-600 hover:bg-obsidian-400'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
          <SectionLabel>Ready to Begin?</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl mt-6 mb-4">
            Your Next Great<br />
            <span className="gold-text italic">Experience Awaits</span>
          </h2>
          <p className="text-obsidian-300 mb-10 max-w-lg mx-auto">
            Join thousands of discerning clients who trust LuxeBook for their premium service bookings.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="btn-gold text-base px-10 py-4 inline-block">
                Start Booking Today
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/services" className="btn-ghost text-base px-10 py-4 inline-block">
                Browse Services
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </PageLayout>
  )
}
