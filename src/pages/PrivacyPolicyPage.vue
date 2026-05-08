<template>
  <div class="legal-page">
    <div class="legal-container">
      <h1>Política de Privacidad</h1>
      <p class="last-updated">Última actualización: {{ currentDate }}</p>

      <section>
        <h2>1. Responsable del Tratamiento</h2>
        <p>
          FisioCom es el responsable del tratamiento de tus datos personales. 
          Para consultas sobre privacidad, contacta con: info@fisiocom.com
        </p>
      </section>

      <section>
        <h2>2. Datos que Recopilamos</h2>
        <p>Podemos recopilar los siguientes tipos de datos:</p>
        <ul>
          <li><strong>Datos de Identificación:</strong> Nombre, apellidos, email, teléfono</li>
          <li><strong>Datos de Ubicación:</strong> Dirección</li>
          <li><strong>Datos de Citas:</strong> Historial de citas, servicios solicitados</li>
          <li><strong>Datos Técnicos:</strong> Dirección IP, tipo de navegador, páginas visitadas</li>
        </ul>
      </section>

      <section>
        <h2>3. Base Legal del Tratamiento</h2>
        <p>
          El tratamiento de tus datos se realiza en base a:
        </p>
        <ul>
          <li>Tu consentimiento explícito</li>
          <li>La ejecución del contrato de servicios</li>
          <li>Obligaciones legales</li>
          <li>Intereses legítimos de la empresa</li>
        </ul>
      </section>

      <section>
        <h2>4. Derechos del Usuario</h2>
        <p>Tienes derecho a:</p>
        <ul>
          <li><strong>Acceso:</strong> Conocer qué datos tenemos de ti</li>
          <li><strong>Rectificación:</strong> Corregir datos inexactos</li>
          <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos</li>
          <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
          <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos</li>
        </ul>
        <p>
          Para ejercer estos derechos, envía una solicitud a: info@fisiocom.com
        </p>
      </section>

      <section>
        <h2>5. Seguridad de Datos</h2>
        <p>
          Implementamos medidas técnicas y organizativas para proteger tus datos personales 
          contra el acceso no autorizado, alteración, divulgación o destrucción.
        </p>
      </section>

      <section>
        <h2>6. Retención de Datos</h2>
        <p>
          Retenemos tus datos personales durante el tiempo necesario para cumplir 
          con las obligaciones legales y contractuales. Una vez finalizada la relación, 
          los datos se eliminarán o se anonimizarán.
        </p>
      </section>

      <section>
        <h2>7. Cambios en la Política</h2>
        <p>
          Nos reservamos el derecho a modificar esta política en cualquier momento. 
          Los cambios serán notificados a través de la plataforma.
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
