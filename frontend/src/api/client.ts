import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_ORCHESTRATOR_URL || 'http://localhost:2021'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('brain_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const legal = err?.response?.data?.legal_required
    if (legal) {
      window.dispatchEvent(new CustomEvent('brain:legal-required'))
    }
    return Promise.reject(err)
  }
)

export default api
