import { useCallback, useEffect, useState } from 'react'
import productService from '../services/productService.js'

export const useProducts = (params = {}, options = {}) => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await productService.getProducts(params)
      const payload = response.data
      setData(payload.data || [])
      setPagination(payload.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load products.')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { data, pagination, loading, error, refetch: fetchProducts }
}

export default useProducts
