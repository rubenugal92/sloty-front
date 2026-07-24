import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ===================== INTERCEPTOR =====================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ===================== AUTH =====================
export const login = async (email, password) => {
  const { data } = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password
  })

  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))

  return data
}

export const register = async (username, name, email, password, specialities, phone, type) => {
  const { data } = await axios.post(`${API_BASE_URL}/auth/register`, {
    username,
    name,
    email,
    password,
    specialities,
    phone,
    type  
  })

  return data
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getToken = () => localStorage.getItem('token')

export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const isAuthenticated = () => !!getToken()

// ===================== APPOINTMENTS =====================

export const getAllAppointments = async (companyId = null, centerId = null) => {
  let url = '/appointments'
  let params = []
  if (companyId) params.push(`company_id=${companyId}`)
  if (centerId) params.push(`center_id=${centerId}`)
  if (params.length) url += '?' + params.join('&')
  const { data } = await api.get(url)
  return data
}

export const getAppointments = getAllAppointments

export const getAppointmentById = async (id, companyId = null, centerId = null) => {
  let url = `/appointments/${id}`
  let params = []
  if (companyId) params.push(`company_id=${companyId}`)
  if (centerId) params.push(`center_id=${centerId}`)
  if (params.length) url += '?' + params.join('&')
  const { data } = await api.get(url)
  return data
}

export const getAppointmentsByDateRange = async (startDate, endDate, companyId = null, centerId = null) => {
  let url = `/appointments/range/${startDate}/${endDate}`
  let params = []
  if (companyId) params.push(`company_id=${companyId}`)
  if (centerId) params.push(`center_id=${centerId}`)
  if (params.length) url += '?' + params.join('&')
  const { data } = await api.get(url)
  return data
}

export const getAvailableSlots = async (date, userId = null, centerId = null) => {
  let url = `/slots/${date}`
  let params = []
  if (userId) params.push(`user_id=${userId}`)
  if (centerId) params.push(`center_id=${centerId}`)
  if (params.length) url += '?' + params.join('&')

  const { data } = await api.get(url)
  return data.slots
}

export const getAvailableUsers = async (date, companyId = null, time = null, centerId = null) => {
  let url = `/users/available?date=${date}`
  if (companyId) url += `&company_id=${companyId}`
  if (time) url += `&time=${time}`
  if (centerId) url += `&center_id=${centerId}`
  const { data } = await api.get(url)
  return data
}

export const getLeastBusyUser = async (date, time, companyId = null, centerId = null) => {
  let url = `/users/least-busy?date=${date}&time=${time}`
  if (companyId) url += `&company_id=${companyId}`
  if (centerId) url += `&center_id=${centerId}`
  const { data } = await api.get(url)
  return data
}

export const createAppointment = async (appointmentData) => {
  const { data } = await api.post('/appointments', appointmentData)
  return data
}

export const updateAppointment = async (id, appointmentData) => {
  const { data } = await api.put(`/appointments/${id}`, appointmentData)
  return data
}

export const deleteAppointment = async (id) => {
  const { data } = await api.delete(`/appointments/${id}`)
  return data
}

// ===================== USERS =====================
export const getAllUsers = async (companyId = null, centerId = null) => {
  let url = '/users'
  let params = []
  if (companyId) params.push(`company_id=${companyId}`)
  if (centerId) params.push(`center_id=${centerId}`)
  if (params.length) url += '?' + params.join('&')
  const { data } = await api.get(url)
  return data
}

export const getUserById = async (id, companyId = null, centerId = null) => {
  let url = `/users/${id}`
  let params = []
  if (companyId) params.push(`company_id=${companyId}`)
  if (centerId) params.push(`center_id=${centerId}`)
  if (params.length) url += '?' + params.join('&')
  const { data } = await api.get(url)
  return data
}

export const createUser = async (userData) => {
  const { data } = await api.post('/users', userData)
  return data
}

export const updateUser = async (id, userData) => {
  const { data } = await api.put(`/users/${id}`, userData)
  return data
}

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`)
  return data
}

// ===================== COMPANIES =====================
export const getAllCompanies = async () => {
  const { data } = await api.get('/companies')
  return data
}

export const getCompanyById = async (id) => {
  const { data } = await api.get(`/companies/${id}`)
  return data
}

export const createCompany = async (companyData) => {
  const { data } = await api.post('/companies', companyData)
  return data
}

export const updateCompany = async (id, companyData) => {
  const { data } = await api.put(`/companies/${id}`, companyData)
  return data
}

export const connectWhatsApp = async (companyId = null, centerId = null) => {
  let query = ''
  if (companyId) query += `?company_id=${companyId}`
  if (centerId) query += (query ? '&' : '?') + `center_id=${centerId}`
  const { data } = await api.get(`/whatsapp/oauth/connect${query}`)
  return data
}

// ===================== CENTERS =====================
export const getAllCenters = async (companyId) => {
  let url = '/centers'
  if (companyId) url += `?company_id=${companyId}`
  const { data } = await api.get(url)
  return data
}

export const getCenterById = async (id) => {
  const { data } = await api.get(`/centers/${id}`)
  return data
}

export const createCenter = async (centerData) => {
  const { data } = await api.post('/centers', centerData)
  return data
}

export const updateCenter = async (id, centerData) => {
  const { data } = await api.put(`/centers/${id}`, centerData)
  return data
}

export const deleteCenter = async (id) => {
  const { data } = await api.delete(`/centers/${id}`)
  return data
}

export default api