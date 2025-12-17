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
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
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

  // ===== PRODUCTS =====

  /**
   * Récupère la liste des produits
   * @param {Object} params - Paramètres de filtrage (category_id, search, per_page)
   */
  async getProducts(params = {}) {
    return this.get('/products', params)
  }

  /**
   * Récupère un produit par son ID
   */
  async getProduct(id) {
    return this.get(`/products/${id}`)
  }

  // ===== CATEGORIES =====

  /**
   * Récupère la liste des catégories
   */
  async getCategories() {
    return this.get('/categories')
  }

  /**
   * Récupère une catégorie par son ID
   */
  async getCategory(id) {
    return this.get(`/categories/${id}`)
  }
}

export default new ApiService()

