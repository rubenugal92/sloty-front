# Actualización Multi-Center - Resumen de Cambios

## ARCHIVOS CREADOS

### 1. `src/stores/centers.js` (NUEVO)
Store para gestionar centros:
- **State**: `items[]`, `selectedCenterId`, `loading`
- **Actions**: 
  - `loadCenters(companyId)` - Carga centros de una empresa
  - `selectCenter(centerId)` - Selecciona centro y dispara event 'center-changed'
  - `createCenter(centerData)` - Crea nuevo centro
  - `updateCenter(centerId, data)` - Actualiza centro
  - `deleteCenter(centerId)` - Elimina centro
- **Getters**: 
  - `selectedCenter` - Centro actualmente seleccionado
  - `centersByCompany(companyId)` - Filtra centros por empresa
- **Persistencia**: localStorage.selectedCenterId

### 2. `src/components/CenterSelector.vue` (NUEVO)
Dropdown selector para centros:
- Visible para `admin` y `superadmin`
- Se renderiza en navbar debajo de CompanySelector
- Carga automáticamente centros al cambiar company
- Igual estilo/UX que CompanySelector

---

## ARCHIVOS MODIFICADOS

### 3. `src/stores/auth.js`
```diff
+ state.selectedCenterId - localStorage
+ setSelectedCenterId(centerId) - nuevo action
+ logout() - limpia selectedCenterId
```

### 4. `src/stores/appointments.js`
```diff
+ import { useCentersStore }
+ load() ahora pasa centerId: getAppointments(companyId, centerId)
+ setupCompanyChangeListener() - también escucha 'center-changed'
```

### 5. `src/stores/users.js`
```diff
+ import { useCentersStore }
+ fetch() ahora pasa centerId: getAllUsers(companyId, centerId)
+ setupCompanyChangeListener() - también escucha 'center-changed'
```

### 6. `src/api/appointments.js`
**Endpoints appointments (actualizados para soportar centerId):**
```
getAllAppointments(companyId, centerId)
getAppointmentById(id, companyId, centerId)
getAppointmentsByDateRange(startDate, endDate, companyId, centerId)
getAvailableSlots(date, userId, centerId)
getAvailableUsers(date, companyId, time, centerId)
getLeastBusyUser(date, time, companyId, centerId)
```

**Endpoints users (actualizados):**
```
getAllUsers(companyId, centerId)
getUserById(id, companyId, centerId)
```

**Endpoint WhatsApp (actualizado):**
```
connectWhatsApp(companyId, centerId)
// Ahora pasa ?company_id=X&center_id=Y en OAuth flow
```

**Nuevos endpoints centers:**
```
getAllCenters(companyId) - GET /api/centers?company_id=X
getCenterById(id) - GET /api/centers/{id}
createCenter(centerData) - POST /api/centers
updateCenter(id, centerData) - PUT /api/centers/{id}
deleteCenter(id) - DELETE /api/centers/{id}
```

### 7. `src/components/Navbar.vue`
```diff
+ import CenterSelector from './CenterSelector.vue'
+ import { useCentersStore }
+ const centers = useCentersStore()
+ <CenterSelector /> en template (visible para admin/superadmin)
+ startWhatsappConnection() - pasa centerId: connectWhatsApp(companyId, centerId)
```

### 8. `src/pages/PlanningPage.vue`
```diff
+ import { useCentersStore }
+ const centers = useCentersStore()
+ fetchUsers() - pasa center_id en query params
+ onCenterChanged() - watcher para recargar usuarios
+ onBeforeUnmount() - limpia listener 'center-changed'
+ watch(() => centers.selectedCenterId) - reacciona a cambios de centro
```

---

## FLUJO FUNCIONAL

1. **Selección**: Admin/Superadmin ven dos dropdowns en navbar (Company + Center)
2. **Persistencia**: Ambos IDs se guardan en localStorage
3. **Reactividad**: 
   - Cambiar company → recargar centros disponibles
   - Cambiar center → recargar appointments, users, planning
4. **WhatsApp OAuth**: Incluye center_id en la URL de autorización
5. **Events**: Sistema de eventos window (`'company-changed'`, `'center-changed'`)

---

## SCOPE CUMPLIDO

- **Stores**: 1 archivo nuevo (centers.js), 1 editado (auth.js)
- **Components**: 1 nuevo (CenterSelector.vue), 1 editado (Navbar.vue)
- **API**: 1 archivo editado (appointments.js) con 13 funciones actualizadas + 5 nuevas
- **Pages**: 2 archivos editados (mínimos cambios)

---

## BUILD STATUS

✓ npm run build - Completado sin errores
✓ Todos los imports/exports correctos
✓ No hay warnings críticos
