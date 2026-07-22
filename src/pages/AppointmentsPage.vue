<template>
  <div class="app-container" :class="{ fullscreen: isFullscreen }">

    <div class="left-panel">
      <div class="calendar-wrapper">
        <Calendar
          :appointments="store.items"
          :is-fullscreen="isFullscreen"
          @appointment-selected="store.select"
          @date-selected="onDateSelected"
          @day-appointments-changed="onDayAppointmentsChanged"
          @toggle-fullscreen="isFullscreen = !isFullscreen"
        />
      </div>
    </div>

    <div v-if="!isFullscreen" class="right-panel">
      <AppointmentForm
        :appointment="store.selected"
        :selected-date="selectedDate"
        @save="handleSave"
        @delete="handleDelete"
        @clear="store.select(null)"
      />
    </div>

    <div v-if="isFullscreen" class="right-panel fullscreen-appointments">
      <div class="list-header">
        <h3 v-if="selectedDate">{{ selectedDate }}</h3>
        <h3 v-else class="muted-title">Selecciona un día</h3>
        <span v-if="appointmentsForSelectedDay.length" class="count-pill">
          {{ appointmentsForSelectedDay.length }} {{ appointmentsForSelectedDay.length === 1 ? 'cita' : 'citas' }}
        </span>
      </div>

      <div v-if="appointmentsForSelectedDay.length > 0" class="appointments">
        <article
          v-for="appointment in appointmentsForSelectedDay"
          :key="appointment.id"
          class="appointment-card"
          @click="store.select(appointment)"
        >
          <div class="appointment-main">
            <div class="appointment-time">{{ formatTime(appointment.datetime) }}</div>
            <div class="appointment-customer">
              <span v-if="appointment.customer_name" class="customer-name"> <strong>Cliente: </strong>{{ appointment.customer_name }}</span>
              <span class="appointment-phone"> <strong>Teléfono cliente: </strong> {{ appointment.phone }}</span>
            </div>
          </div>

          <div v-if="appointment.user_name" class="appointment-pro">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <strong>Especialista:</strong> {{ appointment.user_name }}
          </div>

          <div class="appointment-meta">
            <span :class="['status-badge', 'status-' + statusLabel(appointment.status)]">
              {{ statusLabelText(appointment.status) }}
            </span>
            <span v-if="appointment.service" class="service-tag">{{ appointment.service }}</span>
          </div>

          <div v-if="appointment.notes" class="appointment-notes">
            <strong>Notas del cliente:</strong> {{ appointment.notes }}
          </div>

          <div v-if="appointment.custom_id" class="appointment-id">
            <span class="id-label">ID</span>
            <code>{{ appointment.custom_id }}</code>
          </div>
        </article>
      </div>

      <div v-else-if="selectedDate" class="no-appointments">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <p>No hay citas para este día</p>
      </div>

      <div v-else class="no-appointments faint">
        <p>Selecciona un día del calendario para ver sus citas.</p>
      </div>
    </div>

    <div v-if="isFullscreen && store.selected" class="fullscreen-detail">
      <button
        class="fullscreen-detail-close"
        @click="store.select(null)"
        title="Cerrar detalles"
      >
        <i class="ri-close-line"></i>
      </button>
      <AppointmentForm
        :appointment="store.selected"
        :selected-date="selectedDate"
        @save="handleSave"
        @delete="handleDelete"
        @clear="store.select(null)"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppointmentsStore } from '../stores/appointments'

import Calendar from '../components/Calendar.vue'
import AppointmentForm from '../components/AppointmentForm.vue'

const store = useAppointmentsStore()
const selectedDate = ref(null)
const isFullscreen = ref(false)
const appointmentsForSelectedDay = ref([])

onMounted(() => {
  store.load()
})

const onDateSelected = (date) => {
  selectedDate.value = date
}

const onDayAppointmentsChanged = (appointments) => {
  appointmentsForSelectedDay.value = appointments
}

const formatTime = (datetime) => {
  return new Date(datetime).toLocaleTimeString('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusLabelText = (status) => ({
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  cancelled: 'Cancelada'
}[status] || status)

const statusLabel = (status) => 'status-' + status

const handleSave = async (data) => {
  await store.load()
  store.select(null)
}

const handleDelete = async (id) => {
  await store.load()
  store.select(null)
}
</script>

<style scoped>
.app-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  height: calc(100vh - 80px);
  overflow: hidden;
  align-items: start;
}

.app-container.fullscreen {
  grid-template-columns: 3fr 1.2fr;
  gap: 1rem;
  padding: 0;
  height: 100%;
}

.left-panel {
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
  height: 100%;
}

.app-container.fullscreen .left-panel {
  overflow: hidden;
  padding: 0.75rem 0 0.75rem 0.75rem;
}

.calendar-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.app-container.fullscreen .calendar-wrapper {
  overflow: hidden;
}

.right-panel {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
}

.app-container.fullscreen .right-panel {
  padding: 0.75rem 0.75rem 0.75rem 0;
}

.fullscreen-detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 1000;
  overflow: auto;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.fullscreen-detail-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  font-size: 1.5rem;
  color: #333;
  z-index: 1001;
  transition: background 0.2s;
}

.fullscreen-detail-close:hover {
  background: #e2e8f0;
}

/* fullscreen-appointments list */
.fullscreen-appointments {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.list-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
  text-transform: capitalize;
}

.muted-title { color: var(--text-muted); font-weight: 500; }

.count-pill {
  padding: 3px 10px;
  background: var(--primary-50);
  color: var(--primary-700);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.appointments {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-height: none;
  overflow-y: auto;
  padding-right: 4px;
}

.appointment-card {
  position: relative;
  padding: 0.65rem 0.8rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.appointment-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 14px;
  bottom: 14px;
  width: 3px;
  border-radius: 2px;
  background: linear-gradient(180deg, var(--primary-500), var(--accent-500));
}

.appointment-card:hover {
  border-color: var(--primary-300);
  transform: translateX(2px);
  box-shadow: var(--shadow-sm);
}

.appointment-main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding-left: 0.75rem;
}

.appointment-time {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.appointment-customer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  text-align: right;
  min-width: 0;
}

.customer-name {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.88rem;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.appointment-phone {
  color: var(--text-muted);
  font-size: 0.78rem;
  font-family: var(--font-mono);
}

.appointment-pro {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: 0.75rem;
  padding: 3px 8px;
  background: var(--primary-50);
  color: var(--primary-700);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
}
.appointment-pro svg { flex-shrink: 0; }

.appointment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding-left: 0.75rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.status-confirmed { background: var(--success-50);  color: var(--success-700); }
.status-pending   { background: var(--warning-50);  color: var(--warning-700); }
.status-cancelled { background: var(--danger-50);   color: var(--danger-700); }

.service-tag {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--surface-subtle);
  color: var(--text-secondary);
  font-size: 0.72rem;
  font-weight: 500;
}

.appointment-notes {
  padding-left: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.4;
}

.appointment-id {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-left: 0.75rem;
  margin-top: 2px;
}

.id-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.appointment-id code {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--primary-600);
  background: var(--primary-50);
  padding: 2px 6px;
  border-radius: 4px;
  word-break: break-all;
}

.no-appointments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 1rem;
  color: var(--text-muted);
  text-align: center;
}

.no-appointments svg {
  opacity: 0.5;
}

.no-appointments.faint {
  opacity: 0.6;
  padding: 1rem;
}

.no-appointments p {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .app-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .right-panel {
    display: none;
  }

  .app-container.fullscreen {
    grid-template-columns: 1fr;
  }
}
</style>