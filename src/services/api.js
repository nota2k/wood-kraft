const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:8000'

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
   * Effectue une requête HTTP
   * @param {object} options - options fetch ; skipAuthRedirect: true pour certains appels où un 401 est attendu sans redirection
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const { skipAuthRedirect = false, headers: optHeaders, ...restOptions } = options

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
        if (skipAuthRedirect) {
          const err = new Error('Unauthorized')
          err.status = 401
          throw err
        }
        if (endpoint.includes('/admin/')) {
          localStorage.removeItem('admin_user')
          window.location.href = '/admin/login'
        } else if (endpoint.includes('/customer/')) {
          localStorage.removeItem('customer_user')
          window.location.href = '/login'
        } else {
          localStorage.removeItem('admin_user')
          localStorage.removeItem('customer_user')
          throw new Error('Unauthorized')
        }
        throw new Error('Unauthorized')
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
        console.error('API request failed:', error)
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
        if (skipAuthRedirect) {
          const err = new Error('Unauthorized')
          err.status = 401
          throw err
        }
        if (endpoint.includes('/admin/')) {
          localStorage.removeItem('admin_user')
          window.location.href = '/admin/login'
        } else if (endpoint.includes('/customer/')) {
          localStorage.removeItem('customer_user')
          window.location.href = '/login'
        } else {
          localStorage.removeItem('admin_user')
          localStorage.removeItem('customer_user')
          throw new Error('Unauthorized')
        }
        throw new Error('Unauthorized')
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
      console.error('API request failed:', error)
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
    await fetch(`${APP_URL}/sanctum/csrf-cookie`, {
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
    await this.getCsrfCookie()
    return this.get('/auth/user')
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
}

export default new ApiService()

