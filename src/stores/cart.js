import { defineStore } from 'pinia'
import api from '@/services/api'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] // Array of { productId, quantity, selectedColor }
    }),

    getters: {
        totalItems: (state) => {
            return state.items.reduce((total, item) => total + item.quantity, 0)
        },

        totalPrice: (state) => {
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
        async loadCart() {
            const user = localStorage.getItem('customer_user')
            if (user) {
                try {
                    const dbItems = await api.fetchCart()
                    this.items = dbItems.map(item => ({
                        productId: item.product_id,
                        quantity: item.quantity,
                        selectedColor: item.options // options contient la couleur
                    }))
                } catch (err) {
                    if (err?.status !== 401) {
                        console.error('Erreur chargement panier distant:', err)
                    }
                }
            }
        },

        async sync() {
            const user = localStorage.getItem('customer_user')
            if (user) {
                try {
                    await api.syncCart(this.items)
                } catch (err) {
                    if (err?.status !== 401) {
                        console.error('Erreur synchronisation panier:', err)
                    }
                }
            }
        },

        addItem(productId, selectedColor = null, quantity = 1) {
            const existingItemIndex = this.items.findIndex(
                item => item.productId === productId && item.selectedColor?.name === selectedColor?.name
            )

            if (existingItemIndex !== -1) {
                this.items[existingItemIndex].quantity += quantity
            } else {
                this.items.push({
                    productId: parseInt(productId),
                    quantity,
                    selectedColor
                })
            }
            this.sync()
        },

        removeItem(productId, selectedColor = null) {
            const index = this.items.findIndex(
                item => item.productId === productId && item.selectedColor?.name === selectedColor?.name
            )
            if (index !== -1) {
                this.items.splice(index, 1)
            }
            this.sync()
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
            this.sync()
        },

        clearCart() {
            this.items = []
            this.sync()
        }
    }
})
