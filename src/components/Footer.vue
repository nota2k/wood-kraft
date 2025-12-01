<script setup>
import { RouterLink } from 'vue-router'

defineOptions({
    name: 'SiteFooter'
})
</script>

<template>
    <footer class="footer">
        <div class="footer__container">
            <div class="footer__content">
                <div class="footer__section">
                    <h3 class="footer__title">Wood & Kraft</h3>
                    <p class="footer__description">
                        Création de meubles en bois sur mesure, alliant savoir-faire artisanal et design moderne.
                    </p>
                </div>

                <div class="footer__section">
                    <h4 class="footer__subtitle">Navigation</h4>
                    <nav class="footer__nav">
                        <RouterLink to="/" class="footer__link">Accueil</RouterLink>
                        <RouterLink to="/products" class="footer__link">Produits</RouterLink>
                    </nav>
                </div>

                <div class="footer__section">
                    <h4 class="footer__subtitle">Contact</h4>
                    <div class="footer__contact">
                        <p class="footer__text">Email: contact@woodkraft.fr</p>
                        <p class="footer__text">Téléphone: +33 1 23 45 67 89</p>
                    </div>
                </div>
            </div>

            <div class="footer__bottom">
                <p class="footer__copyright">
                    © {{ new Date().getFullYear() }} Wood & Kraft. Tous droits réservés.
                </p>
            </div>
        </div>
    </footer>
</template>

<style scoped lang="scss">
.footer {
    background-color: var(--color-marron);
    color: var(--color-beige);
    border-top: var(--border);
    margin-top: auto;

    &__container {
        max-width: var(--max-width);
        margin: 0 auto;
        padding: var(--padding-lg) var(--padding-sm);
    }

    &__content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--padding-md);
        margin-bottom: var(--padding-md);
    }

    &__section {
        display: flex;
        flex-direction: column;
        gap: var(--padding-xs);
    }

    &__title {
        font-family: 'Lovan', serif;
        font-size: var(--font-lg);
        font-weight: 300;
        color: var(--color-beige);
        margin: 0 0 var(--padding-xs) 0;
    }

    &__subtitle {
        font-size: var(--font-md);
        font-weight: 400;
        color: var(--color-beige);
        margin: 0 0 var(--padding-xs) 0;
    }

    &__description {
        font-size: var(--font-sm);
        line-height: 1.6;
        color: var(--color-beige);
        opacity: 0.9;
        margin: 0;
    }

    &__nav {
        display: flex;
        flex-direction: column;
        gap: var(--padding-xs);
    }

    &__link {
        font-size: var(--font-sm);
        color: var(--color-beige);
        text-decoration: none;
        transition: opacity var(--transition);
        opacity: 0.9;

        &:hover {
            opacity: 1;
        }
    }

    &__contact {
        display: flex;
        flex-direction: column;
        gap: var(--padding-xs);
    }

    &__text {
        font-size: var(--font-sm);
        color: var(--color-beige);
        opacity: 0.9;
        margin: 0;
    }

    &__bottom {
        border-top: 1px solid rgba(245, 244, 236, 0.2);
        padding-top: var(--padding-sm);
        text-align: center;
    }

    &__copyright {
        font-size: var(--font-xs);
        color: var(--color-beige);
        opacity: 0.8;
        margin: 0;
    }
}
</style>

