import { defineStore } from 'pinia'
import { useCompaniesStore } from './companies'
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../api/appointments.js'

export const useAppointmentsStore = defineStore('appointments', {
  state: () => ({
    items: [],
    selected: null,
    loading: false
  }),

  actions: {
    async load() {
      try {
        this.loading = true
        const companies = useCompaniesStore()
        this.items = await getAppointments(companies.selectedCompanyId)
      } catch (error) {
        console.error('Error loading appointments:', error)
      } finally {
        this.loading = false
      }
    },

    setupCompanyChangeListener() {
      window.addEventListener('company-changed', () => {
        this.load()
      })
    },

    select(appointment) {
      this.selected = appointment
    },

    async save(data) {
      if (this.selected?.id) {
        await updateAppointment(this.selected.id, data)
      } else {
        await createAppointment(data)
      }

      await this.load()
      this.selected = null
    },

    async remove(id) {
      await deleteAppointment(id)
      await this.load()
      this.selected = null
    }
  }
})