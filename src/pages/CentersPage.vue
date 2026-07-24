<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2>Centros</h2>
        <p>Gestiona los centros de tu empresa y sus credenciales de WhatsApp Business.</p>
      </div>
      <button class="btn btn-primary" @click="startCreate">+ Nuevo centro</button>
    </div>

    <div v-if="editing" class="card form-card">
      <h3>{{ editing.id ? 'Editar centro' : 'Nuevo centro' }}</h3>
      <form @submit.prevent="save" class="form-grid">
        <div class="form-group">
          <label>Nombre del centro</label>
          <input v-model="editing.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Dirección</label>
          <input v-model="editing.address" type="text" />
        </div>
        <div class="form-group">
          <label>Teléfono de contacto</label>
          <input v-model="editing.phone" type="tel" />
        </div>

        <h4 class="section-title">WhatsApp Business (Meta)</h4>

        <div class="form-group">
          <label>Phone Number ID</label>
          <input v-model="editing.whatsapp_phone_number_id" type="text" placeholder="Ej: 1234567890" />
        </div>
        <div class="form-group">
          <label>Número visible (display)</label>
          <input v-model="editing.whatsapp_display_number" type="tel" placeholder="+34 600 000 000" />
        </div>
        <div class="form-group full">
          <label>Access Token</label>
          <input v-model="editing.whatsapp_access_token" type="password" placeholder="EAAB…" autocomplete="off" />
          <small class="hint">Token permanente de Meta para este centro.</small>
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Guardando…' : 'Guardar' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="editing = null" :disabled="saving">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="centers-grid" v-if="!editing">
      <article v-for="c in centers" :key="c.id" class="center-card">
        <header>
          <h3>{{ c.name }}</h3>
        </header>
        <ul class="info">
          <li v-if="c.address"><strong>Dirección:</strong> {{ c.address }}</li>
          <li v-if="c.phone"><strong>Tel.:</strong> {{ c.phone }}</li>
          <li>
            <strong>WhatsApp:</strong>
            <span v-if="c.whatsapp_phone_number_id" class="waba-ok">✓ configurado</span>
            <span v-else class="waba-ko">— sin configurar</span>
          </li>
          <li v-if="c.whatsapp_display_number" class="muted">{{ c.whatsapp_display_number }}</li>
          <li class="status-row">
            <span :class="['status-pill', connectionStateClass(c)]">{{ connectionLabel(c) }}</span>
          </li>
        </ul>
        <div class="center-actions">
          <button class="btn btn-secondary btn-sm" @click="edit(c)">Editar</button>
          <button class="btn btn-primary btn-sm" @click="connect(c)">{{ connectButtonLabel(c) }}</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCentersStore } from '../stores/centers'
import { useCompaniesStore } from '../stores/companies'
import { useAuthStore } from '../stores/auth'
import { createCenter, updateCenter, connectWhatsApp } from '../api/appointments.js'

const route = useRoute()
const centersStore = useCentersStore()
const companiesStore = useCompaniesStore()
const auth = useAuthStore()

const centers = computed(() => centersStore.items)

const editing = ref(null)
const saving = ref(false)
const error = ref('')

const empty = () => ({
  name: '', address: '', phone: '',
  whatsapp_phone_number_id: '', whatsapp_access_token: '', whatsapp_display_number: '',
})

const startCreate = () => { error.value = ''; editing.value = empty() }
const edit = (c) => { error.value = ''; editing.value = { ...empty(), ...c } }

const connectionLabel = (center) => {
  if (center.whatsapp_phone_number_id) return `🟢 Conectado${center.whatsapp_display_number ? ` al ${center.whatsapp_display_number}` : ''}`
  if (center.whatsapp_connection_status === 'reconnect') return '🟡 Requiere reconexión'
  return '🔴 No conectado'
}

const connectionStateClass = (center) => {
  if (center.whatsapp_phone_number_id) return 'connected'
  if (center.whatsapp_connection_status === 'reconnect') return 'reconnect'
  return 'disconnected'
}

const connectButtonLabel = (center) => {
  if (center.whatsapp_phone_number_id) return 'Cambiar cuenta de WhatsApp'
  if (center.whatsapp_connection_status === 'reconnect') return 'Reconectar WhatsApp'
  return 'Conectar WhatsApp'
}

const connect = async (center) => {
  try {
    const companyId = companiesStore.selectedCompanyId || auth.user?.company_id
    const data = await connectWhatsApp(companyId, center.id)
    window.location.href = data.url
  } catch (e) {
    error.value = e.response?.data?.error || e.message || 'Error iniciando la conexión'
  }
}

const save = async () => {
  error.value = ''
  saving.value = true
  try {
    const companyId = companiesStore.selectedCompanyId || auth.user?.company_id
    if (!companyId) throw new Error('No company selected')

    const payload = { ...editing.value, company_id: companyId }
    Object.keys(payload).forEach(k => { if (payload[k] === '') payload[k] = null })

    if (editing.value.id) {
      await updateCenter(editing.value.id, payload)
    } else {
      await createCenter(payload)
    }
    await centersStore.loadCenters(companyId)
    editing.value = null
  } catch (e) {
    error.value = e.response?.data?.error || e.message || 'Error guardando'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const companyId = companiesStore.selectedCompanyId || auth.user?.company_id
  if (companyId) {
    await centersStore.loadCenters(companyId)
  }
  if (route.query.whatsapp === 'connected') {
    error.value = 'WhatsApp conectado correctamente.'
  } else if (route.query.whatsapp === 'error') {
    error.value = route.query.message || 'No se pudo completar la conexión con WhatsApp.'
  }
})
</script>

<style scoped>
.form-card { padding: 1.5rem; margin-bottom: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-md); }
.form-card h3 { margin-bottom: 1rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-group.full { grid-column: 1 / -1; }
.section-title { grid-column: 1 / -1; margin-top: 0.5rem; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
.hint { color: var(--text-muted); font-size: 0.75rem; }
.alert { grid-column: 1 / -1; padding: 0.65rem; border-radius: var(--radius-md); font-size: 0.85rem; }
.alert-danger { background: var(--danger-50); color: var(--danger-700); }
.form-actions { grid-column: 1 / -1; display: flex; gap: 0.6rem; }
.form-actions .btn { flex: 1; }

.centers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.center-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; box-shadow: var(--shadow-sm); }
.center-card header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
.center-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.center-card h3 { margin: 0; font-size: 1.05rem; }
.info { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.85rem; color: var(--text-secondary); }
.info .muted { color: var(--text-muted); font-size: 0.78rem; }
.status-row { margin-top: 0.15rem; }
.status-pill { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.74rem; font-weight: 700; }
.status-pill.connected { background: #dcfce7; color: #166534; }
.status-pill.reconnect { background: #fef3c7; color: #92400e; }
.status-pill.disconnected { background: #fee2e2; color: #991b1b; }
.waba-ok { color: var(--success-700); font-weight: 600; }
.waba-ko { color: var(--text-muted); }

@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
</style>
