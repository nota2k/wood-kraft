<template>
    <div class="product-filters">
        <div class="product-filters__container">
            <h3 class="product-filters__title">Filtres</h3>

            <!-- Filtre par catégorie -->
            <div class="product-filters__group">
                <label class="product-filters__label">Catégorie</label>
                <select v-model="selectedCategory" @change="updateFilters" class="product-filters__select">
                    <option value="">Toutes les catégories</option>
                    <option v-for="category in categories" :key="category.value" :value="category.value">
                        {{ category.label }}
                    </option>
                </select>
            </div>

            <!-- Filtre par prix -->
            <div class="product-filters__group">
                <label class="product-filters__label">Prix</label>
                <div class="product-filters__price-range">
                    <input type="range" v-model.number="priceRange.min" :min="minPrice" :max="maxPrice"
                        @input="updateFilters" class="product-filters__range" />
                    <input type="range" v-model.number="priceRange.max" :min="minPrice" :max="maxPrice"
                        @input="updateFilters" class="product-filters__range" />
                </div>
                <div class="product-filters__price-display">
                    <span>{{ priceRange.min }} €</span>
                    <span> - </span>
                    <span>{{ priceRange.max }} €</span>
                </div>
            </div>

            <!-- Filtre nouveautés -->
            <div class="product-filters__group">
                <label class="product-filters__label">Nouveautés</label>
                <div class="product-filters__checkbox-wrapper">
                    <input type="checkbox" id="new-products" v-model="showNewOnly" @change="updateFilters"
                        class="product-filters__checkbox" />
                    <label for="new-products" class="product-filters__checkbox-label">
                        Afficher uniquement les nouveautés
                    </label>
                </div>
            </div>

            <!-- Bouton réinitialiser -->
            <button @click="resetFilters" class="product-filters__reset">
                Réinitialiser
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['update-filters'])

const categories = ref([
    { value: 'tables', label: 'Tables' },
    { value: 'chairs', label: 'Chaises' },
    { value: 'storage', label: 'Rangements' },
    { value: 'shelves', label: 'Étagères' },
    { value: 'decorative', label: 'Décoratif' }
])

const selectedCategory = ref('')
const showNewOnly = ref(false)
const minPrice = ref(0)
const maxPrice = ref(5000)
const priceRange = ref({
    min: 0,
    max: 5000
})

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

<style scoped lang="scss">
.product-filters {
    padding: var(--padding-sm) var(--padding-sm);
    background-color: var(--color-beige);
    border: 2px solid var(--color-marron);
    border-radius: 20px;
    max-width: calc(100% - var(--padding-xs));

    &__container {
        max-width: 1280px;
        margin: 0 auto;
        display: flex;
        gap: var(--padding-xs);
        flex-wrap: wrap;
        align-items: flex-end;
    }

    &__title {
        font-family: 'Regarn', sans-serif;
        font-size: var(--font-lg);
        color: var(--color-marron);
        font-weight: 400;
        margin: 0;
        width: 100%;
    }

    &__group {
        display: flex;
        flex-direction: column;
        gap: var(--padding-xs);
        min-width: 200px;
        flex: 1;
    }

    &__label {
        font-family: 'Regarn', sans-serif;
        font-size: var(--font-sm);
        color: var(--color-marron);
        font-weight: 300;
    }

    &__select {

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

    &__range {
        width: 100%;
        height: 6px;
        background: var(--color-sable);
        border-radius: 3px;
        outline: none;
        cursor: pointer;

        &::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            background: var(--color-marron);
            border-radius: 50%;
            cursor: pointer;
        }

        &::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: var(--color-marron);
            border-radius: 50%;
            cursor: pointer;
            border: none;
        }
    }

    &__price-display {
        display: flex;
        justify-content: space-between;
        font-family: 'Regarn', sans-serif;
        font-size: var(--font-sm);
        color: var(--color-marron);
        font-weight: 300;
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
        font-family: 'Regarn', sans-serif;
        font-size: var(--font-sm);
        color: var(--color-marron);
        background-color: transparent;
        border: 2px solid var(--color-marron);
        padding: var(--padding-xs) var(--padding-sm);
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 300;
        align-self: flex-end;

        &:hover {
            background-color: var(--color-marron);
            color: var(--color-beige);
        }
    }
}
</style>
