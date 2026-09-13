import axios from 'axios'

/**
 * Centralized Axios instance for all API calls.
 * Base URL is read from the VITE_API_URL environment variable.
 * Never hard-code the API URL — always use this instance.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor ──────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Authentication headers can be added here in a future phase
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'

    // Attach a friendly message to the error for UI consumption
    error.friendlyMessage = message
    return Promise.reject(error)
  }
)

// ── Health ───────────────────────────────────────────────────
export const healthCheck = () => api.get('/health')

// ── Products ─────────────────────────────────────────────────
export const getProducts = (params = {}) => api.get('/products', { params })
export const getProductById = (id) => api.get(`/products/${id}`)
export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)

// ── Jobs ─────────────────────────────────────────────────────
export const getJobs = (params = {}) => api.get('/jobs', { params })
export const getJobById = (id) => api.get(`/jobs/${id}`)
export const createJob = (data) => api.post('/jobs', data)
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data)

// ── Sources ──────────────────────────────────────────────────
export const getSources = () => api.get('/sources')
export const getSourceById = (id) => api.get(`/sources/${id}`)
export const createSource = (data) => api.post('/sources', data)
export const updateSource = (id, data) => api.put(`/sources/${id}`, data)

export default api
