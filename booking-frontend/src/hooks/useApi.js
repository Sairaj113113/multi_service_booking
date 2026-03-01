import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (apiCall, options = {}) => {
    const { onSuccess, onError, successMessage, showErrorToast = true } = options
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall()
      if (successMessage) toast.success(successMessage)
      if (onSuccess) onSuccess(result.data)
      return result.data
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong'
      setError(message)
      if (showErrorToast) toast.error(message)
      if (onError) onError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, execute }
}

export const useFetch = (apiCall, deps = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall()
      setData(result.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, deps)  // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: fetch }
}
