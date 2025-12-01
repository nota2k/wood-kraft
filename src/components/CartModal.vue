<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { X, Plus, Minus, ShoppingBag } from 'lucide-vue-next'

defineOptions({
    name: 'CartModal'
})

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close'])

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
    }).filter(item => item.product) // Filtrer les produits qui n'existent plus
})

const totalPrice = computed(() => {
    return cartStore.totalPrice(productsStore)
})

const handleClose = () => {
    emit('close')
}

const handleContinueShopping = () => {
    handleClose()
    router.push('/products')
}

const handleGoToCart = () => {
    handleClose()
    router.push('/cart')
}

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

// Fermer avec Escape
const handleKeydown = (e) => {
    if (e.key === 'Escape' && props.isOpen) {
        handleClose()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <Transition name="modal">
        <div v-if="isOpen" class="cart-modal" @click.self="handleClose">
            <div class="cart-modal__content">
                <div class="cart-modal__header">
                    <h2 class="cart-modal__title">Panier</h2>
                    <button class="cart-modal__close" @click="handleClose" aria-label="Fermer">
                        <X />
                    </button>
                </div>

                <div class="cart-modal__body">
                    <div v-if="cartStore.isEmpty" class="cart-modal__empty">
                        <ShoppingBag class="cart-modal__empty-icon" />
                        <p class="cart-modal__empty-text">Votre panier est vide</p>
                    </div>

                    <div v-else class="cart-modal__items">
                        <div
                            v-for="(item, index) in cartItems"
                            :key="`${item.productId}-${item.selectedColor?.name || 'default'}-${index}`"
                            class="cart-modal__item"
                        >
                            <div class="cart-modal__item-image">
                                <img :src="item.product.image" :alt="item.product.name" />
                            </div>
                            <div class="cart-modal__item-info">
                                <h3 class="cart-modal__item-name">{{ item.product.name }}</h3>
                                <p v-if="item.selectedColor" class="cart-modal__item-color">
                                    Couleur: {{ item.selectedColor.name }}
                                </p>
                                <p class="cart-modal__item-price">{{ item.product.price }} €</p>
                            </div>
                            <div class="cart-modal__item-actions">
                                <div class="cart-modal__quantity">
                                    <button
                                        class="cart-modal__quantity-btn"
                                        @click="handleDecreaseQuantity(item)"
                                        aria-label="Diminuer la quantité"
                                    >
                                        <Minus />
                                    </button>
                                    <span class="cart-modal__quantity-value">{{ item.quantity }}</span>
                                    <button
                                        class="cart-modal__quantity-btn"
                                        @click="handleIncreaseQuantity(item)"
                                        aria-label="Augmenter la quantité"
                                    >
                                        <Plus />
                                    </button>
                                </div>
                                <button
                                    class="cart-modal__remove"
                                    @click="handleRemoveItem(item.productId, item.selectedColor)"
                                    aria-label="Retirer du panier"
                                >
                                    <X />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="!cartStore.isEmpty" class="cart-modal__footer">
                    <div class="cart-modal__total">
                        <span class="cart-modal__total-label">Total</span>
                        <span class="cart-modal__total-price">{{ totalPrice.toFixed(2) }} €</span>
                    </div>
                    <div class="cart-modal__actions">
                        <button class="cart-modal__button cart-modal__button--secondary" @click="handleContinueShopping">
                            Continuer mes achats
                        </button>
                        <button class="cart-modal__button" @click="handleGoToCart">
                            Voir le panier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.cart-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: flex-end;
    align-items: stretch;
    height: 100vh;

    &__content {
        width: 100%;
        height: 100vh;
        max-width: 500px;
        background-color: var(--color-beige);
        display: flex;
        flex-direction: column;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--padding-sm);
        border-bottom: var(--border);
    }

    &__title {
        font-family: 'Lovan', serif;
        font-size: var(--font-lg);
        color: var(--color-marron);
        font-weight: 300;
        margin: 0;
    }

    &__close {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-marron);
        padding: var(--padding-xs);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity var(--transition);

        &:hover {
            opacity: 0.7;
        }
    }

    &__body {
        flex: 1;
        overflow-y: auto;
        padding: var(--padding-sm);
    }

    &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--padding-lg);
        gap: var(--padding-sm);
    }

    &__empty-icon {
        width: 64px;
        height: 64px;
        color: var(--color-marron-light);
        opacity: 0.5;
    }

    &__empty-text {
        font-size: var(--font-md);
        color: var(--color-marron);
        opacity: 0.7;
        margin: 0;
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
    }

    &__item-image {
        width: 80px;
        height: 80px;
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
    }

    &__quantity {
        display: flex;
        align-items: center;
        gap: var(--padding-xs);
        border: var(--border);
        border-radius: calc(var(--border-radius) / 2);
        padding: var(--padding-xs);
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
        min-width: 24px;
        text-align: center;
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

    &__footer {
        padding: var(--padding-sm);
        border-top: var(--border);
        display: flex;
        flex-direction: column;
        gap: var(--padding-sm);
    }

    &__total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--padding-sm) 0;
    }

    &__total-label {
        font-size: var(--font-md);
        color: var(--color-marron);
        font-weight: 400;
    }

    &__total-price {
        font-size: var(--font-lg);
        color: var(--color-marron);
        font-weight: 500;
    }

    &__actions {
        display: flex;
        flex-direction: column;
        gap: var(--padding-xs);
    }

    &__button {
        padding: var(--padding-xs) var(--padding-sm);
        border: var(--border);
        border-radius: var(--border-radius);
        background-color: var(--color-marron);
        color: var(--color-beige);
        font-size: var(--font-sm);
        font-weight: 400;
        cursor: pointer;
        transition: opacity var(--transition);

        &:hover {
            opacity: 0.9;
        }

        &--secondary {
            background-color: transparent;
            color: var(--color-marron);
        }
    }
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity var(--transition);

    .cart-modal__content {
        transition: transform var(--transition);
    }
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;

    .cart-modal__content {
        transform: translateX(100%);
    }
}
</style>

