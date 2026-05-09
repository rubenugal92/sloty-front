import { defineStore } from 'pinia'
import {
  getAllFisios,
  createFisio,
  updateFisio,
  deleteFisio
} from '../api/appointments'

export const useFisiosStore = defineStore('fisios', {
  state: () => ({
    items: [],
    loading: false,
    editing: null
  }),

  actions: {
    async fetch() {
      try {
        this.loading = true
        this.items = await getAllFisios()
      } catch (error) {
        console.error('Error loading fisios:', error)
      } finally {
        this.loading = false
      }
    },

    setupCompanyChangeListener() {
      window.addEventListener('company-changed', () => {
        this.fetch()
      })
    },

    async save(data) {
      if (this.editing) {
        await updateFisio(this.editing.id, data)
      } else {
        await createFisio(data)
      }
      this.editing = null
      await this.fetch()
    },

    async remove(id) {
      await deleteFisio(id)
      await this.fetch()
    },

    edit(fisio) {
      this.editing = fisio
    }
  },

  mounted() {
    this.setupCompanyChangeListener()
  }
})