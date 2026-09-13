import { useCallback, useEffect, useState } from 'react'
import jobService from '../services/jobService.js'

export const useJobs = (params = {}) => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await jobService.getJobs(params)
      const payload = response.data
      setData(payload.data || [])
      setPagination(payload.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load jobs.')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  return { data, pagination, loading, error, refetch: fetchJobs }
}

export default useJobs
