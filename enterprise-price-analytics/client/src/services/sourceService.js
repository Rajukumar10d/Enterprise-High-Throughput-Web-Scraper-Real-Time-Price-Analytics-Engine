import api from './api.js'

export const sourceService = {
  getSources: () => api.get('/sources'),
  getSourceById: (id) => api.get(`/sources/${id}`),
  createSource: (data) => api.post('/sources', data),
  updateSource: (id, data) => api.put(`/sources/${id}`, data),
}

export default sourceService
