import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { getAllCompanies, getCompanyById } from '../api/appointments'

export const useCompaniesStore = defineStore('companies', {
  state: () => ({
    items: [],
    selectedCompanyId: localStorage.getItem('selectedCompanyId') ? parseInt(localStorage.getItem('selectedCompanyId')) : null,
    loading: false
  }),

  getters: {
    selectedCompany: (state) => {
      return state.items.find(c => c.id === state.selectedCompanyId)
    }
  },

  actions: {
    async loadCompanies() {
      try {
        this.loading = true
        const auth = useAuthStore()
        
        if (auth.user?.role === 'superadmin') {
          this.items = await getAllCompanies()

          if (!this.selectedCompanyId && this.items.length > 0) {
            this.selectCompany(this.items[0].id)
          }
        } else if (auth.user?.role === 'admin' && auth.user?.company_id) {
          const company = await getCompanyById(auth.user.company_id)
          this.items = company ? [company] : []

          if (!this.selectedCompanyId && this.items.length > 0) {
            this.selectCompany(this.items[0].id)
          }
        }
      } catch (error) {
        console.error('Error loading companies:', error)
      } finally {
        this.loading = false
      }
    },

    selectCompany(companyId) {
      this.selectedCompanyId = companyId
      localStorage.setItem('selectedCompanyId', companyId)
      
      // Aquí se disparará un evento para que otros stores se recarguen
      window.dispatchEvent(new CustomEvent('company-changed', { detail: { companyId } }))
    }
  }
})
