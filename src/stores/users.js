import { defineStore } from 'pinia'
import { useCompaniesStore } from './companies'
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from '../api/appointments'

export const useUsersStore = defineStore('users', {
  state: () => ({
    items: [],
    loading: false,
    editing: null
  }),

  actions: {
    async fetch() {
      try {
        this.loading = true
        const companies = useCompaniesStore()
        this.items = await getAllUsers(companies.selectedCompanyId)
      } catch (error) {
        console.error('Error loading users:', error)
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
        await updateUser(this.editing.id, data)
      } else {
        await createUser(data)
      }
      this.editing = null
      await this.fetch()
    },

    async remove(id) {
      await deleteUser(id)
      await this.fetch()
    },

    edit(user) {
      this.editing = user
    }
  }
})
