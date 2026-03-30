const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
/**
 * Origine Laravel pour Sanctum (CSRF). Laisser vide en dev avec proxy Vite : les requêtes
 * partent du même host que le front (ex. localhost:5173/sanctum/...), sinon le cookie
 * part sur :8000 et /auth/user voit une session vide → hydrate efface customer_user.
 */
const APP_BASE_URL = (import.meta.env.VITE_APP_URL ?? '').trim()

function redirectToCustomerLogin() {
  localStorage.removeItem('customer_user')
  window.dispatchEvent(new Event('auth-changed'))
  void import('@/router').then((m) => {
    m.default.push({ name: 'login' }).catch(() => {})
  })
}

function unauthorizedError() {
  const err = new Error('Unauthorized')
  err.status = 401
  return err
}

async function unauthorizedErrorFromResponse(response, endpoint) {
  const err = unauthorizedError()
  err.endpoint = endpoint
  err.url = response.url
  err.statusText = response.statusText
  try {
    err.data = await response.clone().json()
  } catch {
    const text = await response.clone().text().catch(() => '')
    if (text) {
      err.data = { raw: text }
    }
  }
  return err
}

function shouldAttempt401Retry(endpoint, alreadyRetried) {
  if (alreadyRetried) return false
  return endpoint.includes('/customer/') || endpoint.includes('/admin/')
}

/**
 * Service API pour communiquer avec le backend Laravel
 */
class ApiService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * Récupère un cookie par son nom
   */
  getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }

  /**
   * Vérifie si la session serveur est encore valide avant de forcer une déconnexion client.
   */
  async hasValidServerSession() {
    try {
      const authData = await this.get('/auth/user', {}, { skipAuthRedirect: true })
      return !!authData?.user
    } catch {
      return false
    }
  }

  /**
   * Effectue une requête HTTP
   * @param {object} options - options fetch ; skipAuthRedirect: true pour certains appels où un 401 est attendu sans redirection
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const { skipAuthRedirect = false, _retry401 = false, headers: optHeaders, ...restOptions } = options

    // Récupération du token CSRF depuis le cookie (Sanctum le met dans XSRF-TOKEN)
    const csrfToken = this.getCookie('XSRF-TOKEN')

    const config = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(csrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(csrfToken) } : {}),
        ...optHeaders,
      },
      ...restOptions,
    }

    try {
      const response = await fetch(url, config)

      if (response.status === 401) {
        const unauthorized = await unauthorizedErrorFromResponse(response, endpoint)
        if (shouldAttempt401Retry(endpoint, _retry401)) {
          // Tolère les 401 transitoires juste après login (cookie/session en cours d'alignement)
          await new Promise((resolve) => setTimeout(resolve, 180))
          return this.request(endpoint, { ...options, _retry401: true })
        }
        if (skipAuthRedirect) {
          // Mode silencieux: on laisse l'appelant décider (pas de déconnexion implicite).
          throw unauthorized
        }
        if (endpoint.includes('/admin/')) {
          const stillAuthenticated = await this.hasValidServerSession()
          if (!stillAuthenticated) {
            localStorage.removeItem('admin_user')
            window.location.href = '/admin/login'
          }
        } else if (endpoint.includes('/customer/')) {
          const stillAuthenticated = await this.hasValidServerSession()
          if (!stillAuthenticated) {
            redirectToCustomerLogin()
          }
        } else {
          localStorage.removeItem('admin_user')
          localStorage.removeItem('customer_user')
          throw unauthorized
        }
        throw unauthorized
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`)
        error.status = response.status
        error.data = errorData
        throw error
      }

      if (response.status === 204) return null
      return await response.json()
    } catch (error) {
      const quiet401 = skipAuthRedirect && error?.status === 401
      if (!quiet401) {
        console.error('API request failed:', {
          endpoint,
          status: error?.status,
          message: error?.message,
          data: error?.data,
          statusText: error?.statusText,
          url: error?.url,
        })
      }
      throw error
    }
  }

  /**
   * Requête avec FormData (upload de fichiers)
   */
  async requestForm(endpoint, formData, method = 'POST', meta = {}) {
    const url = `${this.baseURL}${endpoint}`
    const skipAuthRedirect = meta.skipAuthRedirect === true
    const retry401 = meta._retry401 === true

    // Récupération du token CSRF
    const csrfToken = this.getCookie('XSRF-TOKEN')

    const config = {
      method,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        ...(csrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(csrfToken) } : {}),
      },
      body: formData
    }

    try {
      const response = await fetch(url, config)

      if (response.status === 401) {
        const unauthorized = await unauthorizedErrorFromResponse(response, endpoint)
        if (shouldAttempt401Retry(endpoint, retry401)) {
          await new Promise((resolve) => setTimeout(resolve, 180))
          return this.requestForm(endpoint, formData, method, { ...meta, _retry401: true })
        }
        if (skipAuthRedirect) {
          // Mode silencieux: on laisse l'appelant décider (pas de déconnexion implicite).
          throw unauthorized
        }
        if (endpoint.includes('/admin/')) {
          const stillAuthenticated = await this.hasValidServerSession()
          if (!stillAuthenticated) {
            localStorage.removeItem('admin_user')
            window.location.href = '/admin/login'
          }
        } else if (endpoint.includes('/customer/')) {
          const stillAuthenticated = await this.hasValidServerSession()
          if (!stillAuthenticated) {
            redirectToCustomerLogin()
          }
        } else {
          localStorage.removeItem('admin_user')
          localStorage.removeItem('customer_user')
          throw unauthorized
        }
        throw unauthorized
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`)
        error.status = response.status
        error.data = errorData
        throw error
      }

      return await response.json()
    } catch (error) {
      const quiet401 = skipAuthRedirect && error?.status === 401
      if (!quiet401) {
        console.error('API request failed:', {
          endpoint,
          status: error?.status,
          message: error?.message,
          data: error?.data,
          statusText: error?.statusText,
          url: error?.url,
        })
      }
      throw error
    }
  }

  /**
   * GET request
   * @param {object} [requestOptions] - ex. { skipAuthRedirect: true }
   */
  async get(endpoint, params = {}, requestOptions = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return this.request(url, { method: 'GET', ...requestOptions })
  }

  /**
   * POST request
   * @param {object} [requestOptions] - ex. { skipAuthRedirect: true }
   */
  async post(endpoint, data = {}, requestOptions = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...requestOptions,
    })
  }

  /**
   * PUT request
   * @param {object} [requestOptions] - ex. { skipAuthRedirect: true }
   */
  async put(endpoint, data = {}, requestOptions = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...requestOptions,
    })
  }

  /**
   * DELETE request
   * @param {object} [requestOptions] - ex. { skipAuthRedirect: true }
   */
  async delete(endpoint, requestOptions = {}) {
    return this.request(endpoint, { method: 'DELETE', ...requestOptions })
  }

  // ===== AUTH =====

  async getCsrfCookie() {
    const base = APP_BASE_URL.replace(/\/$/, '')
    const url = base ? `${base}/sanctum/csrf-cookie` : '/sanctum/csrf-cookie'
    await fetch(url, {
      credentials: 'include',
    })
  }

  async login(credentials) {
    await this.getCsrfCookie()
    return this.post('/auth/login', credentials)
  }

  async register(data) {
    await this.getCsrfCookie()
    return this.post('/auth/register', data)
  }

  async logout() {
    return this.post('/auth/logout')
  }

  /**
   * Utilisateur courant (session Laravel). Réponse 200 { user } ou { user: null }.
   */
  async getAuthUser() {
    return this.get('/auth/user', {}, { skipAuthRedirect: true })
  }

  /** @deprecated utiliser getAuthUser */
  async getMe() {
    return this.getAuthUser()
  }

  // ===== CART =====
  async syncCart(items) {
    // skipAuthRedirect : un 401 ne doit pas faire window.location=/login (efface la session client et casse le flux post-login)
    return this.post('/customer/cart/sync', { items }, { skipAuthRedirect: true })
  }

  async fetchCart() {
    return this.get('/customer/cart', {}, { skipAuthRedirect: true })
  }

  async emptyCart() {
    return this.delete('/customer/cart', { skipAuthRedirect: true })
  }

  // ===== CHECKOUT =====
  async getCheckoutShippingMethods() {
    return this.get('/checkout/shipping-methods')
  }

  async getCheckoutPricing(payload) {
    return this.post('/checkout/pricing', payload)
  }

  async confirmCheckout(payload) {
    return this.post('/customer/checkout/confirm', payload, { skipAuthRedirect: true })
  }

  // ===== PRODUCTS =====

  async getProducts(params = {}) {
    return this.get('/products', params)
  }

  async getProduct(id) {
    return this.get(`/products/${id}`)
  }

  async createProduct(formData) {
    return this.requestForm('/admin/products', formData, 'POST')
  }

  async updateProduct(id, formData) {
    // Laravel nécessite _method pour le PUT avec FormData
    formData.append('_method', 'PUT')
    return this.requestForm(`/admin/products/${id}`, formData, 'POST')
  }

  async deleteProduct(id) {
    return this.delete(`/products/${id}`)
  }

  // ===== CATEGORIES =====

  async getCategories() {
    return this.get('/categories')
  }

  async getCategory(id) {
    return this.get(`/categories/${id}`)
  }

  async createCategory(data) {
    return this.post('/categories', data)
  }

  async updateCategory(id, data) {
    return this.put(`/categories/${id}`, data)
  }

  async deleteCategory(id) {
    return this.delete(`/categories/${id}`)
  }

  // ===== MATERIALS =====
  async getMaterials() {
    return this.get('/materials')
  }

  // ===== ADMIN STATS =====

  async getStats() {
    return this.get('/admin/stats')
  }

  // ===== ADMIN SHIPPING METHODS =====
  async getAdminShippingMethods(params = {}) {
    return this.get('/admin/shipping-methods', params)
  }

  async createAdminShippingMethod(payload) {
    return this.post('/admin/shipping-methods', payload)
  }

  async updateAdminShippingMethod(id, payload) {
    return this.put(`/admin/shipping-methods/${id}`, payload)
  }

  async deleteAdminShippingMethod(id) {
    return this.delete(`/admin/shipping-methods/${id}`)
  }

  // ===== ADMIN PROMO CODES =====
  async getAdminPromoCodes(params = {}) {
    return this.get('/admin/promo-codes', params)
  }

  async createAdminPromoCode(payload) {
    return this.post('/admin/promo-codes', payload)
  }

  async updateAdminPromoCode(id, payload) {
    return this.put(`/admin/promo-codes/${id}`, payload)
  }

  async deleteAdminPromoCode(id) {
    return this.delete(`/admin/promo-codes/${id}`)
  }
}

export default new ApiService()

