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

        <a 
          href="https://botmanagermarketing.onrender.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn btn-info"
        >
          🌐 Sitio Web
        </a>

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
import { useFisiosStore } from '../stores/fisios'
import CompanySelector from './CompanySelector.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const companies = useCompaniesStore()
const appointments = useAppointmentsStore()
const users = useUsersStore()
const fisios = useFisiosStore()

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

onMounted(() => {
  user.value = getUser()
  
  // Inicializar stores de datos
  if (auth.isAuthenticated) {
    // Cargar compañías si es superadmin
    if (auth.isSuperAdmin) {
      companies.loadCompanies()
    }
    
    // Cargar datos iniciales
    appointments.setupCompanyChangeListener()
    users.setupCompanyChangeListener()
    fisios.setupCompanyChangeListener()
  }
})
</script>