<template>
  <nav class="navbar">
    <div class="nav-container">

      <div class="nav-brand">
        <h1>Bot Manager</h1>
      </div>

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
          {{ user?.username || 'Usuario' }} ({{ user?.role === 'admin' ? 'Admin' : 'User' }})
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

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const user = ref(null)
const isAdmin = computed(() => auth.user?.role === 'admin')

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
})
</script>