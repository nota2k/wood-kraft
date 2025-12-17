import { defineStore } from 'pinia'
import api from '@/services/api'

/**
 * Transforme un produit de l'API en format compatible avec les composants
 * Utilise directement les clés de l'API
 */
function transformProduct(product) {
  // Trier les images par order
  const sortedImages = product.images?.sort((a, b) => a.order - b.order) || []
  const mainImage = sortedImages.find(img => img.is_default) || sortedImages[0]
  
  return {
    // Clés directes de l'API
    id: product.id,
    title: product.title,
    price: parseFloat(product.price),
    description: product.description,
    reference: product.reference,
    materials: product.materials,
    dimensions: product.dimensions,
    quantity: product.quantity,
    // Images : garder la structure complète de l'API
    images: sortedImages,
    // Image principale pour compatibilité
    image: mainImage?.image_path || sortedImages[0]?.image_path || '',
    // Catégories : structure complète de l'API
    categories: product.categories || [],
    // Slug de la première catégorie pour compatibilité
    category: product.categories?.[0]?.slug || '',
    // Variations : garder la structure de l'API et ajouter des helpers
    variations: product.variations || [],
    // Variations de couleur transformées pour les composants
    colorVariations: product.variations
      ?.filter(v => v.type === 'color')
      .map(v => ({
        id: v.id,
        name: v.value,
        value: v.value,
        type: v.type,
        color: getColorFromName(v.value),
        available: v.pivot?.quantity > 0 || false,
        quantity: v.pivot?.quantity || 0
      })) || [],
    // Pour la compatibilité avec l'ancien système
    isNew: false
  }
}

/**
 * Convertit un nom de couleur en code hexadécimal
 */
function getColorFromName(colorName) {
  const colorMap = {
    'Chêne naturel': '#D4A574',
    'Chêne foncé': '#7A572F',
    'Chêne teinté foncé': '#7A572F',
    'Chêne clair': '#E8D5B7',
    'Chêne cérusé': '#F5F4EC',
    'Chêne fumé': '#5C4033',
    'Hêtre naturel': '#D4B896',
    'Hêtre cendré': '#B8A082',
    'Hêtre teinté': '#A68B5B',
    'Noyer naturel': '#6B4423',
    'Noyer clair': '#8B6F47',
    'Pin naturel': '#E8D5B7',
    'Pin huilé': '#C9B082',
    'Pin blanchi': '#F5F4EC'
  }
  return colorMap[colorName] || '#D4A574'
}

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [],
        categories: [],
        loading: false,
        error: null,
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 0
        }
    }),

    getters: {
        getAllProducts: (state) => state.products,

        getProductById: (state) => {
            return (id) => state.products.find(product => product.id === parseInt(id))
        },

        getProductsByCategory: (state) => {
            return (categorySlug) => {
                if (!categorySlug) return state.products
                return state.products.filter(product => 
                    product.categories.some(cat => cat.slug === categorySlug)
                )
            }
        },

        getNewProducts: (state) => {
            // À adapter selon vos besoins (peut-être ajouter un champ isNew dans l'API)
            return state.products
        },

        filterProducts: (state) => {
            return (filters) => {
                let filtered = [...state.products]

                // Filtre par catégorie (slug)
                if (filters.category) {
                    filtered = filtered.filter(product => 
                        product.categories.some(cat => cat.slug === filters.category)
                    )
                }

                // Filtre par prix
                if (filters.priceRange) {
                    filtered = filtered.filter(product =>
                        product.price >= filters.priceRange.min &&
                        product.price <= filters.priceRange.max
                    )
                }

                // Filtre nouveautés
                if (filters.newOnly) {
                    // À adapter selon vos besoins
                    filtered = filtered.filter(product => product.isNew)
                }

                return filtered
            }
        }
    },

    actions: {
        /**
         * Charge les produits depuis l'API
         * @param {Object} params - Paramètres de filtrage et pagination
         * @param {number} params.per_page - Nombre d'éléments par page (défaut: 15)
         * @param {number} params.page - Numéro de page (défaut: 1)
         * @param {number} params.category_id - ID de la catégorie pour filtrer
         * @param {string} params.search - Terme de recherche
         */
        async fetchProducts(params = {}) {
            this.loading = true
            this.error = null
            
            try {
                // Préparer les paramètres pour l'API
                const apiParams = {
                    per_page: params.per_page || 15,
                    page: params.page || 1
                }
                
                // Ajouter category_id seulement s'il est défini
                if (params.category_id !== undefined && params.category_id !== null) {
                    apiParams.category_id = params.category_id
                }
                
                // Ajouter search seulement s'il est défini
                if (params.search) {
                    apiParams.search = params.search
                }
                
                const response = await api.getProducts(apiParams)

                // Si la réponse est paginée (Laravel)
                if (response.data) {
                    this.products = response.data.map(transformProduct)
                    this.pagination = {
                        current_page: response.current_page,
                        last_page: response.last_page,
                        per_page: response.per_page,
                        total: response.total
                    }
                } else {
                    // Si ce n'est pas paginé
                    this.products = Array.isArray(response) 
                        ? response.map(transformProduct)
                        : [transformProduct(response)]
                }
            } catch (error) {
                this.error = error.message
                console.error('Error fetching products:', error)
                // En cas d'erreur, vider la liste des produits
                this.products = []
            } finally {
                this.loading = false
            }
        },

        /**
         * Charge un produit par son ID
         */
        async fetchProduct(id) {
            this.loading = true
            this.error = null
            
            try {
                const product = await api.getProduct(id)
                const transformed = transformProduct(product)
                
                // Ajouter ou mettre à jour le produit dans la liste
                const index = this.products.findIndex(p => p.id === transformed.id)
                if (index !== -1) {
                    this.products[index] = transformed
                } else {
                    this.products.push(transformed)
                }
                
                return transformed
            } catch (error) {
                this.error = error.message
                console.error('Error fetching product:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        /**
         * Charge les catégories depuis l'API
         */
        async fetchCategories() {
            try {
                const categories = await api.getCategories()
                this.categories = categories
                return categories
            } catch (error) {
                this.error = error.message
                console.error('Error fetching categories:', error)
                throw error
            }
        }
    }
})
