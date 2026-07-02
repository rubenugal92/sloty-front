<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2>Empresas</h2>
        <p>Gestiona las empresas y sus credenciales de WhatsApp Business.</p>
      </div>
      <button class="btn btn-primary" @click="startCreate">+ Nueva empresa</button>
    </div>

    <div v-if="editing" class="card form-card">
      <h3>{{ editing.id ? 'Editar empresa' : 'Nueva empresa' }}</h3>
      <form @submit.prevent="save" class="form-grid">
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="editing.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Código de empresa</label>
          <input v-model="editing.company_code" type="text" required :disabled="!!editing.id" />
        </div>
        <div class="form-group">
          <label>Email de contacto</label>
          <input v-model="editing.contact_email" type="email" />
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
          <small class="hint">Token permanente de Meta para esta WABA.</small>
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

    <div class="companies-grid" v-if="!editing">
      <article v-for="c in companies" :key="c.id" class="company-card">
        <header>
          <h3>{{ c.name }}</h3>
          <span class="code-pill">{{ c.company_code }}</span>
        </header>
        <ul class="info">
          <li v-if="c.contact_email"><strong>Email:</strong> {{ c.contact_email }}</li>
          <li v-if="c.phone"><strong>Tel.:</strong> {{ c.phone }}</li>
          <li>
            <strong>WhatsApp:</strong>
            <span v-if="c.whatsapp_phone_number_id" class="waba-ok">✓ configurado</span>
            <span v-else class="waba-ko">— sin configurar</span>
          </li>
          <li v-if="c.whatsapp_display_number" class="muted">{{ c.whatsapp_display_number }}</li>
        </ul>
        <div class="company-actions">
          <button class="btn btn-secondary btn-sm" @click="edit(c)">Editar</button>
          <button class="btn btn-primary btn-sm" @click="connect(c)">Conectar WhatsApp</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCompaniesStore } from '../stores/companies'
import { createCompany, updateCompany, connectWhatsApp } from '../api/appointments.js'

const route = useRoute()
const store = useCompaniesStore()
const companies = computed(() => store.items)

const editing = ref(null)
const saving = ref(false)
const error = ref('')

const empty = () => ({
  name: '', company_code: '', contact_email: '', phone: '',
  whatsapp_phone_number_id: '', whatsapp_access_token: '', whatsapp_display_number: '',
})

const startCreate = () => { error.value = ''; editing.value = empty() }
const edit = (c) => { error.value = ''; editing.value = { ...empty(), ...c } }

const connect = async (company) => {
  try {
    const data = await connectWhatsApp(company.id)
    window.location.href = data.url
  } catch (e) {
    error.value = e.response?.data?.error || e.message || 'Error iniciando la conexión'
  }
}

const save = async () => {
  error.value = ''
  saving.value = true
  try {
    const payload = { ...editing.value }
    Object.keys(payload).forEach(k => { if (payload[k] === '') payload[k] = null })

    if (editing.value.id) {
      await updateCompany(editing.value.id, payload)
    } else {
      await createCompany(payload)
    }
    await store.loadCompanies()
    editing.value = null
  } catch (e) {
    error.value = e.response?.data?.error || e.message || 'Error guardando'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  store.loadCompanies()
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

.companies-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.company-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; box-shadow: var(--shadow-sm); }
.company-card header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
.company-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.company-card h3 { margin: 0; font-size: 1.05rem; }
.code-pill { background: var(--primary-50); color: var(--primary-700); padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
.info { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.85rem; color: var(--text-secondary); }
.info .muted { color: var(--text-muted); font-size: 0.78rem; }
.waba-ok { color: var(--success-700); font-weight: 600; }
.waba-ko { color: var(--text-muted); }

@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
</style>
