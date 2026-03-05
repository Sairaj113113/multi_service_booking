import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ProtectedRoute } from "./components/layout/ProtectedRoute"

// 🌐 PUBLIC PAGES
import { LandingPage } from "./pages/LandingPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { ServicesPage } from "./pages/ServicesPage"
import { ServiceDetailPage } from "./pages/ServiceDetailPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { ProfilePage } from "./pages/ProfilePage"

// 👤 USER
import { MyBookingsPage } from "./pages/MyBookingsPage"

// 👨‍💼 ADMIN PAGES
import { AdminLayout } from "./pages/admin/AdminLayout"
import { AdminDashboard } from "./pages/admin/AdminDashboard"
import { AdminUsers } from "./pages/admin/AdminUsers"
import { AdminBookings } from "./pages/admin/AdminBookings"
import { AdminProviders } from "./pages/admin/AdminProviders"
import { AdminAnalytics } from "./pages/admin/AdminAnalytics"
import { AdminSettings } from "./pages/admin/AdminSettings"

// 🧑‍💼 PROVIDER PAGES
import ProviderDashboard from "./pages/provider/ProviderDashboard"
import CreateServicePage from "./pages/provider/CreateServicePage"
import MyServicesPage from "./pages/provider/MyServicesPage"
import ManageSlotsPage from "./pages/provider/ManageSlotsPage"
import { ProviderBookings } from "./pages/provider/ProviderBookings"

const App = () => (
  <AuthProvider>
    <Routes>

      {/* 🌐 PUBLIC */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_PROVIDER", "ROLE_ADMIN"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* 👤 USER ROUTES */}
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />

      {/* 🧑‍💼 PROVIDER ROUTES */}
      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRoles={["ROLE_PROVIDER"]}>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/create-service"
        element={
          <ProtectedRoute allowedRoles={["ROLE_PROVIDER"]}>
            <CreateServicePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/services"
        element={
          <ProtectedRoute allowedRoles={["ROLE_PROVIDER"]}>
            <MyServicesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/services/:id/slots"
        element={
          <ProtectedRoute allowedRoles={["ROLE_PROVIDER"]}>
            <ManageSlotsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider/bookings"
        element={
          <ProtectedRoute allowedRoles={["ROLE_PROVIDER"]}>
            <ProviderBookings />
          </ProtectedRoute>
        }
      />

      {/* 👨‍💼 ADMIN ROUTES - Nested under /admin with AdminLayout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="providers" element={<AdminProviders />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* ❌ 404 */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  </AuthProvider>
)

export default App