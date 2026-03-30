# Tests unitaires — wood-kraft (Vue 3 + Vitest)

Document **vivant** : l’agent (ou le développeur) exécute les commandes ci-dessous, met à jour les sections « État » et « Inventaire des tests », et complète la file d’attente quand le périmètre change.

## Outils

| Outil | Rôle |
|-------|------|
| [Vitest](https://vitest.dev/) | Lanceur, assertions, mocks (`vi`) |
| `jsdom` | DOM dans les tests (via `vitest.config.js`) |
| [@vue/test-utils](https://test-utils.vuejs.org/) | Montage de composants `.vue` |
| `@vitest/eslint-plugin` | Règles ESLint alignées sur Vitest |

## Commandes (depuis `wood-kraft/`)

```bash
# Tous les tests, une fois (CI / validation)
npm run test:unit -- --run

# Mode interactif / watch pendant le dev
npm run test:unit

# Un fichier précis
npm run test:unit -- --run src/services/api.spec.js

# Rapport de couverture (à ajouter au besoin : voir section Évolution)
# npm run test:unit -- --run --coverage
```

## Conventions

- **Fichiers** : même dossier que le code testé, suffixe **`.spec.js`** (ex. `src/services/api.spec.js`, `src/stores/cart.spec.js`).
- **Nommage** : `describe('Module ou composant', …)` puis `it('comportement attendu', …)`.
- **Pas de tests dans `dist/`** — déjà exclus par le build.
- **Pinia** : utiliser une instance dédiée (`createPinia()` + `setActivePinia`) dans les tests de stores.
- **API / `fetch`** : `vi.stubGlobal('fetch', …)` ou `vi.spyOn(api, 'get')` selon le cas.
- **Variables d’env** : `vi.stubEnv('VITE_API_BASE_URL', 'http://test.example/api/v1')` si un module lit `import.meta.env` au chargement.

## Périmètre prioritaire (WoodKraft)

1. **`src/services/api.js`** — cookies CSRF, construction d’URL, erreurs `401`/`skipAuthRedirect` (avec `fetch` mocké).
2. **Stores Pinia** — `cart.js`, `session.js`, `admin.js` (actions critiques, pas de rendu réel).
3. **Composants** — props/événements (`emits`), pas toute la mise en page : `ProductFilters`, boutons, modales.
4. **Composables / utils** — toute logique extraite dans des fonctions pures (facile à tester).

## État de la suite (à mettre à jour après chaque passage sérieux)

| Champ | Valeur |
|-------------|--------|
| **Dernière exécution** | 2026-03-30 — `npm run test:unit -- --run` |
| **Résultat** | OK — 1 fichier, 2 tests |
| **Notes** | Couverture minimale (`getCookie`) ; étendre vers `request` avec `fetch` mocké. |

## Inventaire des fichiers de test

| Fichier | Couvre |
|---------|--------|
| `src/services/api.spec.js` | `ApiService` — cookies (`getCookie`) |
| _à ajouter_ | _stores, composants, etc._ |

## File d’attente / dette

- [ ] Store panier : `syncCart` / persistance
- [ ] Store session : hydration / `localStorage`
- [ ] Router : gardes (mock `localStorage` + navigation)
- [ ] Composants à forte logique métier (liste priorisée par besoin produit)

---

## Instructions pour l’agent Cursor

1. **Avant** d’ajouter de la logique métier dans le front ou de modifier `api.js` / les stores : vérifier s’il existe un test ; sinon le prévoir ou l’écrire.
2. **Après** avoir ajouté ou modifié des tests : lancer `npm run test:unit -- --run` depuis `wood-kraft/`, mettre à jour le tableau **État de la suite** et **Inventaire** dans ce fichier.
3. **Mettre à jour** la **File d’attente** (cocher ou ajouter des lignes) quand une zone est couverte ou qu’une nouvelle zone sensible apparaît.
4. En cas d’échec : corriger le code ou le test, ne pas laisser la suite rouge sans le mentionner dans **Notes**.

## Évolution (optionnel)

- Pour activer la couverture : ajouter dans `package.json` un script du type `test:unit:coverage` avec `vitest --run --coverage` et la dépendance `@vitest/coverage-v8` si besoin, puis documenter le seuil ici.
