<template>
  <div class="form-container">
    <h3>{{ isEditing ? 'Editar Empleado' : 'Nuevo Empleado' }}</h3>

    <form @submit.prevent="submitForm" class="user-form">
      <div class="form-group">
        <label>Nombre de Usuario</label>
        <input 
          v-model="form.username"
          type="text"
          placeholder="Ej: juanGarcia92"
          required
          :disabled="loading"
        />
      </div>

       <div class="form-group">
        <label>Nombre</label>
        <input 
          v-model="form.name"
          type="text"
          placeholder="Ej: Juan García"
          required
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input 
          v-model="form.email"
          type="email"
          placeholder="correo@ejemplo.com"
          required
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label>Password {{ isEditing ? '(dejar vacío para mantener actual)' : '' }}</label>
        <input 
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          :required="!isEditing"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label>Teléfono</label>
        <input 
          v-model="form.phone"
          type="tel"
          placeholder="+34 xxx xxx xxx"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label>Especialidades</label>
        <input
          v-model="form.specialties"
          type="text"
          placeholder="Ej: Color, Manicura, Nutrición deportiva…"
          :disabled="loading"
        />
      </div>


      <div class="form-group">
        <label>Cargo / Puesto</label>
        <input
          v-model="form.type"
          type="text"
          placeholder="Ej: Peluquero, Fisioterapeuta, Camarero…"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label>Rol</label>
        <select v-model="form.role" required :disabled="loading">
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
        </button>

        <button 
          type="button"
          class="btn btn-secondary"
          @click="resetForm"
          :disabled="loading"
        >
          Limpiar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import Swal from 'sweetalert2'
import { createUser, updateUser } from '../api/appointments.js'
import { useAuthStore } from '../stores/auth'
import { useCompaniesStore } from '../stores/companies'

export default {
  name: 'UserForm',
  props: {
    editing: Object,
    loading: Boolean
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const auth = useAuthStore()
    const companies = useCompaniesStore()

     const form = ref({
      email: '',
      password: '',
      username: '',
      name: '',
      specialties: '',
      phone: '',
      type: ''
    })

    const loading = ref(false)
    const isEditing = computed(() => !!props.editing?.id)

    const submitForm = async () => {
      try {
        loading.value = true
        const data = { ...form.value }
        
        // Si estamos editando y la password está vacía, no enviarla
        if (isEditing.value && !data.password) {
          delete data.password
        }

        if (isEditing.value) {
          await updateUser(props.editing.id, data)
        } else {
          // Superadmin debe especificar la empresa destino (la seleccionada)
          if (auth.isSuperAdmin) {
            if (!companies.selectedCompanyId) {
              await Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Selecciona una empresa en la barra superior antes de crear un empleado.'
              })
              return
            }
            data.company_id = companies.selectedCompanyId
          }
          // Admin normal → el backend usa su req.user.company_id automáticamente
          await createUser(data)
        }

        emit('save')
        resetForm()
      } catch (error) {
        console.error('Error saving user:', error)
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al guardar: ' + (error.response?.data?.error || error.message)
        })
      } finally {
        loading.value = false
      }
    }

    const emptyForm = () => ({
      username: '',
      name: '',
      email: '',
      password: '',
      phone: '',
      specialties: '',
      type: '',
      role: 'user'
    })

    const resetForm = () => {
      form.value = emptyForm()
      emit('cancel')
    }

    watch(() => props.editing, (newVal) => {
      if (newVal) {
        form.value = { ...emptyForm(), ...newVal, password: '' }
      } else {
        form.value = emptyForm()
      }
    }, { immediate: true })

    return {
      form,
      loading,
      isEditing,
      submitForm,
      resetForm
    }
  }
}
</script>

<style scoped>
.form-container {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
}

.form-container h3 {
  margin: 0 0 1.25rem 0;
  font-size: 1.15rem;
  color: var(--text-primary);
}

.user-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.form-actions .btn { flex: 1; min-width: 130px; }

@media (max-width: 640px) {
  .user-form { grid-template-columns: 1fr; }
  .form-container { padding: 1.25rem; }
}
</style>
