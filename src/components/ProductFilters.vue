<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'

const emit = defineEmits(['update-filters'])

const productsStore = useProductsStore()

const categories = computed(() => {
  return productsStore.categories.map(cat => ({
    value: cat.slug,
    label: cat.name
  }))
})

const selectedCategory = ref('')
const showNewOnly = ref(false)
const minPrice = ref(0)
const maxPrice = ref(5000)
const priceRange = ref({
    min: 0,
    max: 5000
})

onMounted(async () => {
  // Charger les catégories depuis l'API
  await productsStore.fetchCategories()
  
  // Déterminer le prix max depuis les produits si disponibles
  if (productsStore.products.length > 0) {
    const maxPriceValue = Math.max(...productsStore.products.map(p => p.price))
    maxPrice.value = Math.ceil(maxPriceValue / 100) * 100
    priceRange.value.max = maxPrice.value
  }
})

const getMinPercent = () => {
    return ((priceRange.value.min - minPrice.value) / (maxPrice.value - minPrice.value)) * 100
}

const getMaxPercent = () => {
    return ((priceRange.value.max - minPrice.value) / (maxPrice.value - minPrice.value)) * 100
}

const handleMinChange = (e) => {
    const value = parseInt(e.target.value)
    if (value >= priceRange.value.max) {
        priceRange.value.min = priceRange.value.max
    } else {
        priceRange.value.min = value
    }
    updateFilters()
}

const handleMaxChange = (e) => {
    const value = parseInt(e.target.value)
    if (value <= priceRange.value.min) {
        priceRange.value.max = priceRange.value.min
    } else {
        priceRange.value.max = value
    }
    updateFilters()
}

const updateFilters = () => {
    emit('update-filters', {
        category: selectedCategory.value,
        priceRange: {
            min: priceRange.value.min,
            max: priceRange.value.max
        },
        newOnly: showNewOnly.value
    })
}

const resetFilters = () => {
    selectedCategory.value = ''
    showNewOnly.value = false
    priceRange.value = {
        min: minPrice.value,
        max: maxPrice.value
    }
    updateFilters()
}
</script>

<template>
    <div class="product-filters">
        <div class="product-filters__container">
            <h3 class="product-filters__title">Filtres</h3>

            <!-- Filtre par catégorie -->
            <div class="product-filters__group category-filter">
                <select v-model="selectedCategory" @change="updateFilters" class="product-filters__select">
                    <option value="">Toutes les catégories</option>
                    <option v-for="category in categories" :key="category.value" :value="category.value">
                        {{ category.label }}
                    </option>
                </select>
            </div>

            <!-- Filtre par prix -->
            <div class="product-filters__group price-filter">
                <label class="product-filters__label">Prix</label>
                <div class="product-filters__price-range">
                    <div class="product-filters__slider-wrapper">
                        <div class="product-filters__slider-track"></div>
                        <div 
                            class="product-filters__slider-progress"
                            :style="{ left: getMinPercent() + '%', width: (getMaxPercent() - getMinPercent()) + '%' }"
                        ></div>
                        <input 
                            type="range" 
                            v-model.number="priceRange.min" 
                            :min="minPrice" 
                            :max="maxPrice"
                            @input="handleMinChange"
                            class="product-filters__range product-filters__range--min"
                        />
                        <input 
                            type="range" 
                            v-model.number="priceRange.max" 
                            :min="minPrice" 
                            :max="maxPrice"
                            @input="handleMaxChange"
                            class="product-filters__range product-filters__range--max"
                        />
                    </div>
                </div>
                <div class="product-filters__price-display">
                    <span>{{ priceRange.min }} €</span>
                    <span>{{ priceRange.max }} €</span>
                </div>
            </div>

            <!-- Filtre nouveautés -->
            <div class="product-filters__group new-filter">
                <label class="product-filters__label">Nouveautés</label>
                <div class="product-filters__checkbox-wrapper">
                    <input type="checkbox" id="new-products" v-model="showNewOnly" @change="updateFilters"
                        class="product-filters__checkbox" />
                </div>
            </div>

            <!-- Bouton réinitialiser -->
            <button @click="resetFilters" class="product-filters__reset">
                Réinitialiser
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.product-filters {
    padding: var(--padding-sm) var(--padding-sm);
    background-color: var(--color-beige);
    border: 2px solid var(--color-marron);
    border-radius: 20px;
    max-width: calc(50% - var(--padding-xs));

    h3{
        margin-bottom: -25px;
        font-size: var(--font-md);
    }

    &__container {
        max-width: 1280px;
        margin: 0 auto;
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
        align-items: flex-end;
    }

    &__title {
        font-size: var(--font-lg);
        color: var(--color-marron);
        font-weight: 400;
        margin: 0;
        width: 100%;
    }

    &__group {
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 200px;
        flex-grow: 1;

        &.category-filter {
            max-width: 200px;
            margin-right: var(--padding-xs);
        }

        &.price-filter {
            max-width: 200px;
        }

        &.new-filter {
            flex-direction: row-reverse;
            align-items: center;
            margin-bottom: var(--padding-xs);
            max-width: 150px;
            gap: var(--padding-xs);
            flex-wrap: nowrap;
        }
    }

    &__label {
        font-weight: 500;
    }

    &__select {

        font-family: "Regarn", sans-serif;
        font-size: var(--font-sm);
        color: var(--color-marron);
        background-color: var(--color-beige);
        border: 2px solid var(--color-marron);
        padding: 10px;
        border-radius: 30px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: var(--color-sable);
        }

        &:focus {
            outline: none;
            border-color: var(--color-vert-gris);
        }
    }

    &__price-range {
        display: flex;
        flex-direction: column;
        gap: var(--padding-xs);
    }

    &__slider-wrapper {
        position: relative;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
    }

    &__slider-track {
        position: absolute;
        width: 100%;
        height: 6px;
        background: var(--color-sable);
        border-radius: 3px;
        z-index: 1;
    }

    &__slider-progress {
        position: absolute;
        height: 4px;
        background: var(--color-marron);
        border-radius: 3px;
        z-index: 2;
    }

    &__range {
        position: absolute;
        width: 100%;
        height: 4px;
        background: transparent;
        outline: none;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        z-index: 3;
        pointer-events: none;

        &::-webkit-slider-thumb {
            appearance: none;
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            background: var(--color-marron);
            border-radius: 50%;
            cursor: pointer;
            pointer-events: all;
            border: 2px solid var(--color-beige);
        }

        &::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: var(--color-marron);
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid var(--color-beige);
            pointer-events: all;
        }

        &::-webkit-slider-runnable-track {
            background: transparent;
        }

        &::-moz-range-track {
            background: transparent;
        }
    }

    &__price-display {
        display: flex;
        justify-content: space-between;
    }

    &__checkbox-wrapper {
        display: flex;
        align-items: center;
        gap: var(--padding-xs);
    }

    &__checkbox {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: var(--color-marron);

    }

    &__checkbox-label {
        font-family: 'Regarn', sans-serif;
        font-size: var(--font-sm);
        color: var(--color-marron);
        font-weight: 300;
        cursor: pointer;
    }

    &__reset {
        border-radius: 30px;
        font-size: var(--font-sm);
        background-color: transparent;
        border: 2px solid var(--color-marron);
        padding: 10px 30px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
            background-color: var(--color-marron);
            color: var(--color-beige);
        }
    }
}
</style>
