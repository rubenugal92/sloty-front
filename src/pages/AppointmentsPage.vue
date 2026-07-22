<template>
  <div class="app-container" :class="{ fullscreen: isFullscreen }">

    <div class="left-panel">
      <div class="calendar-wrapper">
        <Calendar
          :appointments="store.items"
          @appointment-selected="store.select"
          @date-selected="onDateSelected"
        />
        <button
          class="fullscreen-toggle"
          @click="isFullscreen = !isFullscreen"
          :title="isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'"
        >
          <i v-if="isFullscreen" class="ri-fullscreen-exit-line"></i>
          <i v-else class="ri-fullscreen-line"></i>
        </button>
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

onMounted(() => {
  store.load()
})

const onDateSelected = (date) => {
  selectedDate.value = date
}

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
}

.app-container.fullscreen {
  grid-template-columns: 1fr;
}

.left-panel {
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
}

.calendar-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

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

.right-panel {
  display: flex;
  flex-direction: column;
  overflow: auto;
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