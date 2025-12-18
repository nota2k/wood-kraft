<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { Plus, Minus, X, ShoppingBag, ArrowLeft } from 'lucide-vue-next'
import Breadcrumb from '@/components/Breadcrumb.vue'

defineOptions({
    name: 'CartView'
})

const router = useRouter()
const cartStore = useCartStore()
const productsStore = useProductsStore()

const cartItems = computed(() => {
    return cartStore.items.map(item => {
        const product = productsStore.getProductById(item.productId)
        return {
            ...item,
            product
        }
    }).filter(item => item.product)
})

const totalPrice = computed(() => {
    return cartStore.totalPrice(productsStore)
})

const handleRemoveItem = (productId, selectedColor) => {
    cartStore.removeItem(productId, selectedColor)
}

const handleUpdateQuantity = (productId, selectedColor, newQuantity) => {
    cartStore.updateQuantity(productId, selectedColor, newQuantity)
}

const handleIncreaseQuantity = (item) => {
    handleUpdateQuantity(item.productId, item.selectedColor, item.quantity + 1)
}

const handleDecreaseQuantity = (item) => {
    handleUpdateQuantity(item.productId, item.selectedColor, item.quantity - 1)
}

const handleContinueShopping = () => {
    router.push('/products')
}

/**
 * Récupère l'image du produit depuis la structure de l'API
 */
const getProductImage = (product) => {
    if (product.image) {
        return product.image
    }
    if (product.images && product.images.length > 0) {
        if (typeof product.images[0] === 'object' && product.images[0].image_path) {
            return product.images[0].image_path
        }
        if (typeof product.images[0] === 'string') {
            return product.images[0]
        }
    }
    return ''
}

const breadcrumbItems = [
    { label: 'Produits', to: '/products' },
    { label: 'Panier' }
]
</script>

<template>
    <main class="cart-view">
        <Breadcrumb :items="breadcrumbItems" />
        
        <div class="cart-view__container">
            <div class="cart-view__header">
                <h1 class="cart-view__title">Panier</h1>
                <button class="cart-view__back" @click="handleContinueShopping">
                    <ArrowLeft />
                    <span>Continuer mes achats</span>
                </button>
            </div>

            <div v-if="cartStore.isEmpty" class="cart-view__empty">
                <ShoppingBag class="cart-view__empty-icon" />
                <p class="cart-view__empty-text">Votre panier est vide</p>
                <button class="cart-view__button" @click="handleContinueShopping">
                    Découvrir nos produits
                </button>
            </div>

            <div v-else class="cart-view__content">
                <div class="cart-view__items">
                    <div
                        v-for="(item, index) in cartItems"
                        :key="`${item.productId}-${item.selectedColor?.name || 'default'}-${index}`"
                        class="cart-view__item"
                    >
                        <div class="cart-view__item-image">
                            <img :src="getProductImage(item.product)" :alt="item.product.title" />
                        </div>
                        <div class="cart-view__item-info">
                            <h2 class="cart-view__item-name">{{ item.product.title }}</h2>
                            <p v-if="item.selectedColor" class="cart-view__item-color">
                                Couleur: {{ item.selectedColor.name || item.selectedColor.value }}
                            </p>
                            <p class="cart-view__item-price">{{ item.product.price }} €</p>
                        </div>
                        <div class="cart-view__item-actions">
                            <div class="cart-view__quantity">
                                <button
                                    class="cart-view__quantity-btn"
                                    @click="handleDecreaseQuantity(item)"
                                    aria-label="Diminuer la quantité"
                                >
                                    <Minus />
                                </button>
                                <span class="cart-view__quantity-value">{{ item.quantity }}</span>
                                <button
                                    class="cart-view__quantity-btn"
                                    @click="handleIncreaseQuantity(item)"
                                    aria-label="Augmenter la quantité"
                                >
                                    <Plus />
                                </button>
                            </div>
                            <p class="cart-view__item-total">
                                {{ (item.product.price * item.quantity).toFixed(2) }} €
                            </p>
                            <button
                                class="cart-view__remove"
                                @click="handleRemoveItem(item.productId, item.selectedColor)"
                                aria-label="Retirer du panier"
                            >
                                <X />
                            </button>
                        </div>
                    </div>
                </div>

                <div class="cart-view__summary">
                    <div class="cart-view__total">
                        <span class="cart-view__total-label">Total</span>
                        <span class="cart-view__total-price">{{ totalPrice.toFixed(2) }} €</span>
                    </div>
                    <button class="cart-view__button cart-view__button--primary">
                        Passer la commande
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">
.cart-view {
    padding: var(--padding-md) 0;
    background-color: var(--color-beige);
    min-height: calc(100vh - 80px);

    &__container {
        max-width: var(--max-width);
        margin: 0 auto;
        padding: 0 var(--padding-sm);
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--padding-md);
        flex-wrap: wrap;
        gap: var(--padding-sm);
    }

    &__title {
        font-family: 'Lovan', serif;
        font-size: var(--font-xl);
        color: var(--color-marron);
        font-weight: 300;
        margin: 0;
    }

    &__back {
        display: flex;
        align-items: center;
        gap: var(--padding-xs);
        background: none;
        border: var(--border);
        border-radius: var(--border-radius);
        padding: var(--padding-xs) var(--padding-sm);
        color: var(--color-marron);
        font-size: var(--font-sm);
        cursor: pointer;
        transition: opacity var(--transition);

        &:hover {
            opacity: 0.7;
        }
    }

    &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--padding-lg);
        gap: var(--padding-md);
    }

    &__empty-icon {
        width: 120px;
        height: 120px;
        color: var(--color-marron-light);
        opacity: 0.5;
    }

    &__empty-text {
        font-size: var(--font-lg);
        color: var(--color-marron);
        opacity: 0.7;
        margin: 0;
    }

    &__content {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: var(--padding-md);

        @media (max-width: 1024px) {
            grid-template-columns: 1fr;
        }
    }

    &__items {
        display: flex;
        flex-direction: column;
        gap: var(--padding-sm);
    }

    &__item {
        display: flex;
        gap: var(--padding-sm);
        padding: var(--padding-sm);
        border: var(--border);
        border-radius: var(--border-radius);
        background-color: var(--color-beige);

        @media (max-width: 768px) {
            flex-direction: column;
        }
    }

    &__item-image {
        width: 150px;
        height: 150px;
        flex-shrink: 0;
        overflow: hidden;
        border-radius: calc(var(--border-radius) / 2);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    &__item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--padding-xs);
    }

    &__item-name {
        font-size: var(--font-md);
        color: var(--color-marron);
        font-weight: 400;
        margin: 0;
    }

    &__item-color {
        font-size: var(--font-sm);
        color: var(--color-marron);
        opacity: 0.7;
        margin: 0;
    }

    &__item-price {
        font-size: var(--font-md);
        color: var(--color-marron);
        font-weight: 500;
        margin: 0;
    }

    &__item-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: var(--padding-xs);
        justify-content: space-between;
    }

    &__quantity {
        display: flex;
        align-items: center;
        gap: var(--padding-xs);
    }

    &__quantity-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-marron);
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity var(--transition);

        &:hover {
            opacity: 0.7;
        }
    }

    &__quantity-value {
        font-size: var(--font-sm);
        color: var(--color-marron);
        min-width: 32px;
        text-align: center;
    }

    &__item-total {
        font-size: var(--font-md);
        color: var(--color-marron);
        font-weight: 500;
        margin: 0;
    }

    &__remove {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-marron);
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity var(--transition);

        &:hover {
            opacity: 0.7;
        }
    }

    &__summary {
        padding: var(--padding-sm);
        border: var(--border);
        border-radius: var(--border-radius);
        background-color: var(--color-beige);
        height: fit-content;
        position: sticky;
        top: 120px;
    }

    &__total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0;
        border-bottom: var(--border);
        margin-bottom: var(--padding-sm);
    }

    &__total-label {
        font-size: var(--font-md);
        color: var(--color-marron);
        font-weight: 400;
    }

    &__total-price {
        font-size: var(--font-md);
        color: var(--color-marron);
        font-weight: 500;
    }

    &__button {
        // width: 100%;
        padding: var(--padding-xs) var(--padding-sm);
        border-radius: 100px;
        // font-size: var(--font-md);
        font-weight: 400;
        cursor: pointer;
        transition: opacity var(--transition);

        &:hover {
            opacity: 0.9;
        }

        &--primary {
            background-color: var(--color-marron);
            color: var(--color-beige);
        }
    }
}
</style>

