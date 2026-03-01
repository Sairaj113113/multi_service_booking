import React from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export const PageLayout = ({ children, noFooter = false }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-16">
      {children}
    </main>
    {!noFooter && <Footer />}
  </div>
)
