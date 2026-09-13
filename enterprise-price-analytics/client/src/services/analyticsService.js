import api from './api.js'

export const analyticsService = {
  getPriceHistory: (productId) => api.get(`/analytics/price-history/${productId}`),
}

export default analyticsService
