<script setup>
import { computed, onMounted, ref } from 'vue'
import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useProductsStore } from '@/stores/products'
import CardProduct from './CardProduct.vue'

const props = defineProps({
    currentProductId: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: null
    },
    limit: {
        type: Number,
        default: 6
    }
})

const productsStore = useProductsStore()
const sliderRef = ref(null)

const suggestedProducts = computed(() => {
    let categoryProducts = []
    let otherProducts = []

    if (props.category) {
        // Produits de la même catégorie
        categoryProducts = productsStore.getProductsByCategory(props.category)
            .filter(product => product.id !== props.currentProductId)
        
        // Si on n'a pas assez de produits dans la catégorie, compléter avec d'autres produits
        if (categoryProducts.length < props.limit) {
            otherProducts = productsStore.getAllProducts
                .filter(product => 
                    product.id !== props.currentProductId && 
                    product.category !== props.category
                )
                .slice(0, props.limit - categoryProducts.length)
        }
    } else {
        // Pas de catégorie spécifiée, prendre tous les produits
        categoryProducts = productsStore.getAllProducts
            .filter(product => product.id !== props.currentProductId)
    }

    // Combiner et limiter à 6 produits maximum
    const filtered = [...categoryProducts, ...otherProducts].slice(0, props.limit)
    
    console.log('Produits suggérés:', filtered)
    console.log('Nombre de produits:', filtered.length)
    
    return filtered
})

onMounted(() => {
    if (sliderRef.value && suggestedProducts.value.length > 0) {
        new Swiper(sliderRef.value, {
            slidesPerView: '3',
            spaceBetween: 0,
            loop: true,
            modules: [Navigation],
            navigation: {
                nextEl: '.product-suggestions__button-next',
                prevEl: '.product-suggestions__button-prev',
            },
            pagination: {
                el: '.product-suggestions__pagination',
                clickable: true,
            },
        })
    }
})
</script>

<template>
    <section class="product-suggestions" v-if="suggestedProducts.length > 0">
        <h2 class="product-suggestions__title">Produits suggérés</h2>
        <div class="product-suggestions__container">
            <div class="swiper product-suggestions__slider" ref="sliderRef">
                <div class="swiper-wrapper">
                    <div 
                        v-for="product in suggestedProducts" 
                        :key="product.id"
                        class="swiper-slide"
                    >
                        <CardProduct :product="product" />
                    </div>
                </div>
            </div>
            <div class="product-suggestions__button-prev"></div>
            <div class="product-suggestions__button-next"></div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.product-suggestions {
    padding: var(--padding-xs) var(--padding-sm);
    background-color: var(--color-beige);
    border-top: var(--border);
    max-width: 100%;
    display: block;

    &__title {
        font-family: 'Lovan', serif;
        grid-column: 1 / -1;
        font-size: var(--font-lg);
        font-weight: 300;
        color: var(--color-marron);
    }

    &__container {
        max-width: var(--max-width);
        margin: 2rem auto 0 auto;
        position: relative;
    }

    &__slider {
        overflow: visible;
    }

    &__button-prev,
    &__button-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: var(--border);
        // background-color: var(--color-beige);
        color: var(--color-marron);
        cursor: pointer;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color var(--transition);
        
        &::after {
            font-size: 18px;
            font-weight: bold;
        }
        
        &:hover {
            background-color: var(--color-sable);
        }
        
        &.swiper-button-disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    &__button-prev {
        left: -60px;
    }

    &__button-next {
        right: -60px;
    }

    :deep(.swiper-slide) {
        width: auto;
        height: auto;
    }
}
</style>
