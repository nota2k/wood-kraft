<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import api from '@/services/api'
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

const subtotalPrice = computed(() => {
    return cartStore.totalPrice(productsStore)
})

const shippingMethods = ref([])
const selectedShippingMethodId = ref(null)
const promoCodeInput = ref('')
const appliedPromoCode = ref('')
const pricingLoading = ref(false)
const pricingError = ref('')
const promoFeedback = ref('')
const pricing = ref({
    subtotal: 0,
    discount_amount: 0,
    shipping_amount: 0,
    total: 0
})

const selectedShippingMethod = computed(() => {
    const selectedId = Number(selectedShippingMethodId.value)
    return shippingMethods.value.find(method => Number(method.id) === selectedId) || null
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

const handleApplyPromoCode = async () => {
    appliedPromoCode.value = promoCodeInput.value.trim()
    await recalculatePricing()
}

const handleRemovePromoCode = async () => {
    promoCodeInput.value = ''
    appliedPromoCode.value = ''
    promoFeedback.value = ''
    await recalculatePricing()
}

const formatPrice = (value) => {
    return `${Number(value || 0).toFixed(2)} €`
}

const recalculatePricing = async () => {
    if (cartStore.items.length === 0) {
        pricing.value = {
            subtotal: 0,
            discount_amount: 0,
            shipping_amount: 0,
            total: 0
        }
        pricingError.value = ''
        promoFeedback.value = ''
        return
    }

    pricingLoading.value = true
    pricingError.value = ''

    try {
        const payload = {
            items: cartStore.items,
            promoCode: appliedPromoCode.value || null,
            shippingMethodId: selectedShippingMethodId.value || null
        }

        const response = await api.getCheckoutPricing(payload)
        pricing.value = response

        if (response?.promo_validation) {
            promoFeedback.value = response.promo_validation.message || ''
            if (!response.promo_validation.is_valid) {
                appliedPromoCode.value = ''
            }
        } else {
            promoFeedback.value = ''
        }
    } catch (error) {
        pricingError.value = error?.data?.message || 'Impossible de recalculer le panier pour le moment.'
    } finally {
        pricingLoading.value = false
    }
}

const loadShippingMethods = async () => {
    try {
        shippingMethods.value = await api.getCheckoutShippingMethods()
        if (shippingMethods.value.length > 0 && !selectedShippingMethodId.value) {
            selectedShippingMethodId.value = shippingMethods.value[0].id
        }
    } catch (error) {
        pricingError.value = error?.data?.message || 'Impossible de charger les modes de livraison.'
    }
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

watch(
    () => cartStore.items,
    () => {
        void recalculatePricing()
    },
    { deep: true }
)

watch(selectedShippingMethodId, () => {
    void recalculatePricing()
})

onMounted(async () => {
    await loadShippingMethods()
    await recalculatePricing()
})
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
                    <div class="cart-view__section">
                        <label class="cart-view__field-label">Code promo</label>
                        <div class="cart-view__promo">
                            <input
                                v-model="promoCodeInput"
                                type="text"
                                class="cart-view__input"
                                placeholder="Ex: BIENVENUE10"
                            />
                            <button class="cart-view__button" @click="handleApplyPromoCode">
                                Appliquer
                            </button>
                        </div>
                        <p v-if="promoFeedback" class="cart-view__feedback">{{ promoFeedback }}</p>
                        <button
                            v-if="appliedPromoCode"
                            class="cart-view__link"
                            @click="handleRemovePromoCode"
                        >
                            Retirer le code promo
                        </button>
                    </div>

                    <div class="cart-view__section">
                        <label class="cart-view__field-label">Mode de livraison</label>
                        <select v-model="selectedShippingMethodId" class="cart-view__input">
                            <option :value="null">Sélectionnez un mode</option>
                            <option
                                v-for="method in shippingMethods"
                                :key="method.id"
                                :value="method.id"
                            >
                                {{ method.name }} - {{ formatPrice(method.price) }}
                            </option>
                        </select>
                        <p v-if="selectedShippingMethod?.free_from_amount" class="cart-view__feedback">
                            Livraison offerte dès {{ formatPrice(selectedShippingMethod.free_from_amount) }}.
                        </p>
                    </div>

                    <div v-if="pricingError" class="cart-view__error">{{ pricingError }}</div>

                    <div class="cart-view__totals">
                        <div class="cart-view__line">
                            <span>Sous-total</span>
                            <span>{{ formatPrice(pricing.subtotal ?? subtotalPrice) }}</span>
                        </div>
                        <div class="cart-view__line">
                            <span>Remise</span>
                            <span>- {{ formatPrice(pricing.discount_amount) }}</span>
                        </div>
                        <div class="cart-view__line">
                            <span>Livraison</span>
                            <span>{{ formatPrice(pricing.shipping_amount) }}</span>
                        </div>
                    </div>

                    <div class="cart-view__total">
                        <span class="cart-view__total-label">Total final</span>
                        <span class="cart-view__total-price">{{ formatPrice(pricing.total ?? subtotalPrice) }}</span>
                    </div>
                    <button
                        class="cart-view__button cart-view__button--primary"
                        :disabled="pricingLoading || !selectedShippingMethodId"
                    >
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

    &__section {
        margin-bottom: var(--padding-sm);
    }

    &__field-label {
        display: block;
        font-size: var(--font-sm);
        margin-bottom: 6px;
        color: var(--color-marron);
    }

    &__promo {
        display: flex;
        gap: 8px;
    }

    &__input {
        width: 100%;
        border: var(--border);
        border-radius: var(--border-radius);
        background: #fff;
        padding: 10px 12px;
        font-size: var(--font-sm);
        color: var(--color-marron);
    }

    &__feedback {
        margin: 8px 0 0;
        font-size: var(--font-xs);
        color: var(--color-marron);
    }

    &__link {
        margin-top: 6px;
        border: none;
        background: none;
        text-decoration: underline;
        padding: 0;
        cursor: pointer;
        color: var(--color-marron);
        font-size: var(--font-xs);
    }

    &__error {
        font-size: var(--font-xs);
        margin-bottom: 8px;
        color: #c43939;
    }

    &__totals {
        border-top: var(--border);
        border-bottom: var(--border);
        padding: 10px 0;
        margin-bottom: 10px;
    }

    &__line {
        display: flex;
        justify-content: space-between;
        font-size: var(--font-sm);
        margin-bottom: 6px;
        color: var(--color-marron);
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

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        &--primary {
            background-color: var(--color-marron);
            color: var(--color-beige);
        }
    }
}
</style>

