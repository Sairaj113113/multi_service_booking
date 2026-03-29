import api from './api'

// ── Auth ────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login:    (data) => api.post('/api/auth/login', data),
}

// ── Services ────────────────────────────────────────────────────────────────

export const servicesAPI = {
  getAll:  ()     => api.get('/api/services'),
  getById: (id)   => api.get(`/api/services/${id}`),
  create:  (data) => api.post('/api/services', data),
}

// ── Slots ───────────────────────────────────────────────────────────────────

export const slotsAPI = {
  getByService:          (serviceId) => api.get(`/api/slots/service/${serviceId}`),
  getAvailableByService: (serviceId) => api.get(`/api/slots/service/${serviceId}/available`),
  create:                (data)      => api.post('/api/slots', data),
}

// ── Bookings (User) ─────────────────────────────────────────────────────────

export const bookingsAPI = {
  book:          (data) => api.post('/api/bookings', data),
  cancel:        (id)   => api.put(`/api/bookings/${id}/cancel`),
  pay:           (id, data) => api.put(`/api/bookings/${id}/pay`, data),
  getMyBookings: ()     => api.get('/api/bookings/my'),
}

// ── Payments (Razorpay) ─────────────────────────────────────────────────────

export const paymentsAPI = {
  /**
   * Creates a Razorpay order for an existing booking.
   * Safe to call multiple times (retry support) — backend issues a fresh order each time.
   */
  createOrder:   (bookingId) => api.post(`/api/payments/create-order/${bookingId}`),
  verifyPayment: (data)      => api.post('/api/payments/verify', data),
}

// ── Provider Bookings ───────────────────────────────────────────────────────

export const providerBookingAPI = {
  getBookings:     ()   => api.get('/api/provider/bookings'),
  /**
   * Accept a PENDING_PAYMENT booking (used for CASH bookings).
   * Online bookings are auto-accepted via Razorpay payment verification.
   */
  acceptBooking:   (id) => api.put(`/api/provider/bookings/${id}/accept`),
  /**
   * Mark a BOOKED (active) booking as COMPLETED.
   */
  completeBooking: (id) => api.put(`/api/provider/bookings/${id}/complete`),
  cancelBooking:   (id) => api.put(`/api/provider/bookings/${id}/cancel`),
}

// ── Admin ───────────────────────────────────────────────────────────────────

export const adminAPI = {
  getDashboardStats: ()   => api.get('/api/admin/dashboard'),
  getAllUsers:        ()   => api.get('/api/admin/users'),
  getAllBookings:     ()   => api.get('/api/admin/bookings'),
  cancelBooking:     (id) => api.put(`/api/admin/bookings/${id}/cancel`),
  getAllProviders:    ()   => api.get('/api/admin/providers'),
  promoteUser:       (id) => api.put(`/api/admin/users/${id}/promote`),
}

// ── Admin Analytics ─────────────────────────────────────────────────────────

export const adminAnalyticsAPI = {
  getOverview:            () => api.get('/api/admin/analytics/overview'),
  getBookingsTrend:       () => api.get('/api/admin/analytics/bookings-trend'),
  getRevenueTrend:        () => api.get('/api/admin/analytics/revenue-trend'),
  getServiceDistribution: () => api.get('/api/admin/analytics/service-distribution'),
  getProviderPerformance: () => api.get('/api/admin/analytics/provider-performance'),
}

// ── Admin Settings ──────────────────────────────────────────────────────────

export const adminSettingsAPI = {
  getSettings:    ()     => api.get('/api/admin/settings'),
  updateSettings: (data) => api.put('/api/admin/settings', data),
}

// ── Admin Notifications ─────────────────────────────────────────────────────

export const adminNotificationAPI = {
  getNotifications: ()   => api.get('/api/admin/notifications'),
  getUnreadCount:   ()   => api.get('/api/admin/notifications/unread-count'),
  markAsRead:       (id) => api.put(`/api/admin/notifications/${id}/read`),
  markAllAsRead:    ()   => api.put('/api/admin/notifications/read-all'),
}

// ── Users ───────────────────────────────────────────────────────────────────

export const usersAPI = {
  getMe:    ()     => api.get('/api/users/me'),
  updateMe: (data) => api.put('/api/users/me', data),
}