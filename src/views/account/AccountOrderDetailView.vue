<template>
  <div class="order-detail">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else-if="!order" class="empty-state">
      <p>Commande introuvable.</p>
    </div>

    <div v-else>
      <div class="page-header">
        <div class="header-main">
          <RouterLink :to="{ name: 'account-orders' }" class="back-link">
            <ChevronLeft :size="20" /> Mes commandes
          </RouterLink>
          <h1 class="page-title">Commande #{{ order.order_number }}</h1>
        </div>
        <div class="status-badge" :class="order.status">{{ formatStatus(order.status) }}</div>
      </div>

      <div class="order-grid">
        <!-- Produits -->
        <div class="main-content">
          <div class="card product-list">
            <h2 class="section-title">Articles commandés</h2>
            <div v-for="item in order.items" :key="item.id" class="product-item">
              <div class="product-img">
                <img :src="getProductImage(item)" :alt="getProductName(item)" />
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ getProductName(item) }}</h3>
                <p class="product-category">{{ item.product?.categories?.[0]?.name || 'Bois' }}</p>
              </div>
              <div class="product-price">
                <span class="qty">x{{ item.quantity }}</span>
                <span class="price">{{ formatPrice(item.total_price ?? item.unit_price) }}</span>
              </div>
            </div>

            <div class="order-summary">
              <div class="summary-line">
                <span>Sous-total</span>
                <span>{{ formatPrice(order.subtotal_amount ?? order.total_amount) }}</span>
              </div>
              <div class="summary-line">
                <span>Livraison</span>
                <span :class="{ free: Number(order.shipping_amount || 0) === 0 }">
                  {{ Number(order.shipping_amount || 0) === 0 ? 'Gratuit' : formatPrice(order.shipping_amount) }}
                </span>
              </div>
              <div class="summary-line" v-if="Number(order.discount_amount || 0) > 0">
                <span>Remise</span>
                <span>- {{ formatPrice(order.discount_amount) }}</span>
              </div>
              <div class="summary-line total">
                <span>Total</span>
                <span>{{ formatPrice(order.total_amount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Infos Livraison -->
        <aside class="sidebar-content">
          <div class="card info-section">
            <h2 class="section-title"><Truck :size="18" /> Livraison</h2>
            <div class="address-box">
              <p class="name">{{ order.customer_name }}</p>
              <p>{{ order.client?.shipping_address }}</p>
              <p>{{ order.client?.shipping_zip_code }} {{ order.client?.shipping_city }}</p>
              <p class="country">{{ order.client?.shipping_country }}</p>
            </div>
          </div>

          <div class="card info-section">
            <h2 class="section-title"><CreditCard :size="18" /> Facturation</h2>
            <div class="address-box">
              <p class="name">{{ order.customer_name }}</p>
              <p>{{ order.client?.billing_address || order.client?.shipping_address }}</p>
              <p>{{ order.client?.billing_zip_code || order.client?.shipping_zip_code }} {{ order.client?.billing_city || order.client?.shipping_city }}</p>
              <p class="country">{{ order.client?.billing_country || order.client?.shipping_country }}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { ChevronLeft, Truck, CreditCard } from 'lucide-vue-next'

const route = useRoute()
const order = ref(null)
const loading = ref(true)

const fetchOrderDetail = async () => {
  try {
    const response = await api.get(`/customer/orders/${route.params.id}`)
    order.value = response
  } catch (err) {
    console.error('Erreur detail order:', err)
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

onMounted(() => fetchOrderDetail())
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #888;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--color-marron);
}

.page-title {
  font-family: 'Rokurou', serif;
  font-size: 2.25rem;
  color: var(--color-dark);
}

.status-badge {
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.5rem 1.25rem;
  border-radius: 30px;
}

.status-badge.pending { background: #fff7ed; color: #9a3412; }
.status-badge.processing { background: #eff6ff; color: #1e40af; }
.status-badge.shipped { background: #ecfdf5; color: #065f46; }
.status-badge.delivered { background: #f0fdf4; color: #166534; }
.status-badge.cancelled { background: #fef2f2; color: #991b1b; }

.order-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 3rem;
  align-items: start;
}

.card {
  background: white;
  border-radius: 20px;
  border: 1px solid var(--color-sable);
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  color: var(--color-dark);
  font-weight: 700;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1.5px solid var(--color-sable);
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.product-item:last-of-type {
  border-bottom: none;
}

.product-img {
  width: 80px;
  height: 80px;
  background: #fbfbf8;
  border-radius: 12px;
  overflow: hidden;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 1.1rem;
  color: var(--color-dark);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.product-category {
  font-size: 0.85rem;
  color: #888;
}

.product-price {
  text-align: right;
}

.qty {
  display: block;
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 0.25rem;
}

.price {
  font-weight: 700;
  color: var(--color-marron);
  font-size: 1.1rem;
}

.order-summary {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--color-sable);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-weight: 500;
}

.summary-line.total {
  margin-top: 1rem;
  font-size: 1.5rem;
  color: var(--color-dark);
  font-weight: 700;
}

.free { color: #166534; font-weight: 600; }

.address-box {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}

.address-box .name {
  font-weight: 700;
  color: var(--color-dark);
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.country {
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 0.5rem;
}

.loading-state {
  padding: 10rem;
  display: flex;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-sable);
  border-top-color: var(--color-marron);
  border-radius: 50%;
  animation: rotate 1s linear infinite;
}

@keyframes rotate { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .order-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
