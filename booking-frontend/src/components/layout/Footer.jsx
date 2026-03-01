import React from 'react'
import { Link } from 'react-router-dom'
import { GoldDivider } from '../ui/GoldDivider'

export const Footer = () => (
  <footer className="border-t border-white/5 mt-24">
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
            <span className="text-obsidian-950 font-display font-bold text-sm">L</span>
          </div>
          <span className="font-display text-lg font-semibold">
            <span className="gold-text">Luxe</span>
            <span className="text-white">Book</span>
          </span>
        </div>
        <div className="flex items-center gap-8 text-sm text-obsidian-400">
          <Link to="/services" className="hover:text-gold-400 transition-colors">Services</Link>
          <Link to="/login" className="hover:text-gold-400 transition-colors">Sign In</Link>
          <Link to="/register" className="hover:text-gold-400 transition-colors">Register</Link>
        </div>
        <p className="text-obsidian-500 text-sm font-mono">
          © {new Date().getFullYear()} LuxeBook. All rights reserved.
        </p>
      </div>
      <GoldDivider className="mt-8" />
    </div>
  </footer>
)
