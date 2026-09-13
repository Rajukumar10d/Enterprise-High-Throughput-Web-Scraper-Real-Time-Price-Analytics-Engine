import { useCallback, useEffect, useState } from 'react'
import sourceService from '../services/sourceService.js'

export const useSources = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSources = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await sourceService.getSources()
      setData(response.data.data || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load sources.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSources()
  }, [fetchSources])

  return { data, loading, error, refetch: fetchSources }
}

export default useSources
