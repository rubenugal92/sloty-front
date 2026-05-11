<template>
  <div v-if="isSuperAdmin" class="company-selector-container">
    <label for="company-select" class="selector-label">
      <span class="selector-icon">🏢</span>
      Empresa
    </label>
    <select
      id="company-select"
      v-model.number="selectedId"
      @change="handleCompanyChange"
      class="company-select"
      :disabled="companiesStore.loading || !companiesStore.items.length"
    >
      <option v-if="companiesStore.loading" :value="null">Cargando…</option>
      <option v-else-if="!companiesStore.items.length" :value="null">Sin empresas</option>
      <option
        v-for="company in companiesStore.items"
        :key="company.id"
        :value="company.id"
      >
        {{ company.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCompaniesStore } from '../stores/companies'

const auth = useAuthStore()
const companiesStore = useCompaniesStore()

const selectedId = ref(companiesStore.selectedCompanyId ?? null)

const isSuperAdmin = computed(() => auth.isSuperAdmin)

const ensureLoaded = async () => {
  if (!isSuperAdmin.value) return
  if (!companiesStore.items.length && !companiesStore.loading) {
    await companiesStore.loadCompanies()
  }
  if (!selectedId.value && companiesStore.items.length) {
    selectedId.value = companiesStore.selectedCompanyId ?? companiesStore.items[0].id
    companiesStore.selectCompany(selectedId.value)
    auth.setSelectedCompanyId(selectedId.value)
  }
}

onMounted(ensureLoaded)
watch(() => auth.isSuperAdmin, ensureLoaded)
watch(() => companiesStore.selectedCompanyId, (id) => {
  if (id !== selectedId.value) selectedId.value = id
})

const handleCompanyChange = () => {
  if (!selectedId.value) return
  companiesStore.selectCompany(selectedId.value)
  auth.setSelectedCompanyId(selectedId.value)
}
</script>

<style scoped>
.company-selector-container {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
}

.selector-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #475569;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
  white-space: nowrap;
}

.selector-icon {
  font-size: 0.95rem;
}

.company-select {
  padding: 6px 28px 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  min-width: 180px;
  color: #0f172a;
  font-weight: 500;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%2364748b' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.company-select:hover:not(:disabled) {
  border-color: #4338ca;
}

.company-select:focus {
  outline: none;
  border-color: #4338ca;
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.15);
}

.company-select:disabled {
  background-color: #f8fafc;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
