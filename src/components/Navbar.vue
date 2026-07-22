<template>
  <header class="navbar">
    
    <div class="nav-container">

      <div class="nav-brand">
        <h1>Sloty</h1>
      </div>

        <nav class="nav-menu" aria-label="Navegación principal">
         <button
           class="nav-button"
           :class="{ active: route.path === '/calendario' }"
           @click="go('/calendario')"
         >
          <i class="ri-calendar-schedule-line"></i>
           <span>Citas</span>
         </button>

         <button
           v-if="isAdmin"
           class="nav-button"
           :class="{ active: route.path === '/usuarios' }"
           @click="go('/usuarios')"
         >
           <i class="ri-group-line"></i>
           <span>Empleados</span>
         </button>

         <button
           class="nav-button"
           :class="{ active: route.path === '/planning' }"
           @click="go('/planning')"
         >
           <i class="ri-calendar-2-line"></i>
           <span>Planning</span>
         </button>

         <button
           v-if="auth.isSuperAdmin"
           class="nav-button"
           :class="{ active: route.path === '/empresas' }"
           @click="go('/empresas')"
         >
           <i class="ri-building-line"></i>
           <span>Empresas</span>
         </button>

         <button
           v-if="canConnectWhatsapp"
           class="nav-button"
           @click="handleConnectWhatsApp"
           :disabled="connecting"
         >
        <span class="nav-icon">
         <img src="../../img/logoWhatsapp.png" alt="WhatsApp" class="whatsapp-icon" />
       </span>
           <span>{{ connecting ? 'Conectando…' : 'Activar bot WhatsApp' }}</span>
         </button>
        </nav>

      <div class="nav-user">
        <NotificationBell />
        <div class="user-chip" :title="user?.email || ''">
          <div class="user-avatar">{{ initials }}</div>
          <div class="user-meta">
            <span class="user-name">{{ user?.username || 'Usuario' }}</span>
            <span class="user-role">{{ roleLabel }}</span>
          </div>
        </div>

        <button class="btn-logout" @click="handleLogout" title="Cerrar sesión">
          <span>Salir</span>
        </button>
      </div>

    </div>

    <div v-if="auth.isSuperAdmin" class="nav-workspace">
      <div class="nav-workspace-inner">
        <CompanySelector />
      </div>
    </div>
    <!-- MODAL WHATSAPP INFO -->
<div v-if="showWhatsappModal" class="modal-overlay" @click.self="closeWhatsappModal">
  <div class="modal">
    <h3>Activar WhatsApp Bot</h3>

    <p>
      Antes de continuar, asegúrate de que tu empresa dispone de una cuenta
      <strong>WhatsApp Business</strong> asociada a un número de teléfono profesional.
    </p>

    <p class="modal-note">
      Este número será el que utilizará el bot para enviar y recibir mensajes.
    </p>

    <div class="modal-actions">
      <button class="btn-secondary" @click="closeWhatsappModal">
        Cancelar
      </button>

      <button class="btn-primary" @click="confirmWhatsappConnect">
        Continuar
      </button>
    </div>
  </div>
</div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUser, logout, connectWhatsApp } from '../api/appointments.js'
import { useAuthStore } from '../stores/auth'
import { useFullscreenStore } from '../stores/fullscreen'
import { useCompaniesStore } from '../stores/companies'
import { useAppointmentsStore } from '../stores/appointments'
import { useUsersStore } from '../stores/users'
import CompanySelector from './CompanySelector.vue'
import NotificationBell from './NotificationBell.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const fullscreenStore = useFullscreenStore()
const companies = useCompaniesStore()
const appointments = useAppointmentsStore()
const users = useUsersStore()

const user = ref(null)
const isAdmin = computed(() => auth.isAdmin)
const canConnectWhatsapp = computed(() => auth.isAdmin || auth.isSuperAdmin)
const connecting = ref(false)

const roleLabel = computed(() => {
  if (auth.user?.role === 'superadmin') return 'Superadmin'
  if (auth.user?.role === 'admin') return 'Admin'
  return 'Usuario'
})

const initials = computed(() => {
  const source = auth.user?.name || auth.user?.username || auth.user?.email || '?'
  return source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('') || '?'
})

const go = (path) => {
  router.push(path)
}

const handleLogout = () => {
  logout()
  auth.logout()
  router.push('/login')
}


const showWhatsappModal = ref(false)

const handleConnectWhatsApp = () => {
  showWhatsappModal.value = true
}

const closeWhatsappModal = () => {
  showWhatsappModal.value = false
}

const confirmWhatsappConnect = async () => {
  showWhatsappModal.value = false
  await startWhatsappConnection()
}

const startWhatsappConnection = async () => {
  try {
    connecting.value = true

    const companyId = companies.selectedCompanyId || auth.user?.company_id
    const data = await connectWhatsApp(companyId)

    window.location.href = data.url
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.error || error.message || 'No se pudo iniciar la conexión con WhatsApp')
  } finally {
    connecting.value = false
  }
}
onMounted(async () => {
  user.value = getUser()

  if (auth.isAuthenticated) {
    appointments.setupCompanyChangeListener()
    users.setupCompanyChangeListener()

    if (auth.isSuperAdmin) {
      await companies.loadCompanies()
    }

    await appointments.load()
    await users.fetch()
  }
})
</script>

<style scoped>
.navbar {
  background: #ffffff;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
  position: sticky;
  top: 0;
  z-index: 20;
}

.nav-container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 2rem;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  padding: 0.75rem 1.5rem;
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #0f172a;
  white-space: nowrap;
}

.nav-menu {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.nav-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: none;
  color: #475569;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.15s, color 0.15s;
}

.nav-button:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.nav-button.active {
  background: #eef2ff;
  color: #4338ca;
}

.nav-button i {
  font-size: 1.2rem;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-self: end;
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.3rem 0.75rem 0.3rem 0.3rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  max-width: 220px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  min-width: 0;
}

.user-name {
  color: #0f172a;
  font-weight: 600;
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  color: #64748b;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.btn-logout {
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 0.5rem 0.95rem;
  background: white;
  color: #b91c1c;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: background 0.15s, border-color 0.15s;
}

.btn-logout:hover {
  background: #fef2f2;
  border-color: #fecaca;
}

.nav-workspace {
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  background: #fafbfc;
}

.nav-workspace-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.5rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (max-width: 900px) {
  .nav-container {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }

  .nav-menu {
    order: 2;
  }

  .nav-user {
    order: 3;
    justify-self: center;
  }

  .nav-workspace-inner {
    padding: 0.5rem 1rem;
    justify-content: center;
  }
}

@media (max-width: 520px) {
  .user-meta {
    display: none;
  }

  .user-chip {
    padding: 0.25rem;
  }
}
.nav-icon.green {
  color: #25D366; /* verde WhatsApp */
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: white;
  width: 100%;
  max-width: 420px;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.modal h3 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  color: #0f172a;
}

.modal p {
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.4;
}

.modal-note {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #64748b;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.btn-primary {
  background: #25D366;
  color: white;
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: #1fb85a;
}

.btn-secondary {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  cursor: pointer;
}
.whatsapp-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: none;
  transition: transform 0.15s ease;
}

.nav-button:hover .whatsapp-icon {
  transform: scale(1.1);
}
</style>
