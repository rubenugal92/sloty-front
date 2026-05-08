<template>
  <transition name="fade-up">
    <div v-if="showConsent" class="cookie-consent">
      <div class="cookie-content">
        <div class="cookie-text">
          <h3>🍪 Política de Cookies</h3>
          <p>
            Utilizamos cookies para mejorar tu experiencia en nuestra plataforma, 
            personalizar contenido y analizar nuestro tráfico. 
            <router-link to="/cookies-policy" class="cookie-link">
              Más información
            </router-link>
          </p>
        </div>

        <div class="cookie-actions">
          <button 
            @click="rejectCookies" 
            class="btn btn-reject"
          >
            Rechazar
          </button>
          <button 
            @click="acceptCookies" 
            class="btn btn-accept"
          >
            Aceptar Todo
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showConsent = ref(false)

const COOKIE_CONSENT_KEY = 'cookie-consent'
const CONSENT_EXPIRY_DAYS = 365

const checkConsent = () => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
  if (!consent) {
    showConsent.value = true
  }
}

const saveCookiePreference = (preference) => {
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS)
  
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
    preference,
    acceptedAt: new Date().toISOString(),
    expiresAt: expiryDate.toISOString()
  }))
}

const acceptCookies = () => {
  saveCookiePreference('accepted')
  showConsent.value = false
  
  // Aquí puedes inicializar Google Analytics u otros scripts de cookies
  initializeAnalytics()
}

const rejectCookies = () => {
  saveCookiePreference('rejected')
  showConsent.value = false
}

const initializeAnalytics = () => {
  // Ejemplo: inicializar Google Analytics si lo necesitas
  console.log('Cookies aceptadas - Inicializando analytics...')
  // Aquí irían scripts como Google Analytics
}

onMounted(() => {
  // Pequeño delay para que se vea la animación
  setTimeout(() => {
    checkConsent()
  }, 500)
})
</script>

<style scoped>
.cookie-consent {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-top: 1px solid #374151;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.3);
  z-index: 100;
  backdrop-filter: blur(10px);
}

.cookie-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.cookie-text h3 {
  color: #fff;
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 700;
}

.cookie-text p {
  color: #d1d5db;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.cookie-link {
  color: #60a5fa;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.cookie-link:hover {
  color: #93c5fd;
}

.cookie-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.btn {
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-reject {
  background: #374151;
  color: #fff;
  border: 1px solid #4b5563;
}

.btn-reject:hover {
  background: #4b5563;
  border-color: #6b7280;
}

.btn-accept {
  background: #3b82f6;
  color: #fff;
}

.btn-accept:hover {
  background: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

/* Animación de entrada suave */
.fade-up-enter-active {
  animation: slideUp 0.4s ease-out;
}

.fade-up-leave-active {
  animation: slideDown 0.3s ease-in;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .cookie-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .cookie-text p {
    font-size: 13px;
  }

  .cookie-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
    text-align: center;
  }

  .cookie-consent {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

@media (max-width: 480px) {
  .cookie-content {
    padding: 15px;
  }

  .cookie-text h3 {
    font-size: 14px;
  }

  .cookie-text p {
    font-size: 12px;
  }

  .btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
