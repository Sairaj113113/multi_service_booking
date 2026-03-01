import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ServicesPage } from './pages/ServicesPage'
import { ServiceDetailPage } from './pages/ServiceDetailPage'
import { MyBookingsPage } from './pages/MyBookingsPage'
import { NotFoundPage } from './pages/NotFoundPage'

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute allowedRoles={['ROLE_USER']}>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </AuthProvider>
)

export default App
