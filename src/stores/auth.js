import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    selectedCompanyId: localStorage.getItem('selectedCompanyId') ? parseInt(localStorage.getItem('selectedCompanyId')) : null
  }),

  getters: {
    isSuperAdmin: (state) => state.user?.role === 'superadmin',
    isAdmin: (state) => state.user?.role === 'admin' || state.user?.role === 'superadmin'
  },

  actions: {
    login(token, user) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      this.token = token
      this.user = user
      this.isAuthenticated = true
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('selectedCompanyId')
      this.token = null
      this.user = null
      this.isAuthenticated = false
      this.selectedCompanyId = null
    },

    setSelectedCompanyId(companyId) {
      this.selectedCompanyId = companyId
      localStorage.setItem('selectedCompanyId', companyId)
    }
  }
})