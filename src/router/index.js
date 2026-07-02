import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import AppointmentsPage from '../pages/AppointmentsPage.vue'
import UsersPage from '../pages/UsersPage.vue'
import PlanningPage from '../pages/PlanningPage.vue'
import CompaniesPage from '../pages/CompaniesPage.vue'
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage.vue'
import TermsConditionsPage from '../pages/TermsConditionsPage.vue'
import CookiesPolicyPage from '../pages/CookiesPolicyPage.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', component: LoginPage },

  { path: '/', redirect: '/calendario' },

  {
    path: '/calendario',
    component: AppointmentsPage,
    meta: { requiresAuth: true, roles: ['user', 'admin'] }
  },

  {
    path: '/usuarios',
    component: UsersPage,
    meta: { requiresAuth: true, roles: ['admin'] }
  },

  {
    path: '/planning',
    component: PlanningPage,
    meta: { requiresAuth: true, roles: ['user', 'admin'] }
  },

  {
    path: '/empresas',
    component: CompaniesPage,
    meta: { requiresAuth: true, roles: ['admin', 'superadmin'] }
  },

  { path: '/privacy-policy', component: PrivacyPolicyPage },
  { path: '/terms-conditions', component: TermsConditionsPage },
  { path: '/cookies-policy', component: CookiesPolicyPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }

  if (to.path === '/login' && auth.isAuthenticated) {
    return '/calendario'
  }

  // Si la ruta requiere roles y el usuario está autenticado, validar
  // superadmin tiene acceso a todo
  if (to.meta.roles && auth.isAuthenticated && auth.user?.role && auth.user.role !== 'superadmin') {
    if (!to.meta.roles.includes(auth.user.role)) {
      return '/calendario'
    }
  }

  return true
})

export default router