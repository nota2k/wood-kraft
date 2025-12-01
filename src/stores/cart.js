import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] // Array of { productId, quantity, selectedColor }
    }),

    getters: {
        totalItems: (state) => {
            return state.items.reduce((total, item) => total + item.quantity, 0)
        },

        totalPrice: (state) => {
            // Cette fonction sera appelée avec le productsStore depuis les composants
            return (productsStore) => {
                if (!productsStore) return 0
                return state.items.reduce((total, item) => {
                    const product = productsStore.getProductById(item.productId)
                    if (product) {
                        return total + (product.price * item.quantity)
                    }
                    return total
                }, 0)
            }
        },

        isEmpty: (state) => state.items.length === 0
    },

    actions: {
        addItem(productId, selectedColor = null, quantity = 1) {
            const existingItemIndex = this.items.findIndex(
                item => item.productId === productId && item.selectedColor?.name === selectedColor?.name
            )

            if (existingItemIndex !== -1) {
                // Si l'article existe déjà avec la même couleur, augmenter la quantité
                this.items[existingItemIndex].quantity += quantity
            } else {
                // Sinon, ajouter un nouvel article
                this.items.push({
                    productId: parseInt(productId),
                    quantity,
                    selectedColor
                })
            }
        },

        removeItem(productId, selectedColor = null) {
            const index = this.items.findIndex(
                item => item.productId === productId && item.selectedColor?.name === selectedColor?.name
            )
            if (index !== -1) {
                this.items.splice(index, 1)
            }
        },

        updateQuantity(productId, selectedColor = null, quantity) {
            const item = this.items.find(
                item => item.productId === productId && item.selectedColor?.name === selectedColor?.name
            )
            if (item) {
                if (quantity <= 0) {
                    this.removeItem(productId, selectedColor)
                } else {
                    item.quantity = quantity
                }
            }
        },

        clearCart() {
            this.items = []
        }
    }
})

