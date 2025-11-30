import { defineStore } from 'pinia'
import productsData from '@/data/products.json'

// Import dynamique des images
const imageModules = import.meta.glob('@/assets/images/*.png', { eager: true })

// Fonction pour résoudre le chemin de l'image
function getImagePath(imageName) {
  // Essayer de trouver l'image dans les modules importés
  for (const path in imageModules) {
    if (path.includes(imageName)) {
      return imageModules[path].default
    }
  }
  // Fallback : retourner le chemin relatif
  return new URL(`../assets/images/${imageName}`, import.meta.url).href
}

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: productsData.map(product => ({
            ...product,
            images: product.images.map(img => getImagePath(img)),
            // Ajouter une propriété image principale pour la compatibilité avec ProductListing
            image: getImagePath(product.images[0])
        }))
    }),

    getters: {
        getAllProducts: (state) => state.products,

        getProductById: (state) => {
            return (id) => state.products.find(product => product.id === parseInt(id))
        },

        getProductsByCategory: (state) => {
            return (category) => {
                if (!category) return state.products
                return state.products.filter(product => product.category === category)
            }
        },

        getNewProducts: (state) => {
            return state.products.filter(product => product.isNew)
        },

        filterProducts: (state) => {
            return (filters) => {
                let filtered = [...state.products]

                // Filtre par catégorie
                if (filters.category) {
                    filtered = filtered.filter(product => product.category === filters.category)
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
                    filtered = filtered.filter(product => product.isNew)
                }

                return filtered
            }
        }
    }
})
