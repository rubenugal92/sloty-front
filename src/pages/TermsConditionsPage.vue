<template>
  <div class="legal-page">
    <div class="legal-container">
      <h1>Términos y Condiciones</h1>
      <p class="last-updated">Última actualización: {{ currentDate }}</p>

      <section>
        <h2>1. Aceptación de Términos</h2>
        <p>
          Al acceder y utilizar Bot Manager, aceptas estar vinculado por estos términos y condiciones. 
          Si no estás de acuerdo con alguna parte, te pedimos que no utilices nuestros servicios.
        </p>
      </section>

      <section>
        <h2>2. Descripción del Servicio</h2>
        <p>
          Bot Manager es una plataforma de gestión de citas y planificación de plantilla para negocios
          de cualquier sector (peluquerías, clínicas, consultas, entrenadores personales, restaurantes, etc.).
          Nos comprometemos a proporcionar un servicio de calidad, pero no garantizamos disponibilidad 24/7.
        </p>
      </section>

      <section>
        <h2>3. Registro de Usuarios</h2>
        <p>
          Para utilizar ciertos servicios, deberás registrarte y crear una cuenta. Eres responsable de:
        </p>
        <ul>
          <li>Mantener la confidencialidad de tu contraseña</li>
          <li>Proporcionar información exacta y completa</li>
          <li>Notificarnos inmediatamente de accesos no autorizados</li>
          <li>Aceptar toda la responsabilidad por actividades bajo tu cuenta</li>
        </ul>
      </section>

      <section>
        <h2>4. Uso Permitido</h2>
        <p>Te comprometes a utilizar Bot Manager únicamente para propósitos legales y de acuerdo con estos términos.</p>
        <p><strong>No deberás:</strong></p>
        <ul>
          <li>Acceder a información confidencial sin autorización</li>
          <li>Interferir con el funcionamiento de la plataforma</li>
          <li>Utilizar bots, scrapers o herramientas similares</li>
          <li>Violar los derechos de terceros</li>
          <li>Realizar actividades ilegales o fraudulentas</li>
        </ul>
      </section>

      <section>
        <h2>5. Política de Cancelación de Citas</h2>
        <p>
          Las cancelaciones deben realizarse con al menos 24 horas de anticipación.
          Las cancelaciones tardías pueden estar sujetas a cargos según las políticas del negocio.
        </p>
      </section>

      <section>
        <h2>6. Propiedad Intelectual</h2>
        <p>
          Todo el contenido en Bot Manager (diseño, texto, gráficos, logos) está protegido por derechos de autor. 
          No puedes reproducir, distribuir o transmitir ningún contenido sin consentimiento previo.
        </p>
      </section>

      <section>
        <h2>7. Limitación de Responsabilidad</h2>
        <p>
          Bot Manager se proporciona "tal como está". No garantizamos:
        </p>
        <ul>
          <li>Disponibilidad continua del servicio</li>
          <li>Ausencia de errores o inexactitudes</li>
          <li>Resultados específicos del servicio prestado</li>
        </ul>
        <p>
          <strong>Descargo de responsabilidad:</strong> Esta plataforma facilita la gestión de citas,
          pero no sustituye al consejo profesional del negocio que la utiliza.
        </p>
      </section>

      <section>
        <h2>8. Modificación de Términos</h2>
        <p>
          Nos reservamos el derecho a modificar estos términos en cualquier momento. 
          Los cambios entran en vigor al publicarse en la plataforma.
        </p>
      </section>

      <section>
        <h2>9. Ley Aplicable</h2>
        <p>
          Estos términos se rigen por las leyes vigentes en España. 
          Cualquier disputa será resuelta según lo establecido en la ley.
        </p>
      </section>

      <section>
        <h2>10. Contacto</h2>
        <p>
          Para preguntas sobre estos términos, contacta a: <strong>info@fisiocom.com</strong>
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
