import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'
import 'remixicon/fonts/remixicon.css'
import { createPinia } from 'pinia'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Esperar a que el router esté listo antes de montar
router.isReady().then(() => {
  app.mount('#app')
})
