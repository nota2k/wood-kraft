<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 class="page-title">Tableau de bord</h1>
      <p class="page-subtitle">Bienvenue, {{ adminStore.user?.name || 'Admin' }}</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon products">
            <Package :size="22" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.total_products ?? '—' }}</span>
            <span class="stat-label">Produits</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon categories">
            <Tag :size="22" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.total_categories ?? '—' }}</span>
            <span class="stat-label">Catégories</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stock">
            <AlertCircle :size="22" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.low_stock ?? '—' }}</span>
            <span class="stat-label">Stock faible</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon new">
            <Sparkles :size="22" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.new_products ?? '—' }}</span>
            <span class="stat-label">Nouveautés</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section">
        <h2 class="section-title">Actions rapides</h2>
        <div class="actions-grid">
          <RouterLink :to="{ name: 'admin-product-create' }" class="action-card">
            <Plus :size="24" />
            <span>Nouveau produit</span>
          </RouterLink>
          <RouterLink :to="{ name: 'admin-categories' }" class="action-card">
            <FolderPlus :size="24" />
            <span>Gérer les catégories</span>
          </RouterLink>
          <RouterLink :to="{ name: 'admin-products' }" class="action-card">
            <List :size="24" />
            <span>Voir tous les produits</span>
          </RouterLink>
        </div>
      </div>

      <!-- Recent Products -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Derniers produits</h2>
          <RouterLink :to="{ name: 'admin-products' }" class="see-all">
            Voir tout <ArrowRight :size="16" />
          </RouterLink>
        </div>
        <div class="recent-table-wrapper">
          <table class="recent-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Référence</th>
                <th>Prix</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="recentProducts.length === 0">
                <td colspan="5" class="empty-row">Aucun produit</td>
              </tr>
              <tr v-for="product in recentProducts" :key="product.id">
                <td class="product-cell">
                  <img
                    v-if="getProductImage(product)"
                    :src="getProductImage(product)"
                    :alt="product.title"
                    class="product-thumb"
                  />
                  <div v-else class="product-thumb-placeholder">
                    <ImageIcon :size="16" />
                  </div>
                  <span>{{ product.title }}</span>
                </td>
                <td class="muted">{{ product.reference || '—' }}</td>
                <td>{{ formatPrice(product.price) }}</td>
                <td>
                  <span class="stock-badge" :class="getStockClass(product.quantity)">
                    {{ product.quantity ?? '—' }}
                  </span>
                </td>
                <td>
                  <RouterLink :to="{ name: 'admin-product-edit', params: { id: product.id } }" class="edit-link">
                    <Pencil :size="15" />
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import api from '@/services/api'
import {
  Package, Tag, AlertCircle, Sparkles, Plus, FolderPlus, List,
  ArrowRight, Pencil, ImageIcon
} from 'lucide-vue-next'

const adminStore = useAdminStore()
const loading = ref(true)
const stats = ref({})
const recentProducts = ref([])

onMounted(async () => {
  await Promise.allSettled([loadStats(), loadRecentProducts()])
  loading.value = false
})

async function loadStats() {
  try {
    const data = await api.getStats()
    stats.value = data
  } catch {
    // Les stats peuvent ne pas être disponibles
  }
}

async function loadRecentProducts() {
  try {
    const data = await api.getProducts({ per_page: 5, page: 1 })
    recentProducts.value = data.data || []
  } catch {
    recentProducts.value = []
  }
}

function getProductImage(product) {
  if (!product.images?.length) return null
  const main = product.images.find(i => i.is_default) || product.images[0]
  return main?.image_path || null
}

function formatPrice(price) {
  if (price == null) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

function getStockClass(qty) {
  if (qty == null) return ''
  if (qty === 0) return 'out'
  if (qty <= 3) return 'low'
  return 'ok'
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  color: var(--color-dark);
  margin: 0 0 0.25rem;
}

.page-subtitle {
  color: var(--color-marron-light);
  margin: 0;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-sable);
  border-top-color: var(--color-marron);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: white;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(60, 58, 31, 0.06);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.products { background: #fef3e8; color: var(--color-marron); }
.stat-icon.categories { background: #e8f5e9; color: #388e3c; }
.stat-icon.stock { background: #fdecea; color: #c62828; }
.stat-icon.new { background: #f3e8ff; color: #7b1fa2; }

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-dark);
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: var(--color-marron-light);
  margin-top: 0.25rem;
}

/* Sections */
.section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.1rem;
  color: var(--color-dark);
  margin: 0 0 1rem;
  font-weight: 600;
}

.see-all {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-marron);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Actions */
.actions-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1.25rem;
  background: white;
  border: 1.5px solid var(--color-sable);
  border-radius: 12px;
  color: var(--color-dark);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: border-color 0.2s, background 0.2s;
}

.action-card:hover {
  border-color: var(--color-marron);
  background: #fdf9f5;
}

/* Table */
.recent-table-wrapper {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(60, 58, 31, 0.06);
}

.recent-table {
  width: 100%;
  border-collapse: collapse;
}

.recent-table th {
  padding: 0.875rem 1.25rem;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-marron-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #fafaf7;
  border-bottom: 1px solid var(--color-sable);
}

.recent-table td {
  padding: 0.875rem 1.25rem;
  font-size: 0.9rem;
  color: var(--color-dark);
  border-bottom: 1px solid #f5f4ec;
}

.recent-table tr:last-child td {
  border-bottom: none;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.product-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.product-thumb-placeholder {
  width: 40px;
  height: 40px;
  background: var(--color-sable);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-marron-light);
  flex-shrink: 0;
}

.muted { color: var(--color-marron-light); }

.stock-badge {
  display: inline-block;
  padding: 0.2rem 0.625rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.stock-badge.ok { background: #e8f5e9; color: #388e3c; }
.stock-badge.low { background: #fff3e0; color: #e65100; }
.stock-badge.out { background: #fdecea; color: #c62828; }

.edit-link {
  color: var(--color-marron-light);
  transition: color 0.2s;
}

.edit-link:hover { color: var(--color-marron); }

.empty-row {
  text-align: center;
  color: var(--color-marron-light);
  padding: 2rem !important;
}
</style>
