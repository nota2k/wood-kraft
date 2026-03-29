<template>
  <div class="order-group" :class="{ 'is-collapsed': !isOpen }">
    <button class="group-header" @click="isOpen = !isOpen">
      <div class="header-main">
        <h2 class="group-title">{{ title }}</h2>
        <span class="group-count">{{ orders.length }} commande{{ orders.length > 1 ? 's' : '' }}</span>
      </div>
      <ChevronDown class="toggle-icon" :class="{ 'rotated': isOpen }" :size="20" />
    </button>

    <Transition name="accordion">
      <div v-if="isOpen">
        <div v-if="orders.length === 0" class="group-empty card">
          <p>{{ emptyText }}</p>
        </div>

        <div v-else class="card table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Client</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td class="order-number">
                  <RouterLink :to="{ name: 'admin-order-detail', params: { id: order.id } }" class="order-link">
                    #{{ order.order_number }}
                  </RouterLink>
                </td>
                <td>
                  <div class="customer-info">
                    <span class="customer-name">{{ order.customer_name }}</span>
                    <span class="customer-email">{{ order.customer_email }}</span>
                  </div>
                </td>
                <td class="order-total">{{ formatPrice(order.total_amount) }}</td>
                <td class="status-cell">
                  <select class="inline-status-select" :class="order.status" :value="order.status"
                    @change="e => $emit('update', order.id, e.target.value)">
                    <option value="pending">En attente</option>
                    <option value="processing">En cours</option>
                    <option value="shipped">Expédié</option>
                    <option value="delivered">Livré</option>
                    <option value="cancelled">Annulé</option>
                    <option value="returned">Retourné</option>
                  </select>
                </td>
                <td class="order-date">{{ formatDate(order.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  orders: Array,
  emptyText: String
})

defineEmits(['update'])

const isOpen = ref(true)
// Par défaut, on peut charger les sections 'Annulées' et 'Retournées' fermées si on veut, 
// mais restons sur tout ouvert pour l'instant.

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}
</script>

<style scoped>
.order-group {
  border-bottom: 1px solid var(--color-sable);
}

.group-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;
  text-align: left;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.group-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-dark);
}

.group-count {
  background: var(--color-sable);
  padding: 0.15rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
}

.toggle-icon {
  color: #888;
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(-180deg);
}

/* Transitions */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease-out;
  max-height: 1000px;
  opacity: 1;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.card {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-sable);
  overflow: hidden;
}

.group-empty {
  padding: 2rem;
  text-align: center;
  color: #888;
  font-size: 0.9rem;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  text-align: left;
  padding: 0.875rem 1rem;
  background: #fbfbf8;
  border-bottom: 1px solid var(--color-sable);
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #888;
}

.admin-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-sable);
}

.order-number {
  font-weight: 600;
  font-size: 0.9rem;
}

.order-link {
  color: var(--color-marron);
  text-decoration: none;
  transition: opacity 0.2s;
}

.order-link:hover {
  text-decoration: underline;
  opacity: 0.8;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 500;
  color: var(--color-dark);
  font-size: 0.9rem;
}

.customer-email {
  font-size: 0.75rem;
  color: #888;
}

.order-total {
  font-weight: 600;
  font-size: 0.95rem;
}

.inline-status-select {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid transparent;
  outline: none;
  cursor: pointer;
}

.inline-status-select.pending {
  background: #fff7ed;
  color: #9a3412;
}

.inline-status-select.processing {
  background: #eff6ff;
  color: #1e40af;
}

.inline-status-select.shipped {
  background: #ecfdf5;
  color: #065f46;
}

.inline-status-select.delivered {
  background: #f0fdf4;
  color: #166534;
}

.inline-status-select.cancelled {
  background: #fef2f2;
  color: #991b1b;
}

.inline-status-select.returned {
  background: #f3f4f6;
  color: #374151;
}

.order-date {
  font-size: 0.85rem;
  color: #666;
}
</style>
