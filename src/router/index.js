import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
        component: () => import('../views/account/AccountDashboardView.vue')
      },
      {
        path: 'commandes',
        name: 'account-orders',
        component: () => import('../views/account/AccountOrdersView.vue')
      },
      {
        path: 'commandes/:id',
        name: 'account-order-detail',
        component: () => import('../views/account/AccountOrderDetailView.vue')
      },
      {
        path: 'profil',
        name: 'account-profile',
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
      ],
    },
  ],
  // Le scroll est géré par Lenis + GSAP dans App.vue
  scrollBehavior() { return false },
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('admin_user')

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'admin-login' })
  } else if (to.meta.guestOnly && isLoggedIn) {
    next({ name: 'admin-dashboard' })
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('customer_user') || 'null')
  const isAuthenticated = !!user

  // Protection Admin
  if (to.path.startsWith('/admin') && to.name !== 'admin-login' && !isAuthenticated) {
    return next({ name: 'admin-login' })
  }

  // Protection Client (Auth)
  if (to.meta.auth && !isAuthenticated) {
    return next({ name: 'login' })
  }

  // Protection Client (Guest - e.g. /login)
  if (to.meta.guest && isAuthenticated) {
    return next({ name: 'account-dashboard' })
  }

  next()
})

export default router
