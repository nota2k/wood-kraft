<template>
  <div class="account-dashboard">
    <div class="welcome-section">
      <h1 class="welcome-title">Bonjour, {{ user?.name }} !</h1>
      <p class="welcome-subtitle">Bienvenue dans votre espace client Wood&Kraft.</p>
    </div>

    <div class="dashboard-grid">
      <!-- Statistiques rapides -->
      <div class="stat-card">
        <h3 class="stat-label">Commandes passées</h3>
        <p class="stat-value">{{ orders.length }}</p>
      </div>

      <div class="stat-card">
        <h3 class="stat-label">Statut du compte</h3>
        <p class="stat-value">Client</p>
      </div>
    </div>

    <div class="section-title">
      <h2>Dernières commandes</h2>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des commandes...</p>
    </div>

    <div v-else-if="orders.length === 0" class="empty-state card">
      <p>Vous n'avez pas encore passé de commande.</p>
      <RouterLink to="/" class="btn-shop">Découvrir nos créations</RouterLink>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders.slice(0, 3)" :key="order.id" class="order-card card">
        <div class="order-id">#{{ order.order_number }}</div>
        <div class="order-status" :class="order.status">{{ formatStatus(order.status) }}</div>
        <div class="order-total">{{ formatPrice(order.total_amount) }}</div>
        <div class="order-date">{{ formatDate(order.created_at) }}</div>
        <RouterLink :to="{ name: 'account-order-detail', params: { id: order.id } }" class="btn-detail">Voir plus</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const user = ref(JSON.parse(localStorage.getItem('customer_user')))
const orders = ref([])
const loading = ref(true)

const fetchOrders = async () => {
  try {
    const response = await api.get('/customer/orders', { per_page: 5 })
    orders.value = response.data
  } catch (err) {
    console.error('Erreur commandes dashboard:', err)
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

onMounted(fetchOrders)
</script>

<style scoped>
.welcome-section {
  margin-bottom: 3rem;
}

.welcome-title {
  font-family: 'Rokurou', serif;
  font-size: 2.75rem;
  color: var(--color-dark);
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: #888;
}

.dashboard-grid {
  display: flex;
  gap: 2rem;
  margin-bottom: 4rem;
}

.stat-card {
  flex: 1;
  background: white;
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid var(--color-sable);
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
}

.stat-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin-bottom: 1rem;
  font-weight: 600;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-marron);
}

.section-title {
  margin-bottom: 2rem;
}

.section-title h2 {
  font-family: 'Rokurou', serif;
  font-size: 1.5rem;
  color: var(--color-dark);
}

.card {
  background: white;
  border-radius: 16px;
  border: 1px solid var(--color-sable);
  padding: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #888;
}

.btn-shop {
  margin-top: 1.5rem;
  display: inline-block;
  padding: 0.75rem 2rem;
  background: var(--color-marron);
  color: white;
  text-decoration: none;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s;
}

.order-card {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.5fr 1fr;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1.5rem;
  transition: all 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  border-color: var(--color-marron);
}

.order-id {
  font-weight: 700;
  color: var(--color-marron);
  font-size: 0.95rem;
}

.order-status {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  text-align: center;
}

.order-status.pending { background: #fff7ed; color: #9a3412; }
.order-status.processing { background: #eff6ff; color: #1e40af; }
.order-status.shipped { background: #ecfdf5; color: #065f46; }
.order-status.delivered { background: #f0fdf4; color: #166534; }
.order-status.cancelled { background: #fef2f2; color: #991b1b; }
.order-status.returned { background: #f3f4f6; color: #374151; }

.order-total {
  font-weight: 600;
  color: var(--color-dark);
}

.order-date {
  color: #888;
  font-size: 0.9rem;
}

.btn-detail {
  padding: 0.6rem 1.25rem;
  background: white;
  border: 1px solid var(--color-sable);
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  color: #666;
  text-align: center;
  transition: all 0.2s;
}

.btn-detail:hover {
  background: var(--color-marron);
  color: white;
  border-color: var(--color-marron);
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #888;
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

@media (max-width: 1024px) {
  .order-card {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}
</style>
