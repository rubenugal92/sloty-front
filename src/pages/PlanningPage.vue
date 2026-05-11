<template>
  <div class="planning-page">
    <div class="page-header">
      <h1>📅 Planning</h1>
      <p class="subtitle">Gestiona el calendario de trabajos, vacaciones y bajas</p>
    </div>

    <!-- Vista para usuarios (solo su propio planning) -->
    <div v-if="!isAdmin" class="content">
      <div class="user-planning">
        <h2>Tu Planning</h2>
        <PlanningCalendar :user-id="auth.user?.id" />
      </div>
    </div>

    <!-- Vista para admin (todos los empleados) -->
    <div v-else-if="isAdmin" class="content">
      <div class="admin-view">
        <div class="controls-section">
          <div class="selector-wrapper">
            <h2>Selecciona un Empleado</h2>
            <select v-model="selectedUserId" class="user-select">
              <option value="">📊 Ver todos los empleados</option>
              <option v-for="user in users" :key="user.id" :value="String(user.id)">
                {{ user.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Vista individual de un empleado -->
        <div v-if="selectedUserId" class="selected-planning-wrapper">
          <div class="user-header">
            <h3>{{ getSelectedUserName() }}</h3>
            <button @click="selectedUserId = ''" class="btn btn-secondary">Volver a ver todos</button>
          </div>
          <PlanningCalendar :user-id="selectedUserId" :key="selectedUserId" />
        </div>

        <!-- Vista grid de todos los empleados -->
        <div v-else class="all-planning-grid">
          <div v-for="user in users" :key="user.id" class="user-planning-card">
            <h3>{{ user.name }}</h3>
            <PlanningCalendar :user-id="user.id" :key="`all-${user.id}`" compact />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-access">
      <p>⚠️ No tienes acceso a esta sección</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import PlanningCalendar from '../components/PlanningCalendar.vue'

const auth = useAuthStore()
const selectedUserId = ref('')
const users = ref([])

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const isAdmin = computed(() => auth.user?.role === 'admin')

const getSelectedUserName = () => {
  const user = users.value.find(u => String(u.id) === selectedUserId.value)
  return user?.name || 'Desconocido'
}

const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      users.value = data.filter(u => u.role === 'user')
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(() => {
  if (isAdmin.value) {
    fetchUsers()
  }
})
</script>

<style scoped>
.planning-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 28px;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 15px;
}

.content {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.user-planning {
  max-width: 900px;
  margin: 0 auto;
}

.user-planning h2 {
  margin-top: 0;
  color: #333;
}

.admin-view {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.controls-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.selector-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selector-wrapper h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.user-select {
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.user-select:hover {
  border-color: #007bff;
}

.user-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.selected-planning-wrapper {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #ddd;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #007bff;
}

.user-header h3 {
  margin: 0;
  color: #333;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:hover {
  background: #5a6268;
}

.all-planning-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .all-planning-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.user-planning-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.user-planning-card h3 {
  margin: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
  font-size: 16px;
}

.no-access {
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
}
</style>
