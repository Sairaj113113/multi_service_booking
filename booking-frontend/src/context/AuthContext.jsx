import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api/endpoints'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await authAPI.login(credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setToken(data.token)
    setUser(data)
    toast.success(`Welcome back, ${data.name}!`)
    return data
  }, [])

  const register = useCallback(async (userData) => {
    const { data } = await authAPI.register(userData)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setToken(data.token)
    setUser(data)
    toast.success(`Welcome, ${data.name}!`)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    toast.success('Signed out successfully')
  }, [])

  const isAuthenticated = !!token
  const isUser = user?.role === 'ROLE_USER'
  const isProvider = user?.role === 'ROLE_PROVIDER'
  const isAdmin = user?.role === 'ROLE_ADMIN'

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout,
      isAuthenticated, isUser, isProvider, isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
