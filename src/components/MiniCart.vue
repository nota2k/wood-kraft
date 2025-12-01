<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { ShoppingBag } from 'lucide-vue-next'

defineOptions({
    name: 'MiniCart'
})

const emit = defineEmits(['click'])

const cartStore = useCartStore()

const itemCount = computed(() => cartStore.totalItems)

const handleClick = () => {
    emit('click')
}
</script>

<template>
    <button class="mini-cart" @click="handleClick" aria-label="Panier">
        <ShoppingBag class="mini-cart__icon" />
        <span v-if="itemCount > 0" class="mini-cart__badge">{{ itemCount }}</span>
    </button>
</template>

<style scoped lang="scss">
.mini-cart {
    position: relative;
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

    &__icon {
        width: 24px;
        height: 24px;
    }

    &__badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: var(--color-marron);
        color: var(--color-beige);
        border-radius: 50%;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-xs);
        font-weight: 500;
        transform: translate(25%, -25%);
    }
}
</style>

