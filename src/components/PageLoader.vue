<script setup>
defineOptions({
    name: 'PageLoader'
})

defineProps({
    isLoading: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <Transition name="loader">
        <div v-if="isLoading" class="page-loader">
            <div class="page-loader__spinner"></div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.page-loader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-beige);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;

    &__spinner {
        width: 50px;
        height: 50px;
        border: 3px solid var(--color-marron-light);
        border-top-color: var(--color-marron);
        border-radius: 50%;
        animation: spin var(--transition) linear infinite;
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loader-enter-active,
.loader-leave-active {
    transition: opacity var(--transition);
}

.loader-enter-from,
.loader-leave-to {
    opacity: 0;
}
</style>

