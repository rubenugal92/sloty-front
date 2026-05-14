<template>
  <div id="app" class="app-shell">
    <Navbar v-if="showNavbar" />

    <main class="page-content">
      <router-view />
    </main>

    <Footer />
    <CookieConsent />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CookieConsent from './components/CookieConsent.vue'

const route = useRoute()

const hiddenNavbarRoutes = [
  '/login',
  '/privacy-policy',
  '/cookies-policy',
  '/terms-conditions'
]

const showNavbar = computed(() => {
  return !hiddenNavbarRoutes.includes(route.path)
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

.page-content {
  flex: 1;
}
</style>