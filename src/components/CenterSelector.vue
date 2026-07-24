<template>
  <div v-if="showSelector" class="center-selector-container">
    <label for="center-select" class="selector-label">
      <span class="selector-icon">📍</span>
      Centro
    </label>
    <select
      id="center-select"
      v-model.number="selectedId"
      @change="handleCenterChange"
      class="center-select"
      :disabled="centersStore.loading || !centersStore.items.length"
    >
      <option v-if="centersStore.loading" :value="null">Cargando…</option>
      <option v-else-if="!centersStore.items.length" :value="null">Sin centros</option>
      <option
        v-for="center in centersStore.items"
        :key="center.id"
        :value="center.id"
      >
        {{ center.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCompaniesStore } from '../stores/companies'
import { useCentersStore } from '../stores/centers'

const auth = useAuthStore()
const companiesStore = useCompaniesStore()
const centersStore = useCentersStore()

const selectedId = ref(centersStore.selectedCenterId ?? null)

const showSelector = computed(() => {
  return auth.isSuperAdmin || auth.isAdmin
})

const ensureLoaded = async () => {
  if (!showSelector.value) return
  
  const companyId = companiesStore.selectedCompanyId || auth.user?.company_id
  if (!companyId) return

  if (!centersStore.items.length && !centersStore.loading) {
    await centersStore.loadCenters(companyId)
  }
  
  if (!selectedId.value && centersStore.items.length) {
    selectedId.value = centersStore.selectedCenterId ?? centersStore.items[0].id
    centersStore.selectCenter(selectedId.value)
    auth.setSelectedCenterId(selectedId.value)
  }
}

onMounted(ensureLoaded)
watch(() => companiesStore.selectedCompanyId, ensureLoaded)
watch(() => centersStore.selectedCenterId, (id) => {
  if (id !== selectedId.value) selectedId.value = id
})

const handleCenterChange = () => {
  if (!selectedId.value) return
  centersStore.selectCenter(selectedId.value)
  auth.setSelectedCenterId(selectedId.value)
}
</script>

<style scoped>
.center-selector-container {
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

.center-select {
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

.center-select:hover:not(:disabled) {
  border-color: #4338ca;
}

.center-select:focus {
  outline: none;
  border-color: #4338ca;
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.15);
}

.center-select:disabled {
  background-color: #f8fafc;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
