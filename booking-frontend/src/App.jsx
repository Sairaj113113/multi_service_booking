import React from "react"
import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute } from "./components/layout/ProtectedRoute"

// 🌐 PUBLIC PAGES
import { LandingPage } from "./pages/LandingPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { ServicesPage } from "./pages/ServicesPage"
import { ServiceDetailPage } from "./pages/ServiceDetailPage"
import { NotFoundPage } from "./pages/NotFoundPage"

// 👤 USER
import { MyBookingsPage } from "./pages/MyBookingsPage"

// 🧑‍💼 PROVIDER PAGES
import ProviderDashboard from "./pages/provider/ProviderDashboard"
import CreateServicePage from "./pages/provider/CreateServicePage"
import MyServicesPage from "./pages/provider/MyServicesPage"
import ManageSlotsPage from "./pages/provider/ManageSlotsPage"

const App = () => (
  <AuthProvider>
    <Routes>

      {/* 🌐 PUBLIC */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />

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

      {/* ❌ 404 */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  </AuthProvider>
)

export default App