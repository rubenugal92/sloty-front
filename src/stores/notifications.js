import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useAppointmentsStore } from './appointments'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    ws: null,
    isConnected: false,
  }),

  actions: {
    // Initialize WebSocket connection
    initWebSocket() {
      const auth = useAuthStore()
      if (!auth.isAuthenticated || !auth.user) {
        console.log('❌ WebSocket: Not authenticated or no user. Retrying in 2s...');
        // Reintentar si no está autenticado
        setTimeout(() => this.initWebSocket(), 2000)
        return
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      // Use VITE_API_URL for WebSocket (backend domain, not frontend)
      const apiUrl = import.meta.env.VITE_API_URL || window.location.origin
      const apiHost = new URL(apiUrl).host
      const wsUrl = `${protocol}//${apiHost}/ws?userId=${auth.user.id}&token=${auth.token}`
      console.log(`🔌 Attempting WebSocket connection: ${wsUrl}`);

      try {
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected (user:', auth.user.id, ')')
          this.isConnected = true
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            console.log('📨 WebSocket message received:', message.type);
            this.handleMessage(message)
          } catch (err) {
            console.error('Error parsing WebSocket message:', err)
          }
        }

        this.ws.onclose = () => {
          console.log('❌ WebSocket disconnected')
          this.isConnected = false
          // Reconnect after 3s
          setTimeout(() => this.initWebSocket(), 3000)
        }

        this.ws.onerror = (error) => {
          console.error('🔴 WebSocket error:', error)
          this.isConnected = false
        }
      } catch (err) {
        console.error('Error creating WebSocket:', err)
      }
    },

    handleMessage(message) {
      const { type, data, timestamp } = message
      const appointmentsStore = useAppointmentsStore()

      if (type === 'appointment_created') {
        this.addNotification({
          id: data.id,
          type: 'appointment_created',
          title: 'Nueva cita creada',
          description: `${data.customer_name} - ${new Date(data.datetime).toLocaleString('es-ES')}`,
          data,
          timestamp,
          read: false,
        })
        // Refetch appointments to sync calendar
        appointmentsStore.load()
      } else if (type === 'appointment_deleted') {
        this.addNotification({
          id: data.id,
          type: 'appointment_deleted',
          title: 'Cita eliminada',
          description: `Cita #${data.id} ha sido eliminada`,
          data,
          timestamp,
          read: false,
        })
        // Refetch appointments to sync calendar
        appointmentsStore.load()
      }
    },

    addNotification(notification) {
      this.notifications.unshift(notification)
      this.unreadCount++
      console.log(`📬 Notification: ${notification.title}`)
    },

    markAsRead(notificationId) {
      const notif = this.notifications.find((n) => n.id === notificationId)
      if (notif && !notif.read) {
        notif.read = true
        this.unreadCount = Math.max(0, this.unreadCount - 1)
      }
    },

    markAllAsRead() {
      this.notifications.forEach((n) => {
        n.read = true
      })
      this.unreadCount = 0
    },

    clearNotifications() {
      this.notifications = []
      this.unreadCount = 0
    },

    disconnectWebSocket() {
      if (this.ws) {
        this.ws.close()
        this.ws = null
        this.isConnected = false
      }
    },
  },

  getters: {
    unreadNotifications: (state) => state.notifications.filter((n) => !n.read),
  },
})
