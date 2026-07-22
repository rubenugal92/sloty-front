<template>
  <div class="calendar">
    <!-- HEADER -->
    <header class="calendar-header">
      <button @click="previousMonth" class="nav-btn" aria-label="Mes anterior">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <div class="calendar-title">
        <span class="title-month">{{ monthLabel }}</span>
        <span class="title-year">{{ yearLabel }}</span>
      </div>

      <div class="header-actions">
        <button @click="goToToday" class="btn btn-ghost btn-sm">Hoy</button>
        <button @click="nextMonth" class="nav-btn" aria-label="Mes siguiente">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </header>

    <!-- WEEKDAYS -->
    <div class="weekdays">
      <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
    </div>

    <!-- GRID -->
    <div class="days-grid">
      <button
        v-for="(cell, index) in calendarDays"
        :key="index"
        type="button"
        :class="['day', {
          empty: !cell,
          today: isToday(cell),
          selected: isSelected(cell),
          'has-appointments': hasAppointments(cell)
        }]"
        :disabled="!cell"
        @click="cell && selectDay(cell)"
      >
        <template v-if="cell">
          <span class="day-number">{{ cell }}</span>

          <ul v-if="hasAppointments(cell)" class="day-pills">
            <li
              v-for="ap in getDayPreview(cell)"
              :key="ap.id"
              class="day-pill"
              :title="`${ap.user_name || 'Empleado'} · ${formatTime(ap.datetime)}`"
            >
              <span class="pill-time">{{ formatTime(ap.datetime) }}</span>
              <span class="pill-name">{{ shortName(ap.user_name) }}</span>
            </li>
            <li v-if="getAppointmentCount(cell) > 3" class="day-pill more">
              +{{ getAppointmentCount(cell) - 3 }}
            </li>
          </ul>
        </template>
      </button>
    </div>

    <!-- FULLSCREEN BUTTON -->
    <button
      class="fullscreen-toggle"
      @click="$emit('toggle-fullscreen')"
      :title="isFullscreen ? 'Salir de pantalla completa' : 'Ampliar'"
    >
      <i v-if="isFullscreen" class="ri-fullscreen-exit-line"></i>
      <i v-else class="ri-fullscreen-line"></i>
    </button>

    <!-- APPOINTMENTS -->
    <div class="appointments-list">
      <div class="list-header">
        <h3 v-if="selectedDayData">{{ selectedDayData }}</h3>
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
          @click="$emit('appointment-selected', appointment)"
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
            <span :class="['status-badge', 'status-' + appointment.status]">
              {{ statusLabel(appointment.status) }}
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

      <div v-else-if="selectedDayData" class="no-appointments">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <p>No hay citas para este día</p>
      </div>

      <div v-else class="no-appointments faint">
        <p>Selecciona un día del calendario para ver sus citas.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Calendar',
  props: {
    appointments: { type: Array, default: () => [] },
    loading: Boolean,
    isFullscreen: Boolean
  },
  emits: ['appointment-selected', 'date-selected', 'toggle-fullscreen'],

  setup(props, { emit }) {

    const currentDate = ref(new Date())
    const selectedDay = ref(null)

    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    const monthLabel = computed(() =>
      currentDate.value.toLocaleDateString('es-ES', { month: 'long' })
        .replace(/^\w/, c => c.toUpperCase())
    )

    const yearLabel = computed(() => currentDate.value.getFullYear())

    const statusLabel = (status) => ({
      confirmed: 'Confirmada',
      pending:   'Pendiente',
      cancelled: 'Cancelada'
    }[status] || status)

    const goToToday = () => {
      currentDate.value = new Date()
      const today = new Date()
      selectedDay.value = today.getDate()
      emit('date-selected', getDateString(today.getDate()))
    }

    const year = computed(() => currentDate.value.getFullYear())
    const month = computed(() => currentDate.value.getMonth())

    // 🔥 CALENDARIO REAL
    const calendarDays = computed(() => {
      const firstDay = new Date(year.value, month.value, 1)

      let startDay = firstDay.getDay() - 1
      if (startDay < 0) startDay = 6

      const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()

      const cells = []

      for (let i = 0; i < startDay; i++) {
        cells.push(null)
      }

      for (let d = 1; d <= daysInMonth; d++) {
        cells.push(d)
      }

      return cells
    })

    const getDateString = (day) => {
      const m = String(month.value + 1).padStart(2, '0')
      const d = String(day).padStart(2, '0')
      return `${year.value}-${m}-${d}`
    }

    const isToday = (day) => {
      if (!day) return false
      const t = new Date()
      return (
        day === t.getDate() &&
        month.value === t.getMonth() &&
        year.value === t.getFullYear()
      )
    }

    const isSelected = (day) => selectedDay.value === day

    const selectDay = (day) => {
      selectedDay.value = day
      emit('date-selected', getDateString(day))
    }

    const dayAppointments = (day) => {
      if (!day) return []
      const ds = getDateString(day)
      return props.appointments
        .filter(a => a.datetime.startsWith(ds))
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    }

    const hasAppointments = (day) => dayAppointments(day).length > 0
    const getAppointmentCount = (day) => dayAppointments(day).length
    const getDayPreview = (day) => dayAppointments(day).slice(0, 3)

    const shortName = (name) => {
      if (!name) return '—'
      const parts = name.trim().split(/\s+/)
      return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0]
    }

    const selectedDayData = computed(() => {
      if (!selectedDay.value) return null

      const date = new Date(getDateString(selectedDay.value))

      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).replace(/^\w/, c => c.toUpperCase())
    })

    const appointmentsForSelectedDay = computed(() => {
      if (!selectedDay.value) return []

      const ds = getDateString(selectedDay.value)

      return props.appointments
        .filter(a => a.datetime.startsWith(ds))
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    })

    const formatTime = (datetime) =>
      new Date(datetime).toLocaleTimeString('es-ES', {
        timeZone: 'Europe/Madrid',
        hour: '2-digit',
        minute: '2-digit'
      })

    const previousMonth = () => {
      currentDate.value = new Date(year.value, month.value - 1)
      selectedDay.value = null
    }

    const nextMonth = () => {
      currentDate.value = new Date(year.value, month.value + 1)
      selectedDay.value = null
    }

    return {
      currentDate,
      monthLabel,
      yearLabel,
      weekDays,
      calendarDays,
      previousMonth,
      nextMonth,
      goToToday,
      isToday,
      isSelected,
      selectDay,
      hasAppointments,
      getAppointmentCount,
      getDayPreview,
      shortName,
      selectedDayData,
      appointmentsForSelectedDay,
      formatTime,
      statusLabel
    }
  }
}
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
}

/* ---------- header ---------- */
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.calendar-title {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}
.title-month {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.015em;
}
.title-year {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--surface);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out);
}
.nav-btn:hover {
  background: var(--primary-50);
  color: var(--primary-700);
  border-color: var(--primary-200);
}

/* ---------- grid ---------- */
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
  margin-bottom: 4px;
}

.weekday {
  text-align: center;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 0.4rem 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}

.day {
  min-height: 86px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 4px;
  padding: 0.4rem 0.45rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text-primary);
  cursor: pointer;
  font: inherit;
  text-align: left;
  overflow: hidden;
  transition: background var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.day:hover:not(.empty):not(:disabled) {
  border-color: var(--primary-300);
  background: var(--primary-50);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.day.empty {
  border: none;
  background: transparent;
  cursor: default;
}

.day.today {
  border-color: var(--primary-500);
  background: linear-gradient(180deg, var(--primary-50), white);
  color: var(--primary-700);
  font-weight: 700;
}

.day.selected {
  background: linear-gradient(180deg, var(--primary-600), var(--primary-700));
  border-color: var(--primary-700);
  color: white;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  transform: translateY(-1px);
}
.day.selected .day-pill {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}
.day-number {
  position: relative;
  font-size: 0.78rem;
  line-height: 1;
  font-weight: 600;
  align-self: flex-end;
  color: var(--text-secondary);
}

.day.today .day-number,
.day.selected .day-number { color: inherit; }

.day-pills {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.day-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--primary-50);
  color: var(--primary-700);
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1.3;
  min-width: 0;
  overflow: hidden;
}

.pill-time {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  flex-shrink: 0;
}

.pill-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  font-weight: 500;
  opacity: 0.85;
}

.day-pill.more {
  background: var(--surface-subtle);
  color: var(--text-muted);
  font-size: 0.6rem;
  justify-content: center;
}

.day.selected .day-pill {
  background: rgba(255, 255, 255, 0.22);
  color: white;
}
.day.selected .day-pill.more {
  background: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.85);
}

/* ---------- fullscreen button ---------- */
.fullscreen-toggle {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: #4338ca;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 100;
  transition: background 0.2s, transform 0.2s;
}

.fullscreen-toggle:hover {
  background: #3730a3;
  transform: scale(1.05);
}

.fullscreen-toggle i {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ---------- list ---------- */
.appointments-list {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-bottom: 0.75rem;
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
  gap: 0.65rem;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
}

.appointment-card {
  position: relative;
  padding: 0.9rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  margin-left: 0.75rem;
  padding: 0.5rem 0.65rem;
  background: var(--warning-50);
  border-left: 3px solid var(--warning-500);
  border-radius: 6px;
  font-size: 0.82rem;
  color: var(--text-secondary);
}
.appointment-notes strong { color: var(--warning-700); font-weight: 600; }

.appointment-id {
  margin-left: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: var(--text-muted);
}
.id-label {
  background: var(--primary-50);
  color: var(--primary-700);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.appointment-id code {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-secondary);
  word-break: break-all;
}

.no-appointments {
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}
.no-appointments p { color: var(--text-muted); font-size: 0.9rem; }
.no-appointments.faint { padding: 1.5rem 1rem; }

@media (max-width: 700px) {
  .day { min-height: 70px; padding: 0.3rem; }
  .pill-name { display: none; }
  .day-pill { justify-content: center; padding: 1px 3px; }
}
@media (max-width: 480px) {
  .day { min-height: 56px; }
  .day-number { font-size: 0.72rem; }
}
</style>