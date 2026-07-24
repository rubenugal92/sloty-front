<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2>Empleados</h2>
        <p>Gestión de empleados del sistema</p>
      </div>

      <button 
        v-if="!showForm"
        class="btn btn-primary"
        @click="showForm = true"
      >
        ➕ Nuevo Empleado
      </button>
    </div>

    <!-- FORMULARIO -->
    <UserForm
      v-if="showForm"
      :editing="editingUser"
      @save="handleSave"
      @cancel="handleCancel"
    />

    <!-- LISTA -->
    <div v-if="store.items.length === 0 && !showForm" class="empty-state">
      No hay empleados registrados todavía.
    </div>

    <div v-else-if="!showForm" class="users-grid">
      <article v-for="user in store.items" :key="user.id" class="user-card">
        <div class="card-top">
          <div class="avatar" :style="{ background: avatarColor(user.id) }">
            {{ initials(user.name) }}
          </div>
          <span :class="['role-tag', `role-${user.role || 'user'}`]">
            {{ user.role === 'superadmin' ? 'Superadmin' : user.role === 'admin' ? 'Admin' : 'Usuario' }}
          </span>
        </div>

        <div class="user-details">
          <h3>{{ user.name }}</h3>
          <p v-if="user.type" class="user-type">{{ formatType(user.type) }}</p>
          <p v-if="user.specialties" class="user-specialty">{{ user.specialties }}</p>
        </div>

        <ul class="user-info-list">
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <a :href="`mailto:${user.email}`">{{ user.email }}</a>
          </li>
          <li v-if="user.phone">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <a :href="`tel:${user.phone}`">{{ user.phone }}</a>
          </li>
        </ul>

        <div class="user-actions">
          <button class="btn btn-secondary btn-sm" @click="editUser(user)">Editar</button>
          <button class="btn btn-danger btn-sm" @click="handleDelete(user.id)">Eliminar</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useUsersStore } from '../stores/users'
import { useCentersStore } from '../stores/centers'
import UserForm from '../components/UserForm.vue'

const store = useUsersStore()
const centersStore = useCentersStore()
const showForm = ref(false)
const editingUser = ref(null)

onMounted(() => {
  store.fetch()
})

watch(() => centersStore.selectedCenterId, () => {
  store.fetch()
})

const editUser = (user) => {
  editingUser.value = user
  showForm.value = true
}

const handleSave = async () => {
  await store.fetch()
  showForm.value = false
  editingUser.value = null
}

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Eliminar empleado',
    text: '¿Estás seguro de que deseas eliminar este empleado?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    await store.remove(id)
    await store.fetch()
    await Swal.fire({
      icon: 'success',
      title: 'Empleado eliminado',
      text: 'El empleado ha sido eliminado correctamente.'
    })
  }
}

const handleCancel = () => {
  showForm.value = false
  editingUser.value = null
}

const formatType = (type) => {
  if (!type) return ''
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const initials = (name) => {
  if (!name) return '?'
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('') || '?'
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #06b6d4, #6366f1)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #ec4899, #f59e0b)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
]

const avatarColor = (id) => AVATAR_GRADIENTS[(id || 0) % AVATAR_GRADIENTS.length]
</script>

<style scoped>
.page-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header div h2 {
  margin: 0 0 0.2rem 0;
}

.page-header div p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.user-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out),
              border-color var(--duration-normal) var(--ease-out);
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-500), var(--accent-500));
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-200);
}

.user-card:hover::before { opacity: 1; }

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  display: grid;
  place-items: center;
  letter-spacing: -0.02em;
  box-shadow: var(--shadow-sm);
}

.role-tag {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--surface-subtle);
  color: var(--text-secondary);
}
.role-tag.role-admin      { background: var(--danger-50); color: var(--danger-700); }
.role-tag.role-superadmin { background: linear-gradient(135deg, var(--primary-600), var(--accent-600)); color: white; }
.role-tag.role-user       { background: var(--success-50); color: var(--success-700); }

.user-details h3 {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
}

.user-type {
  margin: 0;
  font-size: 0.85rem;
  color: var(--primary-700);
  font-weight: 600;
}

.user-specialty {
  margin: 0.2rem 0 0;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.user-info-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-top: 0.65rem;
  border-top: 1px dashed var(--border);
}
.user-info-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
}
.user-info-list svg {
  color: var(--text-muted);
  flex-shrink: 0;
}
.user-info-list a {
  color: var(--text-secondary);
  word-break: break-all;
}
.user-info-list a:hover { color: var(--primary-700); }

.user-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.5rem;
}
.user-actions .btn { flex: 1; }

@media (max-width: 540px) {
  .users-grid { grid-template-columns: 1fr; }
  .page-header button { width: 100%; }
}
</style>
