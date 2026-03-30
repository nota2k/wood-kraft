import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useSessionStore } from '@/stores/session'

/** Routes espace client : ne pas se fier seulement à to.meta.auth (fusion selon la navigation). */
function requiresClientAreaAuth(route) {
  if (route.path.startsWith('/compte')) {
    return true
  }
  return route.matched.some((record) => record.meta.auth === true)
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('../views/ProductView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
    },

    {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/compte',
    component: () => import('../views/account/AccountLayout.vue'),
    meta: { auth: true },
    children: [
      {
        path: '',
        name: 'account-dashboard',
        meta: { auth: true },
        component: () => import('../views/account/AccountDashboardView.vue')
      },
      {
        path: 'commandes',
        name: 'account-orders',
        meta: { auth: true },
        component: () => import('../views/account/AccountOrdersView.vue')
      },
      {
        path: 'commandes/:id',
        name: 'account-order-detail',
        meta: { auth: true },
        component: () => import('../views/account/AccountOrderDetailView.vue')
      },
      {
        path: 'profil',
        name: 'account-profile',
        meta: { auth: true },
        component: () => import('../views/account/AccountProfileView.vue')
      }
    ]
  },

    // ===== ADMIN =====
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/AdminLoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: { name: 'admin-dashboard' },
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../views/admin/AdminDashboardView.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('../views/admin/AdminProductsView.vue'),
        },
        {
          path: 'products/create',
          name: 'admin-product-create',
          component: () => import('../views/admin/AdminProductFormView.vue'),
        },
        {
          path: 'products/:id/edit',
          name: 'admin-product-edit',
          component: () => import('../views/admin/AdminProductFormView.vue'),
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('../views/admin/AdminCategoriesView.vue'),
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('../views/admin/AdminOrdersView.vue'),
        },
        {
          path: 'orders/:id',
          name: 'admin-order-detail',
          component: () => import('../views/admin/AdminOrderDetailView.vue'),
        },
        {
          path: 'shipping-methods',
          name: 'admin-shipping-methods',
          component: () => import('../views/admin/AdminShippingMethodsView.vue'),
        },
        {
          path: 'promo-codes',
          name: 'admin-promo-codes',
          component: () => import('../views/admin/AdminPromoCodesView.vue'),
        },
      ],
    },
  ],
  // Le scroll est géré par Lenis + GSAP dans App.vue
  scrollBehavior() { return false },
})

router.beforeEach(async (to, from, next) => {
  const session = useSessionStore()
  if (!session.hydrated) {
    await session.hydrate()
  }

  const serverUser = session.serverUser
  const hasServerSession = !!serverUser
  const isAdminLoggedIn = hasServerSession && String(serverUser?.role ?? '').toLowerCase() === 'admin'
  const isCustomerLoggedIn = hasServerSession && !isAdminLoggedIn

  // 1. Protection des routes ADMIN
  // On vérifie si la route commence par /admin ou a meta.requiresAuth
  const isAdminRoute = to.path.startsWith('/admin') || to.meta.requiresAuth
  const isAdminLogin = to.name === 'admin-login'

  if (isAdminRoute && !isAdminLogin && !isAdminLoggedIn) {
    return next({ name: 'admin-login' })
  }

  // Si on est sur la page login admin mais déjà connecté admin
  if (isAdminLogin && isAdminLoggedIn) {
    return next({ name: 'admin-dashboard' })
  }

  // 2. Protection des routes CLIENT (/compte)
  if (requiresClientAreaAuth(to) && !isCustomerLoggedIn && !isAdminLoggedIn) {
    return next({ name: 'login' })
  }

  // Page login client : rediriger si déjà connecté (client ou admin)
  if (to.meta.guest && isAdminLoggedIn) {
    return next({ name: 'admin-dashboard' })
  }
  if (to.meta.guest && isCustomerLoggedIn) {
    return next({ name: 'account-dashboard' })
  }

  // Sinon, on laisse passer
  next()
})

export default router
