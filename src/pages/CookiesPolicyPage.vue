<template>
  <div class="legal-page">
    <div class="legal-container">
      <h1>Política de Cookies</h1>
      <p class="last-updated">Última actualización: {{ currentDate }}</p>

      <section>
        <h2>1. ¿Qué son las Cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. 
          Se utilizan para mejorar la experiencia del usuario, recordar preferencias y analizar el uso del sitio.
        </p>
      </section>

      <section>
        <h2>2. Tipos de Cookies Utilizadas</h2>
        <ul>
          <li>
            <strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico de la plataforma 
            (autenticación, seguridad)
          </li>
          <li>
            <strong>Cookies de Sesión:</strong> Se eliminan al cerrar el navegador
          </li>
          <li>
            <strong>Cookies Persistentes:</strong> Permanecen durante un período específico para recordar preferencias
          </li>
          <li>
            <strong>Cookies de Análisis:</strong> Nos ayudan a entender cómo utilizas la plataforma
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Cookies de Terceros</h2>
        <p>
          Podemos permitir que servicios de terceros (análisis, publicidad) coloquen cookies en tu dispositivo. 
          Estas se rigen por sus propias políticas de privacidad.
        </p>
      </section>

      <section>
        <h2>4. Control de Cookies</h2>
        <p>
          Puedes controlar y eliminar cookies a través de la configuración de tu navegador:
        </p>
        <ul>
          <li>Google Chrome: Configuración → Privacidad y seguridad</li>
          <li>Firefox: Preferencias → Privacidad</li>
          <li>Safari: Preferencias → Privacidad</li>
          <li>Edge: Configuración → Privacidad</li>
        </ul>
        <p>
          <strong>Nota:</strong> Deshabilitar cookies puede afectar la funcionalidad de la plataforma.
        </p>
      </section>

      <section>
        <h2>5. Cambios en la Política</h2>
        <p>
          Podemos actualizar esta política de cookies en cualquier momento. 
          Se recomienda revisar periódicamente para estar informado de cambios.
        </p>
      </section>

      <section>
        <h2>6. Más Información</h2>
        <p>
          Para más información sobre cómo utilizamos cookies y tu privacidad, 
          consulta nuestra <router-link to="/privacy-policy">Política de Privacidad</router-link>.
        </p>
      </section>

      <div class="back-link">
        <router-link to="/">← Volver al inicio</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentDate = ref(new Date().toLocaleDateString('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}))
</script>

<style scoped>
.legal-page {
  min-height: calc(100vh - 200px);
  background-color: #f5f5f5;
  padding: 40px 20px;
}

.legal-container {
  max-width: 900px;
  margin: 0 auto;
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 32px;
}

.last-updated {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 30px;
}

section {
  margin-bottom: 30px;
}

h2 {
  color: #3498db;
  font-size: 20px;
  margin-bottom: 15px;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 10px;
}

p {
  color: #555;
  line-height: 1.8;
  margin-bottom: 15px;
}

ul {
  margin: 15px 0;
  padding-left: 20px;
}

li {
  color: #555;
  margin-bottom: 10px;
  line-height: 1.6;
}

.back-link {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
  text-align: center;
}

.back-link a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.back-link a:hover {
  color: #2980b9;
}
</style>
