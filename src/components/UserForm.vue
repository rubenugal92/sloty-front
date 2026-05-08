<template>
  <div class="form-container">
    <h3>{{ isEditing ? 'Editar Empleado' : 'Nuevo Empleado' }}</h3>

    <form @submit.prevent="submitForm" class="user-form">
      <div class="form-group">
        <label>Nombre de Empleado</label>
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
          placeholder="Ej: Traumatología, Deportiva"
          :disabled="loading"
        />
      </div>


      <div class="form-group">
        <label>Tipo de Empleado</label>
        <select v-model="form.type" required :disabled="loading">
          <option value="">Selecciona un tipo</option>
          <option value="fisio">Fisioterapeuta</option>
          <option value="osteo">Osteópata</option>
          <option value="quiro">Quiropráctico</option>
          <option value="recep">Recepcionista</option>
          <option value="limpieza">Servicio de limpieza</option>
          <option value="admin">Administrador</option>
        </select>
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
import { register, updateUser } from '../api/appointments.js'

export default {
  name: 'UserForm',
  props: {
    editing: Object,
    loading: Boolean
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
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
          await register(
                data.username,
                data.name,
                data.email,
                data.password,
                data.specialties, 
                data.phone,
                data.type
                )
        }

        emit('save')
        resetForm()
      } catch (error) {
        console.error('Error saving user:', error)
        alert('Error al guardar: ' + (error.response?.data?.error || error.message))
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      form.value = {
        username: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        specialties: '',
        type: 'fisio',
        role: 'user',
        password: ''
      }
      emit('cancel')
    }

    watch(() => props.editing, (newVal) => {
      if (newVal) {
        form.value = { ...newVal, password: '' }
      } else {
        form.value = {
          username: '',
          name: '',
          email: '',
          password: '',
          phone: '',
          specialties: '',
          type: 'fisio',
          role: 'user',
          password: ''
        }
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
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.form-container h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.user-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form-group input:disabled,
.form-group select:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.btn-primary {
  background: #0066cc;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0052a3;
}

.btn-secondary {
  background: #e5e7eb;
  color: #1f2937;
}

.btn-secondary:hover:not(:disabled) {
  background: #d1d5db;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
