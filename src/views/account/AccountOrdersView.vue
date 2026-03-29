<template>
  <div class="account-orders">
    <div class="page-header">
      <h1 class="page-title">Mes commandes</h1>
      <p class="page-subtitle">Consultez l'historique et le statut de vos commandes.</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement de vos commandes...</p>
    </div>

    <div v-else-if="orders.length === 0" class="empty-state">
      <ShoppingBag :size="48" />
      <p>Vous n'avez pas encore passé de commande sur Wood&Kraft.</p>
      <RouterLink to="/" class="btn-shop">Découvrir la boutique</RouterLink>
    </div>

    <div v-else class="orders-container">
      <table class="orders-table card">
        <thead>
          <tr>
            <th>Commande</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Total</th>
            <th class="actions">Détails</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="order-row">
            <td class="order-id">#{{ order.order_number }}</td>
            <td class="order-date">{{ formatDate(order.created_at) }}</td>
            <td>
              <span class="status-badge" :class="order.status">{{ formatStatus(order.status) }}</span>
            </td>
            <td class="order-total">{{ formatPrice(order.total_amount) }}</td>
            <td class="actions">
              <button class="btn-detail" @click="$router.push({ name: 'account-order-detail', params: { id: order.id } })">
                <Eye :size="18" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination simple -->
      <div v-if="pagination.total > pagination.per_page" class="pagination">
        <button class="btn-page" :disabled="pagination.current_page === 1" @click="fetchOrders(pagination.current_page - 1)">Précédent</button>
        <span class="page-info">Page {{ pagination.current_page }} sur {{ pagination.last_page }}</span>
        <button class="btn-page" :disabled="pagination.current_page === pagination.last_page" @click="fetchOrders(pagination.current_page + 1)">Suivant</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/services/api'
import { ShoppingBag, Eye } from 'lucide-vue-next'

const orders = ref([])
const loading = ref(true)
const pagination = reactive({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 10
})

const fetchOrders = async (page = 1) => {
  loading.value = true
  try {
    const response = await api.get(`/customer/orders?page=${page}`)
    orders.value = response.data
    pagination.current_page = response.current_page
    pagination.last_page = response.last_page
    pagination.total = response.total
    pagination.per_page = response.per_page
  } catch (err) {
    console.error('Erreur commandes account:', err)
  } finally {
    loading.value = false
  }
}

function formatStatus(status) {
  const statuses = {
    pending: 'En attente',
    processing: 'En préparation',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    returned: 'Retournée'
  }
  return statuses[status] || status
}

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString))
}

onMounted(() => fetchOrders())
</script>

<style scoped>
.page-header {
  margin-bottom: 3rem;
}

.page-title {
  font-family: 'Rokurou', serif;
  font-size: 2.25rem;
  color: var(--color-dark);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #888;
  font-size: 1rem;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--color-sable);
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
}

.orders-table th {
  text-align: left;
  padding: 1.25rem 1.5rem;
  background: #fbfaf8;
  border-bottom: 1.5px solid var(--color-sable);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  font-weight: 700;
}

.orders-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-sable);
  font-size: 0.95rem;
}

.order-row:last-child td {
  border-bottom: none;
}

.order-id {
  font-weight: 700;
  color: var(--color-marron);
}

.status-badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.875rem;
  border-radius: 20px;
  display: inline-block;
}

.status-badge.pending { background: #fff7ed; color: #9a3412; }
.status-badge.processing { background: #eff6ff; color: #1e40af; }
.status-badge.shipped { background: #ecfdf5; color: #065f46; }
.status-badge.delivered { background: #f0fdf4; color: #166534; }
.status-badge.cancelled { background: #fef2f2; color: #991b1b; }
.status-badge.returned { background: #f3f4f6; color: #374151; }

.order-total {
  font-weight: 700;
  color: var(--color-dark);
}

.actions {
  text-align: center;
  width: 100px;
}

.btn-detail {
  width: 40px;
  height: 40px;
  border: 1.5px solid var(--color-sable);
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.btn-detail:hover {
  background: var(--color-marron);
  color: white;
  border-color: var(--color-marron);
}

.pagination {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.btn-page {
  padding: 0.6rem 1.25rem;
  border: 1px solid var(--color-sable);
  background: white;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
  border-color: var(--color-marron);
  color: var(--color-marron);
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.85rem;
  color: #888;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 6rem;
  color: #888;
}

.empty-state p {
  margin: 1.5rem 0;
  font-size: 1.1rem;
}

.btn-shop {
  margin-top: 1rem;
  display: inline-block;
  padding: 0.875rem 2.5rem;
  background: var(--color-marron);
  color: white;
  text-decoration: none;
  font-weight: 700;
  border-radius: 12px;
  transition: all 0.2s;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #eee;
  border-top-color: var(--color-marron);
  border-radius: 50%;
  animation: rotate 1s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes rotate { to { transform: rotate(360deg); } }
</style>
