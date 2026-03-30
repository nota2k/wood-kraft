<template>
  <div class="admin-order-detail">
    <div class="page-header">
      <div class="header-left">
        <button class="back-link" @click="$router.push({ name: 'admin-orders' })">
          <ArrowLeft :size="18" />
          Retour aux commandes
        </button>
        <h1 class="page-title">Commande #{{ order?.order_number }}</h1>
        <span v-if="order" class="status-badge" :class="order.status">{{ getStatusLabel(order.status) }}</span>
      </div>
      
      <div v-if="order" class="header-actions">
        <select v-model="statusToUpdate" class="status-select" @change="updateStatus">
          <option value="pending">En attente</option>
          <option value="processing">En cours</option>
          <option value="shipped">Expédié</option>
          <option value="delivered">Livré</option>
          <option value="cancelled">Annulé</option>
          <option value="returned">Retourné</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement du détail...</p>
    </div>

    <div v-else-if="!order" class="error-state">
      <p>Impossible de trouver cette commande.</p>
    </div>

    <div v-else class="order-content">
      <div class="main-column">
        <!-- Produits -->
        <div class="card">
          <h2 class="card-title">Produits commandés</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.id">
                <td class="product-cell">
                  <img :src="getProductImage(item)" class="product-img" :alt="getProductName(item)" />
                  <div class="product-info">
                    <span class="product-name">{{ getProductName(item) }}</span>
                    <span class="product-ref">Réf: {{ item.product?.reference || 'N/A' }}</span>
                  </div>
                </td>
                <td>{{ formatPrice(item.unit_price) }}</td>
                <td>{{ item.quantity }}</td>
                <td class="item-total">{{ formatPrice(item.total_price) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="3">Total de la commande</td>
                <td class="grand-total">{{ formatPrice(order.total_amount) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Notes -->
        <div class="card">
          <h2 class="card-title">Notes & Instructions</h2>
          <p class="order-notes">{{ order.notes || 'Aucune note particulière.' }}</p>
        </div>
      </div>

      <div class="side-column">
        <!-- Client -->
        <div class="card">
          <h2 class="card-title">Informations Client</h2>
          <div class="info-list">
            <div class="info-item">
              <User :size="16" />
              <span>{{ order.customer_name }}</span>
            </div>
            <div class="info-item">
              <Mail :size="16" />
              <span>{{ order.customer_email }}</span>
            </div>
            <div class="info-item">
              <Phone :size="16" />
              <span>{{ order.customer_phone || 'Non renseigné' }}</span>
            </div>
          </div>
        </div>

        <!-- Adresses -->
        <div class="card">
          <h2 class="card-title">Livraison & Facturation</h2>
          <div class="address-block">
            <h3>Adresse de livraison</h3>
            <p>{{ order.shipping_address }}</p>
          </div>
          <div class="address-block divider">
            <h3>Adresse de facturation</h3>
            <p>{{ order.billing_address }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { ArrowLeft, User, Mail, Phone } from 'lucide-vue-next'

const route = useRoute()
const order = ref(null)
const loading = ref(true)
const statusToUpdate = ref('')

async function fetchOrder() {
  loading.value = true
  try {
    const response = await api.get(`/admin/orders/${route.params.id}`)
    order.value = response
    statusToUpdate.value = response.status
  } catch (error) {
    console.error('Erreur detail commande:', error)
  } finally {
    loading.value = false
  }
}

async function updateStatus() {
  try {
    await api.put(`/admin/orders/${order.value.id}`, { status: statusToUpdate.value })
    order.value.status = statusToUpdate.value
    // Notification de succès?
  } catch {
    alert('Erreur lors de la mise à jour du statut.')
  }
}

function formatPrice(price) {
  const amount = Number(price ?? 0)
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
    Number.isFinite(amount) ? amount : 0
  )
}

function getProductName(item) {
  return item?.product?.title || `Produit #${item?.product_id ?? ''}`
}

function getProductImage(item) {
  const image = item?.product?.images?.[0]
  return image?.image_path || image?.url || '/favicon.ico'
}

function getStatusLabel(status) {
  const labels = {
    pending: 'En attente',
    processing: 'En cours',
    shipped: 'Expédié',
    delivered: 'Livré',
    cancelled: 'Annulé',
    returned: 'Retourné'
  }
  return labels[status] || status
}

onMounted(fetchOrder)
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #888;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.back-link:hover { color: var(--color-marron); }

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-dark);
}

.status-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  width: fit-content;
}

/* Status colors (reused from view) */
.status-badge.pending { background: #fff7ed; color: #9a3412; }
.status-badge.processing { background: #eff6ff; color: #1e40af; }
.status-badge.shipped { background: #ecfdf5; color: #065f46; }
.status-badge.delivered { background: #f0fdf4; color: #166534; }
.status-badge.cancelled { background: #fef2f2; color: #991b1b; }
.status-badge.returned { background: #f5f5f5; color: #555; }

.status-select {
  padding: 0.6rem 2.5rem 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-sable);
  background: white;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;
}

.order-content {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-sable);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--color-dark);
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th {
  text-align: left;
  padding: 0.75rem;
  font-weight: 500;
  color: #888;
  border-bottom: 1px solid var(--color-sable);
  font-size: 0.85rem;
}

.items-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid var(--color-sable);
}

.product-cell {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.product-img {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 500;
  color: var(--color-dark);
}

.product-ref {
  font-size: 0.75rem;
  color: #888;
}

.item-total {
  font-weight: 600;
}

.total-row td {
  padding-top: 1.5rem;
  border: none;
}

.grand-total {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-marron);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #444;
  font-size: 0.9rem;
}

.address-block h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 0.5rem;
}

.address-block p {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #444;
}

.divider {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-sable);
}

.loading-state {
  padding: 4rem;
  text-align: center;
}

@media (max-width: 900px) {
  .order-content { grid-template-columns: 1fr; }
}
</style>
