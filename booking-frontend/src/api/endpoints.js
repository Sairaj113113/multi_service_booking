import api from './api'

// Auth
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
}

// Services
export const servicesAPI = {
  getAll: () => api.get('/api/services'),
  getById: (id) => api.get(`/api/services/${id}`),
  create: (data) => api.post('/api/services', data),
}

// Slots
export const slotsAPI = {
  getByService: (serviceId) => api.get(`/api/slots/service/${serviceId}`),
  getAvailableByService: (serviceId) => api.get(`/api/slots/service/${serviceId}/available`),
  create: (data) => api.post('/api/slots', data),
}

// Bookings
export const bookingsAPI = {
  book: (data) => api.post('/api/bookings', data),
  cancel: (id) => api.put(`/api/bookings/${id}/cancel`),
  getMyBookings: () => api.get('/api/bookings/my'),
}

// Admin
export const adminAPI = {
  getAllUsers: () => api.get('/api/admin/users'),
}

// Users
export const usersAPI = {
  getMe: () => api.get('/api/users/me'),
  updateMe: (data) => api.put('/api/users/me', data),
}
