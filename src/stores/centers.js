import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { 
  getAllCenters, 
  getCenterById,
  createCenter as createCenterApi,
  updateCenter as updateCenterApi,
  deleteCenter as deleteCenterApi
} from '../api/appointments'

export const useCentersStore = defineStore('centers', {
  state: () => ({
    items: [],
    selectedCenterId: localStorage.getItem('selectedCenterId') ? parseInt(localStorage.getItem('selectedCenterId')) : null,
    loading: false
  }),

  getters: {
    selectedCenter: (state) => {
      return state.items.find(c => c.id === state.selectedCenterId)
    },
    centersByCompany: (state) => {
      return (companyId) => state.items.filter(c => c.company_id === companyId)
    }
  },

  actions: {
    async loadCenters(companyId) {
      try {
        this.loading = true
        const auth = useAuthStore()
        
        if (!companyId) {
          if (auth.user?.company_id) {
            companyId = auth.user.company_id
          } else {
            this.items = []
            return
          }
        }

        this.items = await getAllCenters(companyId)

        if (!this.selectedCenterId && this.items.length > 0) {
          this.selectCenter(this.items[0].id)
        }
      } catch (error) {
        console.error('Error loading centers:', error)
      } finally {
        this.loading = false
      }
    },

    selectCenter(centerId) {
      this.selectedCenterId = centerId
      localStorage.setItem('selectedCenterId', centerId)
      
      window.dispatchEvent(new CustomEvent('center-changed', { detail: { centerId } }))
    },

    async createCenter(centerData) {
      try {
        const result = await createCenterApi(centerData)
        this.items.push(result)
        return result
      } catch (error) {
        console.error('Error creating center:', error)
        throw error
      }
    },

    async updateCenter(centerId, centerData) {
      try {
        const result = await updateCenterApi(centerId, centerData)
        const idx = this.items.findIndex(c => c.id === centerId)
        if (idx >= 0) this.items[idx] = result
        return result
      } catch (error) {
        console.error('Error updating center:', error)
        throw error
      }
    },

    async deleteCenter(centerId) {
      try {
        await deleteCenterApi(centerId)
        this.items = this.items.filter(c => c.id !== centerId)
        if (this.selectedCenterId === centerId) {
          this.selectedCenterId = this.items.length > 0 ? this.items[0].id : null
          if (this.selectedCenterId) {
            localStorage.setItem('selectedCenterId', this.selectedCenterId)
          } else {
            localStorage.removeItem('selectedCenterId')
          }
        }
      } catch (error) {
        console.error('Error deleting center:', error)
        throw error
      }
    }
  }
})
