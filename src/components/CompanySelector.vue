<template>
  <div class="company-selector-container" v-if="isSuperAdmin">
    <label for="company-select" class="selector-label">Empresa:</label>
    <select 
      id="company-select"
      v-model="selectedId"
      @change="handleCompanyChange"
      class="company-select"
      :disabled="loading"
    >
      <option value="" disabled>Cargando empresas...</option>
      <option 
        v-for="company in companies" 
        :key="company.id"
        :value="company.id"
      >
        {{ company.name }}
      </option>
    </select>
    <span v-if="loading" class="loading-spinner">⏳</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCompaniesStore } from '../stores/companies'

const auth = useAuthStore()
const companies = useCompaniesStore()

const loading = ref(false)
const selectedId = ref(null)

const isSuperAdmin = computed(() => auth.isSuperAdmin)

onMounted(async () => {
  if (isSuperAdmin.value) {
    loading.value = true
    await companies.loadCompanies()
    selectedId.value = companies.selectedCompanyId || (companies.items[0]?.id)
    loading.value = false
  }
})

const handleCompanyChange = () => {
  if (selectedId.value) {
    companies.selectCompany(parseInt(selectedId.value))
    auth.setSelectedCompanyId(parseInt(selectedId.value))
  }
}

watch(() => auth.isSuperAdmin, async (newVal) => {
  if (newVal) {
    loading.value = true
    await companies.loadCompanies()
    selectedId.value = companies.selectedCompanyId || (companies.items[0]?.id)
    loading.value = false
  }
})
</script>

<style scoped>
.company-selector-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 5px;
  margin-right: auto;
}

.selector-label {
  font-weight: 600;
  color: #333;
  margin: 0;
  white-space: nowrap;
}

.company-select {
  padding: 8px 12px;
  border: 2px solid #007bff;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background: white;
  min-width: 200px;
  transition: all 0.3s ease;
}

.company-select:hover:not(:disabled) {
  border-color: #0056b3;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.company-select:focus {
  outline: none;
  border-color: #0056b3;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.25);
}

.company-select:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.7;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
