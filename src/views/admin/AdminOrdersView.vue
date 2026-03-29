<template>
  <div class="admin-orders-page">
    <div class="page-header">
      <h1 class="page-title">Commandes</h1>
    </div>

    <!-- Filtres rapides -->
    <div class="filters-bar card">
      <div class="search-box">
        <Search :size="18" />
        <input v-model="searchQuery" type="text" placeholder="Rechercher par numéro, nom ou email..."
          @input="handleSearch" />
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des commandes...</p>
    </div>

    <div v-else-if="orders.length === 0" class="empty-state">
      <ShoppingCart :size="48" />
      <p>Aucune commande trouvée.</p>
    </div>

    <div v-else class="orders-sections">
      <!-- SECTION 1: EN COURS -->
      <OrderGroupTable title="Commandes en cours" :orders="groups.active"
        empty-text="Aucune commande en attente ou en cours." @update="updateOrderStatus" />

      <!-- SECTION 2: EXPÉDIÉES / LIVRÉES -->
      <OrderGroupTable title="Commandes expédiées" :orders="groups.completed"
        empty-text="Aucune commande expédiée ou livrée." @update="updateOrderStatus" />

      <!-- SECTION 3: ANNULÉES -->
      <OrderGroupTable title="Commandes annulées" :orders="groups.cancelled" empty-text="Aucune commande annulée."
        @update="updateOrderStatus" />

      <!-- SECTION 4: RETOURNÉES -->
      <OrderGroupTable title="Commandes retournées" :orders="groups.returned" empty-text="Aucun retour enregistré."
        @update="updateOrderStatus" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { Search, ShoppingCart, Eye, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-vue-next'
import OrderGroupTable from './components/OrderGroupTable.vue'

const orders = ref([])
const loading = ref(true)
const searchQuery = ref('')

const fetchOrders = async () => {
  loading.value = true
  try {
    // On récupère une grande partie des commandes pour le groupage local
    const response = await api.get('/admin/orders', { per_page: 50, search: searchQuery.value })
    orders.value = response.data
  } catch (error) {
    console.error('Erreur commandes:', error)
  } finally {
    loading.value = false
  }
}

const groups = computed(() => {
  return {
    active: orders.value.filter(o => ['pending', 'processing'].includes(o.status)),
    completed: orders.value.filter(o => ['shipped', 'delivered'].includes(o.status)),
    cancelled: orders.value.filter(o => o.status === 'cancelled'),
    returned: orders.value.filter(o => o.status === 'returned')
  }
})

async function updateOrderStatus(orderId, newStatus) {
  try {
    await api.put(`/admin/orders/${orderId}`, { status: newStatus })
    const ord = orders.value.find(o => o.id === orderId)
    if (ord) ord.status = newStatus
  } catch (e) {
    alert('Erreur lors du changement de statut')
  }
}

let searchTimeout = null
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(fetchOrders, 400)
}

onMounted(fetchOrders)
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-dark);
}

.card {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--color-sable);
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fbfbf8;
  padding: 0 1rem;
  border-radius: 8px;
}

.search-box input {
  border: none;
  background: none;
  height: 44px;
  flex: 1;
  outline: none;
  font-size: 0.95rem;
}

.orders-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-state,
.empty-state {
  padding: 5rem;
  text-align: center;
  color: #888;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #eee;
  border-top-color: var(--color-marron);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
