<template>
  <div class="auth-page">
    <!-- Decorative background -->
    <div class="auth-bg" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="grid-pattern"></div>
    </div>

    <div class="auth-shell">
      <!-- Brand panel -->
      <aside class="brand-panel">
        <div class="brand-top">
          <div class="brand-mark">BM</div>
          <span class="brand-name">Bot Manager</span>
        </div>

        <div class="brand-hero">
          <h1>Gestiona tu negocio<br/>como un <span class="hero-grad">profesional</span>.</h1>
          <p>Planning de plantilla, calendario de citas y bot de WhatsApp que atiende a tus clientes. Todo en uno.</p>

          <ul class="feature-list">
            <li><span class="dot"></span> Reservas automáticas por WhatsApp</li>
            <li><span class="dot"></span> Planning con vacaciones y bajas</li>
            <li><span class="dot"></span> Multi-empresa y multi-equipo</li>
          </ul>
        </div>

        <div class="brand-footer">
          © {{ year }} Bot Manager · Hecho con ♥ para negocios reales
        </div>
      </aside>

      <!-- Form panel -->
      <section class="form-panel">
        <div class="form-card">
          <header class="form-head">
            <h2>{{ isRegister ? 'Crear cuenta' : 'Bienvenido de vuelta' }}</h2>
            <p>{{ isRegister ? 'Configura tu acceso para empezar a gestionar tu plantilla.' : 'Introduce tus credenciales para acceder al panel.' }}</p>
          </header>

          <form @submit.prevent="handleSubmit" class="form" novalidate>
            <div v-if="isRegister" class="row-2">
              <div class="form-group">
                <label>Nombre de usuario</label>
                <input v-model="form.username" type="text" placeholder="juan.garcia" required />
              </div>
              <div class="form-group">
                <label>Nombre completo</label>
                <input v-model="form.name" type="text" placeholder="Juan García" required />
              </div>
            </div>

            <div class="form-group">
              <label>Correo electrónico</label>
              <input v-model="form.email" type="email" placeholder="tu@email.com" autocomplete="email" required />
            </div>

            <div class="form-group">
              <label>Contraseña</label>
              <input v-model="form.password" type="password" placeholder="••••••••" :autocomplete="isRegister ? 'new-password' : 'current-password'" required />
            </div>

            <div v-if="isRegister" class="form-group">
              <label>Teléfono</label>
              <input v-model="form.phone" type="tel" placeholder="+34 600 000 000" required />
            </div>

            <div v-if="isRegister" class="row-2">
              <div class="form-group">
                <label>Especialidades</label>
                <input v-model="form.specialties" type="text" placeholder="Color, masaje deportivo…" :disabled="loading" />
              </div>
              <div class="form-group">
                <label>Cargo / Puesto</label>
                <input v-model="form.type" type="text" placeholder="Peluquero, fisio, camarero…" :disabled="loading" />
              </div>
            </div>

            <transition name="fade">
              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>
            </transition>

            <button type="submit" class="btn btn-primary btn-lg btn-block" :disabled="loading">
              <span v-if="loading" class="spinner" aria-hidden="true"></span>
              {{ loading ? 'Procesando…' : (isRegister ? 'Crear cuenta' : 'Acceder') }}
            </button>

            <div class="divider"><span>o</span></div>

            <button type="button" class="btn btn-ghost btn-block" @click="toggleMode" :disabled="loading">
              {{ isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿Aún no tienes cuenta? Regístrate' }}
            </button>
          </form>
        </div>

        <p class="legal-note">
          Al continuar aceptas nuestros
          <router-link to="/terms-conditions">Términos</router-link> y
          <router-link to="/privacy-policy">Política de Privacidad</router-link>.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { login, register } from '../api/appointments.js'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  email: '',
  password: '',
  username: '',
  name: '',
  specialties: '',
  phone: '',
  type: ''
})

const isRegister = ref(false)
const loading = ref(false)
const error = ref('')
const year = computed(() => new Date().getFullYear())

const toggleMode = () => {
  isRegister.value = !isRegister.value
  error.value = ''
}

const handleSubmit = async () => {
  try {
    error.value = ''
    loading.value = true

    if (isRegister.value) {
      if (!form.value.username) {
        error.value = 'Por favor ingresa un nombre de usuario'
        return
      }
      await register(form.value.username, form.value.name, form.value.email, form.value.password, form.value.specialties, form.value.phone, form.value.type)
      isRegister.value = false
      form.value = { ...form.value, password: '' }
    } else {
      const data = await login(form.value.email, form.value.password)
      auth.login(data.token, data.user)
      await router.push('/calendario')
    }
  } catch (err) {
    error.value = err.response?.data?.error || err.message || 'No se ha podido procesar la solicitud.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(1200px 800px at 90% 10%, rgba(139, 92, 246, 0.18), transparent 60%),
    radial-gradient(900px 600px at 10% 90%, rgba(99, 102, 241, 0.22), transparent 55%),
    linear-gradient(180deg, #fafaff 0%, #f4f4ff 100%);
}

/* ---------- decorative ---------- */
.auth-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.55;
  animation: float 12s ease-in-out infinite;
}
.orb-1 { width: 340px; height: 340px; top: -80px; left: -60px; background: radial-gradient(circle, #818cf8, transparent 70%); }
.orb-2 { width: 280px; height: 280px; bottom: 10%; right: -80px; background: radial-gradient(circle, #a78bfa, transparent 70%); animation-delay: -3s; }
.orb-3 { width: 220px; height: 220px; top: 35%; left: 45%; background: radial-gradient(circle, #c7d2fe, transparent 70%); animation-delay: -6s; opacity: 0.35; }

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99, 102, 241, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(circle at 50% 30%, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(circle at 50% 30%, black 30%, transparent 70%);
}

/* ---------- shell ---------- */
.auth-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 0;
  max-width: 1200px;
  width: 100%;
  margin: auto;
  padding: 2rem;
  align-items: center;
}

/* ---------- brand panel ---------- */
.brand-panel {
  padding: 3rem;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 580px;
  animation: slideUp 0.6s var(--ease-out) both;
}

.brand-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
  color: white;
  display: grid;
  place-items: center;
  font-weight: 800;
  letter-spacing: -0.03em;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
}

.brand-name {
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
}

.brand-hero h1 {
  font-size: clamp(2rem, 4.2vw, 3rem);
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin-bottom: 1.25rem;
}

.hero-grad {
  background: linear-gradient(135deg, var(--primary-600), var(--accent-500));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.brand-hero p {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 460px;
  margin-bottom: 2rem;
}

.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
  flex-shrink: 0;
}

.brand-footer {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* ---------- form panel ---------- */
.form-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slideUp 0.6s 0.1s var(--ease-out) both;
}

.form-card {
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-xl);
}

.form-head {
  text-align: center;
  margin-bottom: 1.75rem;
}

.form-head h2 {
  font-size: 1.6rem;
  margin-bottom: 0.4rem;
}

.form-head p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-group label { margin-bottom: 0; }

.alert {
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid;
}
.alert-danger {
  background: var(--danger-50);
  color: var(--danger-700);
  border-color: rgba(239, 68, 68, 0.25);
}

.divider {
  position: relative;
  text-align: center;
  margin: 0.25rem 0;
}
.divider::before {
  content: "";
  position: absolute;
  inset: 50% 0 auto 0;
  height: 1px;
  background: var(--border);
}
.divider span {
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  padding: 0 0.75rem;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 500;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.legal-note {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
}

.legal-note a {
  font-weight: 600;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ---------- responsive ---------- */
@media (max-width: 960px) {
  .auth-shell {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  .brand-panel {
    padding: 1.5rem;
    min-height: auto;
    text-align: center;
    align-items: center;
  }
  .brand-top { justify-content: center; }
  .brand-hero p { margin-inline: auto; }
  .feature-list { align-items: flex-start; max-width: 320px; margin-inline: auto; }
  .brand-footer { display: none; }
}

@media (max-width: 540px) {
  .auth-shell { padding: 0.75rem; }
  .form-card { padding: 1.75rem; border-radius: var(--radius-xl); }
  .brand-hero h1 { font-size: 1.85rem; }
  .row-2 { grid-template-columns: 1fr; }
}
</style>
