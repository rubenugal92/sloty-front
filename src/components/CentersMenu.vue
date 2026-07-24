<template>
  <div v-if="showMenu" class="centers-menu-container">
    <button class="menu-toggle" @click="toggleMenu" title="Gestionar centros">
      <i class="ri-settings-3-line"></i>
      <span>Centros</span>
    </button>

    <div v-if="menuOpen" class="menu-dropdown">
      <div class="menu-header">
        <h4>Gestionar centros</h4>
        <button class="btn-close" @click="toggleMenu">&times;</button>
      </div>

      <div class="menu-content">
        <!-- Lista de centros -->
        <div v-if="centersStore.items.length" class="centers-list">
          <div v-for="center in centersStore.items" :key="center.id" class="center-item">
            <div class="center-info">
              <span class="center-name">{{ center.name }}</span>
              <span v-if="center.id === centersStore.selectedCenterId" class="selected-badge">Seleccionado</span>
              <span v-if="center.whatsapp_phone_number_id" class="whatsapp-badge">🟢 WhatsApp conectado</span>
            </div>
            <div class="center-actions">
              <button class="btn-icon btn-whatsapp" @click="connectWhatsApp(center)" title="Configurar WhatsApp" :disabled="connecting">
                <img src="../../img/logoWhatsapp.png" alt="WhatsApp" class="whatsapp-icon-small" />
              </button>
              <button class="btn-icon" @click="editCenter(center)" title="Editar">
                <i class="ri-pencil-line"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>Sin centros. Crea uno.</p>
        </div>

        <button class="btn btn-primary btn-create" @click="startCreate">
          + Nuevo centro
        </button>
      </div>
    </div>

    <!-- Modal crear/editar -->
    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ editing.id ? 'Editar centro' : 'Nuevo centro' }}</h3>
          <button class="btn-close" @click="closeForm">&times;</button>
        </div>

        <form @submit.prevent="save" class="form-grid">
          <div class="form-group">
            <label>Nombre del centro</label>
            <input v-model="editing.name" type="text" required placeholder="Ej: Centro A, Sucursal Madrid" />
          </div>

          <div class="form-group">
            <label>Dirección</label>
            <input v-model="editing.address" type="text" placeholder="Ej: Calle Principal, 123" />
          </div>

          <div class="form-group">
            <label>Teléfono de contacto</label>
            <input v-model="editing.phone" type="tel" placeholder="+34 600 000 000" />
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
            <button type="button" class="btn btn-secondary" @click="closeForm" :disabled="saving">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal WhatsApp -->
    <div v-if="showWhatsappModal" class="modal-overlay" @click.self="closeWhatsappModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Activar WhatsApp Bot</h3>
          <button class="btn-close" @click="closeWhatsappModal">&times;</button>
        </div>

        <div class="modal-body">
          <p>
            Antes de continuar, asegúrate de que el centro "<strong>{{ centerToConnect?.name }}</strong>" dispone de una cuenta
            <strong>WhatsApp Business</strong> asociada a un número de teléfono profesional.
          </p>

          <p class="modal-note">
            Este número será el que utilizará el bot para enviar y recibir mensajes en este centro.
          </p>

          <div v-if="error" class="alert alert-danger">{{ error }}</div>

          <div class="form-actions">
            <button class="btn btn-secondary" @click="closeWhatsappModal">
              Cancelar
            </button>

            <button class="btn btn-primary" @click="confirmWhatsappConnect" :disabled="connecting">
              {{ connecting ? 'Conectando…' : 'Continuar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCompaniesStore } from '../stores/companies'
import { useCentersStore } from '../stores/centers'
import { createCenter, updateCenter, connectWhatsApp as connectWhatsAppAPI } from '../api/appointments.js'

const auth = useAuthStore()
const companiesStore = useCompaniesStore()
const centersStore = useCentersStore()

const menuOpen = ref(false)
const showForm = ref(false)
const saving = ref(false)
const error = ref('')
const connecting = ref(false)
const showWhatsappModal = ref(false)
const centerToConnect = ref(null)

const emptyCenter = () => ({
  name: '',
  address: '',
  phone: '',
  whatsapp_phone_number_id: '',
  whatsapp_display_number: '',
  whatsapp_access_token: '',
})

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeForm = () => {
  showForm.value = false
  editing.value = null
  error.value = ''
}

const startCreate = () => {
  error.value = ''
  editing.value = emptyCenter()
  showForm.value = true
}

const editCenter = (center) => {
  error.value = ''
  editing.value = { ...center }
  showForm.value = true
}

const save = async () => {
  error.value = ''
  saving.value = true

  try {
    const companyId = companiesStore.selectedCompanyId || auth.user?.company_id
    if (!companyId) throw new Error('No company selected')

    const payload = {
      ...editing.value,
      company_id: companyId,
    }

    // Remove empty strings
    Object.keys(payload).forEach(k => {
      if (payload[k] === '') payload[k] = null
    })

    if (editing.value.id) {
      await updateCenter(editing.value.id, payload)
    } else {
      await createCenter(payload)
    }

    await centersStore.loadCenters(companyId)
    closeForm()
  } catch (e) {
    error.value = e.response?.data?.error || e.message || 'Error guardando centro'
  } finally {
    saving.value = false
  }
}

const connectWhatsApp = (center) => {
  centerToConnect.value = center
  showWhatsappModal.value = true
}

const closeWhatsappModal = () => {
  showWhatsappModal.value = false
  centerToConnect.value = null
}

const confirmWhatsappConnect = async () => {
  showWhatsappModal.value = false
  await startWhatsappConnection()
}

const startWhatsappConnection = async () => {
  try {
    connecting.value = true
    const companyId = companiesStore.selectedCompanyId || auth.user?.company_id
    const centerId = centerToConnect.value?.id
    const data = await connectWhatsAppAPI(companyId, centerId)
    window.location.href = data.url
  } catch (e) {
    error.value = e.response?.data?.error || e.message || 'No se pudo iniciar la conexión con WhatsApp'
  } finally {
    connecting.value = false
    centerToConnect.value = null
  }
}

onMounted(() => {
  const companyId = companiesStore.selectedCompanyId || auth.user?.company_id
  if (companyId && !centersStore.items.length) {
    centersStore.loadCenters(companyId)
  }
})

watch(() => companiesStore.selectedCompanyId, (companyId) => {
  if (companyId) {
    centersStore.loadCenters(companyId)
  }
})
</script>

<style scoped>
.centers-menu-container {
  position: relative;
}

.menu-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  color: #475569;
  font-size: 0.85rem;
  transition: all 0.2s;
  white-space: nowrap;
}

.menu-toggle:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.menu-toggle i {
  font-size: 0.9rem;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
  z-index: 100;
  min-width: 320px;
  max-width: 380px;
  margin-top: 8px;
  overflow: hidden;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafbfc;
}

.menu-header h4 {
  margin: 0;
  font-size: 0.95rem;
  color: #0f172a;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  line-height: 1;
}

.btn-close:hover {
  color: #0f172a;
}

.menu-content {
  padding: 12px 0;
  max-height: 400px;
  overflow-y: auto;
}

.centers-list {
  display: flex;
  flex-direction: column;
}

.center-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #f1f5f9;
  gap: 8px;
}

.center-item:hover {
  background: #fafbfc;
}

.center-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.center-name {
  font-weight: 500;
  color: #0f172a;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-badge {
  display: inline-block;
  background: #eef2ff;
  color: #4338ca;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  width: fit-content;
}

.whatsapp-badge {
  display: inline-block;
  background: #dcfce7;
  color: #15803d;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  width: fit-content;
}

.center-actions {
  display: flex;
  gap: 6px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-size: 0.95rem;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-icon.btn-danger:hover {
  background: #fee2e2;
  color: #b91c1c;
}

.btn-icon.btn-whatsapp {
  color: #25d366;
}

.btn-icon.btn-whatsapp:hover:not(:disabled) {
  background: #dcfce7;
}

.btn-icon.btn-whatsapp:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.whatsapp-icon-small {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.empty-state {
  padding: 16px;
  text-align: center;
  color: #64748b;
  font-size: 0.85rem;
}

.btn-create {
  width: calc(100% - 32px);
  margin: 12px 16px 0;
  font-size: 0.85rem;
  padding: 8px 12px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-card {
  background: white;
  border-radius: 14px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #0f172a;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.4;
  margin: 0 0 12px;
}

.modal-note {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 8px !important;
}

.form-grid {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #0f172a;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4338ca;
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.15);
}

.section-title {
  margin: 12px 0 8px 0;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.hint {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 4px;
}

.alert {
  padding: 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin: 0;
}

.alert-danger {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.form-actions {
  display: flex;
  gap: 8px;
  padding-top: 8px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  flex: 1;
}

.btn-primary {
  background: #4338ca;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #3730a3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .menu-dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    right: 0;
    max-width: calc(100% - 32px);
    width: 100%;
    margin-top: 0;
  }

  .modal-card {
    max-width: calc(100% - 32px);
  }
}
</style>
