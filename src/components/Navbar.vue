<template>
  <nav class="navbar">
    <div class="nav-container">

      <div class="nav-brand">
        <h1>Bot Manager</h1>
      </div>

      <CompanySelector />

      <div class="nav-menu">
        <button
          class="nav-button"
          :class="{ active: route.path === '/calendario' }"
          @click="go('/calendario')"
        >
          📅 Citas
        </button>

        <button
          v-if="isAdmin"
          class="nav-button"
          :class="{ active: route.path === '/usuarios' }"
          @click="go('/usuarios')"
        >
          👥 Empleados
        </button>

        <button
          class="nav-button"
          :class="{ active: route.path === '/planning' }"
          @click="go('/planning')"
        >
          📋 Planning Empleado
        </button>
      </div>

      <div class="nav-user">
        <span class="user-name">
          {{ user?.username || 'Usuario' }} ({{ roleLabel }})
        </span>

        <button class="btn btn-logout" @click="handleLogout">
          Salir
        </button>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUser, logout } from '../api/appointments.js'
import { useAuthStore } from '../stores/auth'
import { useCompaniesStore } from '../stores/companies'
import { useAppointmentsStore } from '../stores/appointments'
import { useUsersStore } from '../stores/users'
import CompanySelector from './CompanySelector.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const companies = useCompaniesStore()
const appointments = useAppointmentsStore()
const users = useUsersStore()

const user = ref(null)
const isAdmin = computed(() => auth.isAdmin)

const roleLabel = computed(() => {
  if (auth.user?.role === 'superadmin') return 'Superadmin'
  if (auth.user?.role === 'admin') return 'Admin'
  return 'Usuario'
})

const go = (path) => {
  router.push(path)
}

const handleLogout = () => {
  logout()
  auth.logout()
  router.push('/login')
}

onMounted(async () => {
  user.value = getUser()

  if (auth.isAuthenticated) {
    appointments.setupCompanyChangeListener()
    users.setupCompanyChangeListener()

    if (auth.isSuperAdmin) {
      await companies.loadCompanies()
    }

    await appointments.load()
    await users.fetch()
  }
})
</script>