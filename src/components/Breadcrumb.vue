<script setup>
import { RouterLink } from 'vue-router'

defineOptions({
    name: 'BreadcrumbNav'
})

defineProps({
    items: {
        type: Array,
        required: true,
        default: () => []
    }
})
</script>

<template>
    <nav class="breadcrumb" aria-label="Fil d'Ariane">
        <ol class="breadcrumb__list">
            <li 
                v-for="(item, index) in items" 
                :key="index"
                class="breadcrumb__item"
            >
                <RouterLink 
                    v-if="item.to && index < items.length - 1"
                    :to="item.to"
                    class="breadcrumb__link"
                >
                    {{ item.label }}
                </RouterLink>
                <span 
                    v-else
                    class="breadcrumb__current"
                    :aria-current="index === items.length - 1 ? 'page' : undefined"
                >
                    {{ item.label }}
                </span>
                <span 
                    v-if="index < items.length - 1"
                    class="breadcrumb__separator"
                    aria-hidden="true"
                >
                    /
                </span>
            </li>
        </ol>
    </nav>
</template>

<style scoped lang="scss">
.breadcrumb {
    padding: var(--padding-xs) var(--padding-sm);
    background-color: var(--color-beige);
    
    &__list {
        max-width: var(--max-width);
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: var(--padding-xs);
        list-style: none;
        padding: 0;
        flex-wrap: wrap;
    }
    
    &__item {
        display: flex;
        align-items: center;
        gap: var(--padding-xs);
    }
    
    &__link {
        font-size: var(--font-sm);
        color: var(--color-marron);
        text-decoration: none;
        transition: opacity var(--transition);
        font-weight: 300;
        
        &:hover {
            opacity: 0.7;
        }
    }
    
    &__current {
        font-size: var(--font-sm);
        color: var(--color-marron);
        font-weight: 400;
    }
    
    &__separator {
        font-size: var(--font-sm);
        color: var(--color-marron);
        opacity: 0.5;
    }
}
</style>

