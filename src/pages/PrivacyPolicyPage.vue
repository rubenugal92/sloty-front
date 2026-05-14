<template>
  <div class="legal-page">
    <div class="legal-container">
      <h1>Política de Privacidad</h1>
      <p class="last-updated">Última actualización: {{ currentDate }}</p>

      <section>
        <h2>1. Responsable del Tratamiento</h2>
        <p>
          Bot Manager es el responsable del tratamiento de tus datos personales. 
          Para consultas sobre privacidad, contacta con: midgardit@midgard-it.com
        </p>
      </section>

      <section>
        <h2>2. Datos que Recopilamos</h2>
        <p>Podemos recopilar los siguientes tipos de datos:</p>
        <ul>
          <li><strong>Datos de Identificación:</strong> Nombre, email y teléfono</li>
          <li><strong>Datos de Citas:</strong> Historial de citas y servicios solicitados</li>
          <li><strong>Datos Técnicos:</strong> Dirección IP, navegador y registros de acceso</li>
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
          Para ejercer estos derechos, envía una solicitud a: midgardit@midgard-it.com
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
      <section>
  <h2>8. Uso de WhatsApp Business API</h2>
  <p>
    Nuestra plataforma puede utilizar la API oficial de WhatsApp Business proporcionada por Meta
    para gestionar comunicaciones y reservas de citas.
  </p>

  <p>
    Al utilizar este canal de comunicación, aceptas que parte de la información intercambiada
    pueda ser procesada por Meta Platforms Inc. según sus propias políticas de privacidad.
  </p>

  <p>
    Recomendamos consultar la política de privacidad de WhatsApp y Meta para más información
    sobre el tratamiento de datos realizado por dichos servicios.
  </p>
</section>
<section>
  <h2>9. Encargado del Tratamiento</h2>

  <p>
    Bot Manager actúa como encargado del tratamiento de datos en nombre de los negocios
    que utilizan la plataforma para gestionar sus citas y clientes.
  </p>

  <p>
    Midgard IT es responsable de la plataforma Bot Manager.
    Para consultas relacionadas con privacidad y protección de datos,
    puedes contactar en: midgardit@midgard-it.com
  </p>
</section>
<section>
  <h2>10. Almacenamiento y Seguridad</h2>

  <p>
    Los datos se almacenan en infraestructuras seguras proporcionadas por terceros especializados.
    Aplicamos medidas técnicas y organizativas razonables para proteger la información
    frente a accesos no autorizados, pérdida o alteración.
  </p>

  <p>
    Las comunicaciones entre el usuario y la plataforma se realizan mediante conexiones seguras (HTTPS).
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
