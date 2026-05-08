<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Bot Manager</h1>
      <p class="subtitle">Sistema de Gestión de Citas</p>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div v-if="isRegister" class="form-group">
          <label>Nombre de Usuario</label>
          <input 
            v-model="form.username"
            type="text"
            placeholder="Tu nombre de usuario"
            required
          />
        </div>

        <div v-if="isRegister" class="form-group">
          <label>Nombre</label>
          <input 
            v-model="form.name"
            type="text"
            placeholder="Tu nombre"
            required
          />
        </div>

        <div class="form-group">
          <label>Correo Electrónico</label>
          <input 
            v-model="form.email"
            type="email"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input 
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="isRegister" class="form-group">
          <label>Teléfono</label>
          <input 
            v-model="form.phone"
            type="tel"
            placeholder="Tu número de teléfono"
            required
          />
        </div>

          <div v-if="isRegister" class="form-group">
        <label>Especialidades</label>
        <input 
          v-model="form.specialties"
          type="text"
          placeholder="Ej: Traumatología, Deportiva"
          :disabled="loading"
        />
      </div>

        <div v-if="isRegister" class="form-group">
        <label>Tipo de Usuario</label>
        <select v-model="form.type" required :disabled="loading">
          <option value="">Selecciona un tipo</option>
          <option value="fisio">Fisioterapeuta</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

        <div v-if="error" class="error-message">
          ❌ {{ error }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Cargando...' : (isRegister ? 'Registrarse' : 'Iniciar Sesión') }}
        </button>

        <button type="button" class="btn btn-link" @click="toggleMode" :disabled="loading">
          {{ isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { login, register } from '../api/appointments.js'

export default {
  name: 'Login',
  setup() {
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

    const toggleMode = () => {
      isRegister.value = !isRegister.value
      error.value = ''
      form.value = { email: '', password: '', username: '', name: '', specialties: '', phone: '', type: '' }
    }

    const handleSubmit = async () => {
      try {
        error.value = ''
        loading.value = true
        console.log('Login iniciado...')

        if (isRegister.value) {
          if (!form.value.username) {
            error.value = 'Por favor ingresa un nombre de usuario'
            return
          }
          console.log('Registrando...')
          await register(form.value.username, form.value.name, form.value.email, form.value.password, form.value.specialties, form.value.phone, form.value.type)
          error.value = ''
          isRegister.value = false
          form.value = { email: form.value.email, password: '', username: '', name: '', specialties: '', phone: '', type: '' }
          error.value = ''
        } else {
          console.log('Llamando login API...')
          const data = await login(form.value.email, form.value.password)
          auth.login(data.token, data.user)
          await router.push('/calendario')
        }
      } catch (err) {
        console.error('Error en login:', err)
        error.value = err.response?.data?.error || err.message || 'Error en la solicitud. Intenta de nuevo.'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      isRegister,
      loading,
      error,
      toggleMode,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6f8;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  background: #ffffff;
  padding: 3rem;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  border: 1px solid #ececec;
}

.login-card h1 {
  margin: 0 0 0.5rem 0;
  color: #111111;
  text-align: center;
  font-size: 2.3rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin: 0 0 2rem 0;
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #111111;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #d6d6d6;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #111111;
  box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.08);
}

.error-message {
  background: #fef2f2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #fecaca;
}

.btn {
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #111111;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #222222;
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-link {
  background: none;
  color: #111111;
  padding: 0.5rem;
  margin-top: 1rem;
  text-decoration: none;
  font-size: 0.9rem;
}

.btn-link:hover:not(:disabled) {
  text-decoration: underline;
}

.btn-link:disabled {
  color: #aaa;
  cursor: not-allowed;
}
</style>
