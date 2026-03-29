<template>
  <div class="products-admin">
    <div class="page-header">
      <div>
        <h1 class="page-title">Produits</h1>
        <p class="page-subtitle">{{ pagination.total ?? 0 }} produit(s) au total</p>
      </div>
      <RouterLink :to="{ name: 'admin-product-create' }" class="btn-primary">
        <Plus :size="18" />
        Nouveau produit
      </RouterLink>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-box">
        <Search :size="16" class="search-icon" />
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un produit..."
          @input="debouncedSearch"
        />
      </div>
      <select v-model="selectedCategory" @change="loadProducts(1)" class="filter-select">
        <option value="">Toutes les catégories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <div v-if="loading" class="table-loading">
        <div class="spinner"></div>
      </div>

      <table v-else class="products-table">
        <thead>
          <tr>
            <th style="width:50px"></th>
            <th>Produit</th>
            <th>Référence</th>
            <th>Catégories</th>
            <th>Prix</th>
            <th>Stock</th>
            <th style="width:100px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="products.length === 0">
            <td colspan="7" class="empty-row">
              <PackageX :size="32" />
              <p>Aucun produit trouvé</p>
            </td>
          </tr>
          <tr v-for="product in products" :key="product.id">
            <td>
              <img
                v-if="getProductImage(product)"
                :src="getProductImage(product)"
                :alt="product.title"
                class="product-thumb"
              />
              <div v-else class="thumb-placeholder">
                <ImageIcon :size="14" />
              </div>
            </td>
            <td class="product-name">{{ product.title }}</td>
            <td class="muted">{{ product.reference || '—' }}</td>
            <td>
              <span
                v-for="cat in (product.categories || [])"
                :key="cat.id"
                class="category-tag"
              >{{ cat.name }}</span>
              <span v-if="!product.categories?.length" class="muted">—</span>
            </td>
            <td class="price">{{ formatPrice(product.price) }}</td>
            <td>
              <span class="stock-badge" :class="getStockClass(product.quantity)">
                {{ product.quantity ?? '—' }}
              </span>
            </td>
            <td>
              <div class="row-actions">
                <RouterLink
                  :to="{ name: 'admin-product-edit', params: { id: product.id } }"
                  class="action-btn edit"
                  title="Modifier"
                >
                  <Pencil :size="15" />
                </RouterLink>
                <button
                  class="action-btn delete"
                  title="Supprimer"
                  @click="confirmDelete(product)"
                >
                  <Trash2 :size="15" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination">
      <button
        class="page-btn"
        :disabled="pagination.current_page === 1"
        @click="loadProducts(pagination.current_page - 1)"
      >
        <ChevronLeft :size="16" />
      </button>
      <span class="page-info">
        Page {{ pagination.current_page }} / {{ pagination.last_page }}
      </span>
      <button
        class="page-btn"
        :disabled="pagination.current_page === pagination.last_page"
        @click="loadProducts(pagination.current_page + 1)"
      >
        <ChevronRight :size="16" />
      </button>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal">
        <h3>Supprimer le produit ?</h3>
        <p>Cette action est irréversible. Le produit <strong>{{ deleteTarget.title }}</strong> sera définitivement supprimé.</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="deleteTarget = null">Annuler</button>
          <button class="btn-delete" :disabled="deleting" @click="executeDelete">
            <span v-if="deleting" class="spinner-sm"></span>
            <span v-else>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import {
  Plus, Search, Pencil, Trash2, PackageX, ImageIcon,
  ChevronLeft, ChevronRight
} from 'lucide-vue-next'

const products = ref([])
const categories = ref([])
const loading = ref(true)
const search = ref('')
const selectedCategory = ref('')
const pagination = ref({ current_page: 1, last_page: 1, total: 0 })
const deleteTarget = ref(null)
const deleting = ref(false)

let searchTimeout = null

onMounted(async () => {
  await Promise.all([loadProducts(1), loadCategories()])
})

async function loadProducts(page = 1) {
  loading.value = true
  try {
    const params = { page, per_page: 15 }
    if (search.value) params.search = search.value
    if (selectedCategory.value) params.category_id = selectedCategory.value

    const data = await api.getProducts(params)
    products.value = data.data || []
    pagination.value = {
      current_page: data.current_page,
      last_page: data.last_page,
      total: data.total,
    }
  } catch {
    products.value = []
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    const data = await api.getCategories()
    categories.value = data.data || data || []
  } catch {
    categories.value = []
  }
}

function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => loadProducts(1), 400)
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

function confirmDelete(product) {
  deleteTarget.value = product
}

async function executeDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.deleteProduct(deleteTarget.value.id)
    deleteTarget.value = null
    await loadProducts(pagination.value.current_page)
  } catch (e) {
    alert(e.data?.message || 'Erreur lors de la suppression.')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.products-admin { max-width: 1200px; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.page-title {
  font-size: 1.75rem;
  color: var(--color-dark);
  margin: 0 0 0.25rem;
}

.page-subtitle {
  color: var(--color-marron-light);
  margin: 0;
  font-size: 0.875rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--color-marron);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--color-marron-dark);
}

/* Filters */
.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-marron-light);
  pointer-events: none;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1.5px solid var(--color-sable);
  border-radius: 10px;
  font-size: 0.9rem;
  background: white;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.search-box input:focus { border-color: var(--color-marron); }

.filter-select {
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--color-sable);
  border-radius: 10px;
  font-size: 0.9rem;
  background: white;
  color: var(--color-dark);
  outline: none;
  cursor: pointer;
  min-width: 180px;
}

/* Table */
.table-wrapper {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(60, 58, 31, 0.06);
  position: relative;
  min-height: 200px;
}

.table-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.8);
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

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-marron-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #fafaf7;
  border-bottom: 1px solid var(--color-sable);
}

.products-table td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--color-dark);
  border-bottom: 1px solid #f5f4ec;
  vertical-align: middle;
}

.products-table tr:last-child td { border-bottom: none; }
.products-table tr:hover td { background: #fafaf7; }

.product-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.thumb-placeholder {
  width: 40px;
  height: 40px;
  background: var(--color-sable);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-marron-light);
}

.product-name { font-weight: 500; }
.muted { color: var(--color-marron-light); }
.price { font-weight: 600; }

.category-tag {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  background: var(--color-sable);
  border-radius: 4px;
  font-size: 0.75rem;
  margin-right: 0.25rem;
}

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

.row-actions {
  display: flex;
  gap: 0.375rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  text-decoration: none;
}

.action-btn.edit {
  background: #fef3e8;
  color: var(--color-marron);
}

.action-btn.edit:hover { background: var(--color-marron); color: white; }

.action-btn.delete {
  background: #fdecea;
  color: #c62828;
}

.action-btn.delete:hover { background: #c62828; color: white; }

.empty-row {
  text-align: center;
  padding: 3rem !important;
  color: var(--color-marron-light);
}

.empty-row p { margin: 0.5rem 0 0; }

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1.5px solid var(--color-sable);
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
}

.page-btn:hover:not(:disabled) { border-color: var(--color-marron); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.page-info {
  font-size: 0.875rem;
  color: var(--color-marron-light);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 420px;
  width: 100%;
}

.modal h3 {
  margin: 0 0 0.75rem;
  color: var(--color-dark);
}

.modal p {
  color: var(--color-marron-light);
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 0.625rem 1.25rem;
  border: 1.5px solid var(--color-sable);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-delete {
  padding: 0.625rem 1.25rem;
  background: #c62828;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-delete:disabled { opacity: 0.7; cursor: not-allowed; }

.spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
</style>
