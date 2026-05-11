<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Sobre Nosotros</h3>
          <p>Bot Manager - Gestión de citas de clientes y planificación de empleados</p>
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
              <a href="mailto:rubenugal@gmail.com">rubenugal@gmail.com</a>
            </li>
            <li>
              <a href="tel:+34123456789">+34 697519399</a>
            </li>
            <li>
              <a href="https://botmanagermarketing.onrender.com/" target="_blank" rel="noopener noreferrer" class="footer-web-link">
                🌐 Sitio Web
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Bot Manager. Todos los derechos reservados.</p>
        <p class="footer-disclaimer">
          Esta plataforma se proporciona tal como está. No garantizamos resultados específicos ni asumimos responsabilidad por el uso de la plataforma.
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
  background: var(--slate-900);
  color: var(--slate-300);
  padding: 3rem 0 1.5rem;
  margin-top: 4rem;
  font-size: 0.88rem;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.4), transparent);
}

.footer::after {
  content: "";
  position: absolute;
  top: -200px;
  left: 10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.12), transparent 60%);
  pointer-events: none;
}

.footer-container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 1.25rem;
  position: relative;
  z-index: 1;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary-300);
  margin-bottom: 0.85rem;
}

.footer-section p {
  margin: 0;
  line-height: 1.55;
  color: var(--slate-400);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: var(--slate-300);
  transition: color var(--duration-fast) var(--ease-out);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.footer-links a:hover {
  color: white;
}

.footer-web-link {
  font-weight: 600;
  color: var(--success-500) !important;
}

.footer-web-link:hover {
  color: #6ee7b7 !important;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1.25rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-bottom p {
  margin: 0;
  color: var(--slate-400);
  font-size: 0.8rem;
}

.footer-disclaimer {
  color: var(--slate-500) !important;
  font-style: italic;
  max-width: 720px;
  margin: 0 auto !important;
  line-height: 1.55;
}

@media (max-width: 768px) {
  .footer { padding: 2rem 0 1rem; margin-top: 2.5rem; }
  .footer-content { grid-template-columns: 1fr; gap: 1.75rem; }
}
</style>
