<template>
  <div class="notification-bell-container">
    <button
      class="bell-button"
      @click="togglePanel"
      :title="`Notificaciones (${unreadCount})`"
    >
      <span class="bell-icon">🔔</span>
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </button>

    <!-- Panel desplegable de notificaciones -->
    <transition name="slide-down">
      <div v-if="showPanel" class="notification-panel">
        <div class="panel-header">
          <h3>Notificaciones</h3>
          <button
            v-if="notifications.length > 0"
            class="btn-mark-all"
            @click="markAllAsRead"
          >
            Marcar como leído
          </button>
        </div>

        <div class="panel-body">
          <div v-if="notifications.length === 0" class="empty-state">
            <span class="empty-icon">📭</span>
            <p>Sin notificaciones</p>
          </div>

          <div v-else class="notification-list">
            <div
              v-for="notif in notifications"
              :key="notif.id"
              class="notification-item"
              :class="{ unread: !notif.read }"
              @click="markAsRead(notif.id)"
            >
              <div class="notif-icon">
                <span v-if="notif.type === 'appointment_created'">✅</span>
                <span v-else-if="notif.type === 'appointment_deleted'">❌</span>
              </div>
              <div class="notif-content">
                <p class="notif-title">{{ notif.title }}</p>
                <p class="notif-desc">{{ notif.description }}</p>
                <p class="notif-time">{{ formatTime(notif.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useNotificationsStore } from '../stores/notifications'

const notifStore = useNotificationsStore()
const showPanel = ref(false)

const notifications = computed(() => notifStore.notifications)
const unreadCount = computed(() => notifStore.unreadCount)

const togglePanel = () => {
  showPanel.value = !showPanel.value
}

const markAsRead = (notifId) => {
  notifStore.markAsRead(notifId)
}

const markAllAsRead = () => {
  notifStore.markAllAsRead()
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `${diffMins}m`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`
  return date.toLocaleDateString('es-ES')
}

// Close panel on click outside
const handleClickOutside = (event) => {
  const container = document.querySelector('.notification-bell-container')
  if (container && !container.contains(event.target)) {
    showPanel.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  notifStore.initWebSocket()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  notifStore.disconnectWebSocket()
})
</script>

<style scoped>
.notification-bell-container {
  position: relative;
}

.bell-button {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  padding: 8px;
  transition: transform 0.2s;
}

.bell-button:hover {
  transform: scale(1.1);
}

.bell-icon {
  display: inline-block;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
}

.notification-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 360px;
  max-height: 500px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.btn-mark-all {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-mark-all:hover {
  background: #f0f0f0;
}

.panel-body {
  overflow-y: auto;
  flex: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: #f9f9f9;
}

.notification-item.unread {
  background: #f0f8ff;
  border-left: 4px solid #007bff;
  padding-left: 12px;
}

.notif-icon {
  font-size: 20px;
  flex-shrink: 0;
  padding-top: 2px;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.notif-desc {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notif-time {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #999;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 600px) {
  .notification-panel {
    width: 90vw;
    max-width: calc(100vw - 20px);
    right: -50%;
    transform: translateX(50%);
  }
}
</style>
