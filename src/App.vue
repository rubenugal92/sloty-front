<template>
  <div id="app" class="app-shell" :class="{ fullscreen: fullscreenStore.isFullscreen }">
    <Navbar v-if="showNavbar" />

    <main class="page-content">
      <router-view />
    </main>

    <Footer v-if="!fullscreenStore.isFullscreen" />
    <CookieConsent v-if="!fullscreenStore.isFullscreen" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useNotificationsStore } from './stores/notifications'
import { useFullscreenStore } from './stores/fullscreen'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CookieConsent from './components/CookieConsent.vue'

const route = useRoute()
const auth = useAuthStore()
const notificationsStore = useNotificationsStore()
const fullscreenStore = useFullscreenStore()

const hiddenNavbarRoutes = [
  '/login',
  '/privacy-policy',
  '/cookies-policy',
  '/terms-conditions'
]

const showNavbar = computed(() => {
  return !hiddenNavbarRoutes.includes(route.path)
})

onMounted(() => {
  // Initialize WebSocket if already authenticated
  if (auth.isAuthenticated && !notificationsStore.isConnected) {
    notificationsStore.initWebSocket()
  }
})
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-shell.fullscreen {
  height: 100vh;
}

.page-content {
  flex: 1;
}

.app-shell.fullscreen .page-content {
  height: 100vh;
  padding: 0;
  max-width: 100%;
}
</style>