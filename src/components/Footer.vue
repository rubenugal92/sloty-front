<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Sobre Nosotros</h3>
          <p>Bot Manager - Gestión de citas y planificación de fisioterapia</p>
        </div>

        <div class="footer-section">
          <h3>Información Legal</h3>
          <ul class="footer-links">
            <li>
              <router-link to="/privacy-policy">
                Política de Privacidad
              </router-link>
            </li>
            <li>
              <router-link to="/terms-conditions">
                Términos y Condiciones
              </router-link>
            </li>
            <li>
              <router-link to="/cookies-policy">
                Política de Cookies
              </router-link>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Contacto</h3>
          <ul class="footer-links">
            <li>
              <a href="mailto:info@fisiocom.com">rubenugal@gmail.com</a>
            </li>
            <li>
              <a href="tel:+34123456789">+34 697519399</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} FisioCom. Todos los derechos reservados.</p>
        <p class="footer-disclaimer">
          Esta plataforma se proporciona tal como está. Consulta siempre a un profesional sanitario cualificado.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 40px 0 20px 0;
  margin-top: 60px;
  border-top: 1px solid #34495e;
  font-size: 14px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
}

.footer-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #3498db;
}

.footer-section p {
  margin: 0;
  line-height: 1.6;
  opacity: 0.9;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #3498db;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 20px;
  text-align: center;
}

.footer-bottom p {
  margin: 5px 0;
  opacity: 0.8;
  font-size: 13px;
}

.footer-disclaimer {
  font-style: italic;
  opacity: 0.7;
  margin-top: 10px !important;
}

@media (max-width: 768px) {
  .footer {
    padding: 30px 0 15px 0;
    margin-top: 40px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-section h3 {
    font-size: 14px;
  }
}
</style>
