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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCompaniesStore } from '../stores/companies'
import { useCentersStore } from '../stores/centers'
import PlanningCalendar from '../components/PlanningCalendar.vue'

const auth = useAuthStore()
const companies = useCompaniesStore()
const centers = useCentersStore()
const selectedUserId = ref('')
const users = ref([])

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const isAdmin = computed(() => auth.isAdmin)

const getSelectedUserName = () => {
  const user = users.value.find(u => String(u.id) === selectedUserId.value)
  return user?.name || 'Desconocido'
}

const fetchUsers = async () => {
  try {
    let url = `${API_BASE_URL}/api/users`
    let params = []
    if (auth.isSuperAdmin && companies.selectedCompanyId) {
      params.push(`company_id=${companies.selectedCompanyId}`)
    }
    if (centers.selectedCenterId) {
      params.push(`center_id=${centers.selectedCenterId}`)
    }
    if (params.length) url += '?' + params.join('&')

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })

    if (response.ok) {
      const data = await response.json()
      users.value = data.filter(u => u.role === 'user')
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const onCompanyChanged = () => {
  selectedUserId.value = ''
  if (isAdmin.value) fetchUsers()
}

const onCenterChanged = () => {
  selectedUserId.value = ''
  if (isAdmin.value) fetchUsers()
}

onMounted(() => {
  if (isAdmin.value) fetchUsers()
  window.addEventListener('company-changed', onCompanyChanged)
  window.addEventListener('center-changed', onCenterChanged)
})

onBeforeUnmount(() => {
  window.removeEventListener('company-changed', onCompanyChanged)
  window.removeEventListener('center-changed', onCenterChanged)
})

watch(() => companies.selectedCompanyId, () => {
  if (isAdmin.value) fetchUsers()
})

watch(() => centers.selectedCenterId, () => {
  if (isAdmin.value) fetchUsers()
})
</script>

<style scoped>
.planning-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.page-header h1 {
  margin: 0 0 0.4rem;
  letter-spacing: -0.02em;
}

.subtitle {
  color: var(--text-muted);
  margin: 0;
  font-size: 0.95rem;
}

.content {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
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
  background: var(--surface-muted);
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
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
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  cursor: pointer;
}
.user-select:hover { border-color: var(--primary-300); }
.user-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: var(--shadow-focus);
}

.selected-planning-wrapper {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--border);
}

.user-header h3 { margin: 0; }

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
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow: hidden;
  transition: box-shadow var(--duration-normal) var(--ease-out),
              transform var(--duration-normal) var(--ease-out);
}

.user-planning-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.user-planning-card h3 {
  margin: 0;
  font-size: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--border);
}

.no-access {
  background: var(--warning-50);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: var(--warning-700);
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  text-align: center;
}
</style>
