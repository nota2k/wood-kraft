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
        // Produits de la même catégorie (utiliser le slug)
        categoryProducts = productsStore.getProductsByCategory(props.category)
            .filter(product => product.id !== props.currentProductId)

        // Si on n'a pas assez de produits dans la catégorie, compléter avec d'autres produits
        if (categoryProducts.length < props.limit) {
            otherProducts = productsStore.getAllProducts
                .filter(product => {
                    const isNotCurrent = product.id !== props.currentProductId
                    const isNotSameCategory = !product.categories.some(cat => cat.slug === props.category)
                    return isNotCurrent && isNotSameCategory
                })
                .slice(0, props.limit - categoryProducts.length)
        }
    } else {
        // Pas de catégorie spécifiée, prendre tous les produits
        categoryProducts = productsStore.getAllProducts
            .filter(product => product.id !== props.currentProductId)
    }

    // Combiner et limiter au nombre de produits demandé
    const filtered = [...categoryProducts, ...otherProducts].slice(0, props.limit)

    return filtered
})

onMounted(async () => {
    // Charger les produits depuis l'API s'ils ne sont pas déjà chargés
    if (productsStore.products.length === 0) {
        await productsStore.fetchProducts({ per_page: 20 })
    }

    // Initialiser le slider Swiper
    if (sliderRef.value && suggestedProducts.value.length > 0) {
        new Swiper(sliderRef.value, {
            slidesPerView: 1,
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
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 0,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 0,
                },
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
                    <div v-for="product in suggestedProducts" :key="product.id" class="swiper-slide">
                        <CardProduct :product="product" />
                    </div>
                </div>
            </div>
            <div class="product-suggestions__button-prev"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left">
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                </svg></div>
            <div class="product-suggestions__button-next"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="lucide lucide-arrow-right-icon lucide-arrow-right">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                </svg></div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.product-suggestions {
    padding: var(--padding-xs) var(--padding-sm);
    background-color: var(--color-beige);
    border-top: var(--border);
    grid-column: 1 / -1; // span la grille parente
    display: block;
    overflow: hidden; // empêche les slides de sortir

    &__title {
        font-family: 'Lovan', serif;
        font-size: var(--font-lg);
        font-weight: 300;
        color: var(--color-marron);
        margin-bottom: 2rem;
    }

    &__container {
        width: 100%;
        margin: 0 auto;
        position: relative;
    }

    &__slider {
        overflow: hidden;
        width: 100%;
        // Padding pour que les bordures des cartes ne soient pas rognées
        padding: 2px;
        box-sizing: border-box;
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
        color: var(--color-marron);
        background: var(--color-sable);
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
            background-color: var(--color-marron);
            color: var(--color-sable);
            border-color: var(--color-sable);
        }

        &.swiper-button-disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    &__button-prev {
        left: 20px;

        @media (max-width: 768px) {
            left: 0;
        }
    }

    &__button-next {
        right: 20px;

        @media (max-width: 768px) {
            right: 0;
        }
    }

    :deep(.swiper-slide) {
        height: auto;
    }

    :deep(.card-product) {
        width: 100%;
        height: 100%;
        outline: none;
        border: var(--border);
        border-right: none; // évite la double bordure entre les slides
    }
}
</style>
