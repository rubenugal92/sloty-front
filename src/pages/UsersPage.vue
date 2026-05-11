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
      <div v-for="user in store.items" :key="user.id" class="user-card">
        <div class="user-details">
          <h3>{{ user.name }}</h3>
          <p class="user-type" :class="user.type">
            {{ user.type === 'fisio' ? '👨‍⚕️ Fisioterapeuta' : '⚙️ ' + user.type }}
          </p>
          <p class="user-specialty">
            {{ user.specialties || 'Sin especialidad' }}
          </p>
          <p class="user-info">
            <strong>Email:</strong> {{ user.email }}
          </p>
          <p v-if="user.phone" class="user-info">
            <strong>Teléfono:</strong> {{ user.phone }}
          </p>
          <p class="user-role">
            <strong>Rol:</strong> 
            <span :class="user.role">
              {{ user.role === 'superadmin' ? 'Superadmin' : user.role === 'admin' ? 'Administrador' : 'Usuario' }}
            </span>
          </p>
        </div>

        <div class="user-actions">
          <button 
            class="btn btn-secondary"
            @click="editUser(user)"
          >
            ✏️ Editar
          </button>
          <button 
            class="btn btn-danger"
            @click="handleDelete(user.id)"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '../stores/users'
import UserForm from '../components/UserForm.vue'

const store = useUsersStore()
const showForm = ref(false)
const editingUser = ref(null)

onMounted(() => {
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
  if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
    await store.remove(id)
    await store.fetch()
  }
}

const handleCancel = () => {
  showForm.value = false
  editingUser.value = null
}
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.page-header div h2 {
  margin: 0 0 0.25rem 0;
  font-size: 1.75rem;
  color: #1f2937;
}

.page-header div p {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.users-grid {
  display: grid;
  gap: 1.5rem;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.user-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #d1d5db;
}

.user-details {
  flex: 1;
}

.user-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.user-type {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-type.fisio {
  color: #dc2626;
}

.user-specialty {
  margin: 0 0 0.75rem 0;
  color: #0066cc;
  font-weight: 500;
  font-size: 0.95rem;
}

.user-info {
  margin: 0.25rem 0;
  color: #374151;
  font-size: 0.9rem;
}

.user-role {
  margin: 0.75rem 0 0 0;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 0.9rem;
}

.user-role span {
  font-weight: 600;
  margin-left: 0.5rem;
}

.user-role span.admin {
  color: #dc2626;
}

.user-role span.user {
  color: #059669;
}

.user-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: flex-start;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #e5e7eb;
}

.btn {
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  white-space: nowrap;
}

.btn-primary {
  background: #0066cc;
  color: white;
}

.btn-primary:hover {
  background: #0052a3;
}

.btn-secondary {
  background: #e5e7eb;
  color: #1f2937;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn-danger {
  background: #fee2e2;
  color: #991b1b;
}

.btn-danger:hover {
  background: #fecaca;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header button {
    width: 100%;
  }

  .user-card {
    flex-direction: column;
    gap: 1rem;
  }

  .user-actions {
    justify-content: flex-start;
    width: 100%;
  }

  .user-actions .btn {
    flex: 1;
  }
}
</style>
