import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const isAuthRequest = err.config?.url?.includes("/auth/login")
    if (!isAuthRequest && (err.response?.status === 401 || err.response?.status === 403)) {
      localStorage.removeItem('token')
    }
    return Promise.reject(err)
  }
)

export default api