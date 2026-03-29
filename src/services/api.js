const API_BASE_URL = 'http://127.0.0.1:8888/api/v1'

/**
 * Service API pour communiquer avec le backend Laravel
 */
class ApiService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * Effectue une requête HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)

      if (response.status === 401) {
        localStorage.removeItem('admin_user')
        window.location.href = '/admin/login'
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
      console.error('API request failed:', error)
      throw error
    }
  }

  /**
   * Requête avec FormData (upload de fichiers)
   */
  async requestForm(endpoint, formData, method = 'POST') {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      method,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
      body: formData
    }

    try {
      const response = await fetch(url, config)

      if (response.status === 401) {
        localStorage.removeItem('admin_user')
        window.location.href = '/admin/login'
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
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return this.request(url, { method: 'GET' })
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // ===== AUTH =====

  async getCsrfCookie() {
    await fetch(`http://127.0.0.1:8888/sanctum/csrf-cookie`, {
      credentials: 'include',
    })
  }

  async login(credentials) {
    await this.getCsrfCookie()
    return this.post('/auth/login', credentials)
  }

  async logout() {
    return this.post('/auth/logout')
  }

  async getMe() {
    return this.get('/auth/user')
  }

  // ===== PRODUCTS =====

  async getProducts(params = {}) {
    return this.get('/products', params)
  }

  async getProduct(id) {
    return this.get(`/products/${id}`)
  }

  async createProduct(formData) {
    return this.requestForm('/products', formData, 'POST')
  }

  async updateProduct(id, formData) {
    // Laravel nécessite _method pour le PUT avec FormData
    formData.append('_method', 'PUT')
    return this.requestForm(`/products/${id}`, formData, 'POST')
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

  // ===== ADMIN STATS =====

  async getStats() {
    return this.get('/admin/stats')
  }

  // ===== AUTH =====

  async login(credentials) {
    return this.post('/auth/login', credentials)
  }
}

export default new ApiService()

