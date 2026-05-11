<template>
  <div class="form-container">
    <h3>{{ isEditing ? 'Editar Cita' : 'Nueva Cita' }}</h3>

    <!-- MOSTRAR CUSTOM_ID DESPUÉS DE CREAR -->
    <div v-if="lastCustomId" class="custom-id-alert">
      <h4>🎫 ID de Tu Cita (para Anulaciones)</h4>
      <p class="custom-id-value">{{ lastCustomId }}</p>
      <p class="custom-id-hint">⚠️ Guarda este código para poder anular la cita si lo necesitas</p>
      <button type="button" class="btn btn-small" @click="copyToClipboard">📋 Copiar</button>
    </div>

    <form @submit.prevent="submitForm" class="appointment-form">
      <div class="form-group">
        <label>Teléfono del Cliente</label>
        <input
          v-model="form.phone"
          type="tel"
          placeholder="+34 xxx xxx xxx"
          required
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label>Empleado</label>
        <select
          v-model="form.user_id"
          required
          :disabled="loading || users.length === 0"
          @change="updateAvailableSlots"
        >
          <option value="">Selecciona un empleado</option>
          <option v-for="employee in users" :key="employee.id" :value="employee.id">
            {{ employee.name }}{{ employee.specialties ? ` (${employee.specialties})` : '' }}
          </option>
        </select>
        <small v-if="users.length === 0" class="text-danger">
          No hay empleados disponibles
        </small>
      </div>

      <div class="form-group">
        <label>Fecha</label>
        <input
          v-model="form.date"
          type="date"
          required
          :disabled="loading"
          @change="updateAvailableSlots"
        />
      </div>

      <div class="form-group">
        <label>Hora</label>
        <select
          v-model="form.time"
          required
          :disabled="loading || availableSlots.length === 0"
        >
          <option value="">Selecciona una hora</option>
          <option v-for="slot in availableSlots" :key="slot" :value="slot">
            {{ slot }}
          </option>
        </select>
        <small v-if="availableSlots.length === 0 && form.date && form.user_id" class="text-danger">
          No hay horarios disponibles para esta fecha con este empleado
        </small>
      </div>

      <div class="form-group">
        <label>Servicio</label>
        <input
          v-model="form.service"
          type="text"
          placeholder="Ej: Corte de pelo, Masaje deportivo, Consulta nutricional…"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label>Notas</label>
        <textarea
          v-model="form.notes"
          rows="3"
          :disabled="loading"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Estado</label>
        <select v-model="form.status" :disabled="loading">
          <option value="confirmed">Confirmada</option>
          <option value="pending">Pendiente</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Cita') }}
        </button>

        <button
          v-if="isEditing"
          type="button"
          class="btn btn-danger"
          @click="handleDelete"
          :disabled="loading"
        >
          {{ loading ? 'Eliminando...' : 'Eliminar' }}
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
import { ref, computed, watch, onMounted } from 'vue'
import { createAppointment, updateAppointment as updateAppointmentAPI, deleteAppointment as deleteAppointmentAPI, getAvailableSlots, getAllUsers } from '../api/appointments.js'

export default {
  name: 'AppointmentForm',
  props: {
    appointment: Object,
    selectedDate: String,
    loading: Boolean
  },
  emits: ['save', 'delete', 'clear'],
  setup(props, { emit }) {

    const form = ref({
      phone: '',
      date: '',
      time: '',
      user_id: '',
      service: '',
      status: 'confirmed',
      notes: ''
    })

    const availableSlots = ref([])
    const users = ref([])
    const lastCustomId = ref('')

    const isEditing = computed(() => !!props.appointment?.id)

    const loadUsers = async () => {
      try {
        users.value = await getAllUsers()
      } catch (e) {
        console.error('Error loading users:', e)
        users.value = []
      }
    }

    const resetForm = () => {
      form.value = {
        phone: '',
        date: props.selectedDate || '',
        time: '',
        user_id: '',
        service: '',
        status: 'confirmed',
        notes: ''
      }
      availableSlots.value = []
      emit('clear')
    }

    const updateAvailableSlots = async () => {
      if (!form.value.date || !form.value.user_id) {
        availableSlots.value = []
        return
      }
      try {
        availableSlots.value = await getAvailableSlots(form.value.date, form.value.user_id)
        form.value.time = ''
      } catch (e) {
        console.error('Error fetching slots:', e)
        availableSlots.value = []
      }
    }

    const submitForm = async () => {

      // 🔥 FIX: Convertir hora local España (UTC+2 CEST) a UTC
      // Si usuario selecciona 15:00, guardamos como 13:00 UTC
      const [hours, minutes] = form.value.time.split(':').map(Number)
      const utcHours = String((hours - 2 + 24) % 24).padStart(2, '0')
      const utcMinutes = String(minutes).padStart(2, '0')
      const datetime = `${form.value.date}T${utcHours}:${utcMinutes}:00`

      const appointmentData = {
        phone: form.value.phone,
        datetime,
        service: form.value.service,
        status: form.value.status,
        notes: form.value.notes,
        user_id: parseInt(form.value.user_id)
      }

      try {
        if (isEditing.value) {
          await updateAppointmentAPI(props.appointment.id, appointmentData)
        } else {
          const response = await createAppointment(appointmentData)
          if (response.custom_id) {
            lastCustomId.value = response.custom_id
          }
        }

        emit('save', appointmentData)
        resetForm()

      } catch (e) {
        console.error(e)
        alert('Error: ' + (e.response?.data?.error || e.message))
      }
    }

    const copyToClipboard = () => {
      if (lastCustomId.value) {
        navigator.clipboard.writeText(lastCustomId.value)
        alert('✅ ID copiado al portapapeles')
      }
    }

    const handleDelete = async () => {
      if (!props.appointment) return
      try {
        await deleteAppointmentAPI(props.appointment.id)
        emit('delete', props.appointment.id)
        resetForm()
      } catch (e) {
        console.error(e)
        alert('Error: ' + (e.response?.data?.error || e.message))
      }
    }

    watch(() => props.appointment, (a) => {
      if (!a) return

      form.value.phone = a.phone
      form.value.date = a.datetime.split('T')[0]
      form.value.user_id = a.user_id || ''

      // 🔥 FIX: Convertir UTC a zona horaria local España (UTC+2 CEST)
      const timePart = a.datetime.split('T')[1].slice(0,5)
      const [hours, minutes] = timePart.split(':').map(Number)
      const localHours = String((hours + 2) % 24).padStart(2, '0')
      form.value.time = `${localHours}:${minutes}`

      form.value.service = a.service
      form.value.status = a.status
      form.value.notes = a.notes || ''

      updateAvailableSlots()
    }, { deep: true })

    watch(() => props.selectedDate, (d) => {
      if (d && !props.appointment) {
        form.value.date = d
        updateAvailableSlots()
      }
    })

    onMounted(() => {
      loadUsers()
    })

    return {
      form,
      availableSlots,
      users,
      isEditing,
      lastCustomId,
      resetForm,
      updateAvailableSlots,
      submitForm,
      handleDelete,
      copyToClipboard
    }
  }
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-container h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
}

.custom-id-alert {
  background: linear-gradient(135deg, var(--warning-50), #fff7ed);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: var(--radius-lg);
  padding: 1.1rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.custom-id-alert h4 {
  margin: 0 0 0.4rem;
  color: var(--warning-700);
  font-size: 0.95rem;
  letter-spacing: -0.01em;
}

.custom-id-value {
  font-family: var(--font-mono);
  background: white;
  border: 1px solid rgba(245, 158, 11, 0.4);
  padding: 0.7rem;
  border-radius: var(--radius-sm);
  margin: 0.5rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  word-break: break-all;
}

.custom-id-hint {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: var(--warning-700);
  font-weight: 500;
}

.btn-small {
  margin-top: 0.5rem;
  padding: 0.4rem 0.85rem;
  font-size: 0.8rem;
  background: var(--warning-500);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 600;
  transition: background var(--duration-fast) var(--ease-out);
}
.btn-small:hover { background: var(--warning-700); }

.appointment-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.text-danger {
  color: var(--danger-600);
  font-size: 0.78rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.form-actions .btn { flex: 1; min-width: 120px; }
</style>
