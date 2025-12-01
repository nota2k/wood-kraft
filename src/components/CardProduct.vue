<script setup>
import { RouterLink } from 'vue-router'

defineOptions({
    name: 'CardProduct'
})

defineProps({
    product: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <RouterLink :to="`/product/${product.id}`" class="card-product">
        <div class="card-product__image-wrapper">
            <img :src="product.image || product.images[0]" :alt="product.name" class="card-product__image" />
        </div>
        <div class="card-product__info">
            <div class="card-product__label-wrapper">
                <p class="card-product__label">{{ product.name }}</p>
            </div>
            <div class="card-product__price-wrapper">
                <p class="card-product__price">{{ product.price }} €</p>
            </div>
        </div>
    </RouterLink>
</template>

<style scoped lang="scss">
.card-product {
    display: grid;
    grid-template-rows: auto 110px;
    outline: var(--border);
    background-color: var(--color-beige);
    transition: transform var(--transition), box-shadow var(--transition);
    text-decoration: none;
    color: inherit;
    cursor: pointer;

    &__image-wrapper {
        width: 100%;
        aspect-ratio: 4/4;
        overflow: hidden;
        position: relative;
        outline:2px solid var(--color-marron);
        background-color: #f0f0f0;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            background-color: var(--color-marron);
            transition: opacity var(--transition);
            mix-blend-mode: color;
            pointer-events: none;
        }
    }

    &:hover &__image-wrapper::after {
        opacity: 1;
    }

    &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__info {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        border-top: 2px solid var(--color-marron);
    }

    &__label-wrapper {
        padding: var(--padding-xs) var(--padding-sm);
        display: flex;
        align-items: center;
        flex-grow: 2;
        font-size: var(--font-md);
        color: var(--color-marron);
        font-weight: 300;
        border-right: 2px solid var(--color-marron);
    }

    &__label {
        margin: 0;
    }

    &__price-wrapper {
        padding: var(--padding-xs) var(--padding-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 130px;
        font-size: var(--font-md);
        color: var(--color-marron);
        font-weight: 300;
    }

    &__price {
        margin: 0;
    }
}
</style>
