<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Codes promo</h1>
    </div>

    <form class="card form-grid" @submit.prevent="savePromo">
      <input v-model.trim="form.code" placeholder="Code (ex: BIENVENUE10)" required />
      <input v-model.trim="form.name" placeholder="Nom" required />
      <select v-model="form.discount_type">
        <option value="percent">Pourcentage</option>
        <option value="fixed">Montant fixe</option>
      </select>
      <input v-model.trim="form.discount_value" type="text"
        placeholder="Valeur de remise" required />
      <input v-model.trim="form.minimum_amount" type="text"
        placeholder="Montant minimum (€)" />
      <input v-model.trim="form.maximum_discount_amount" type="text"
        placeholder="Remise max (€)" />
      <input v-model.trim="form.usage_limit" type="number" min="1" step="1" placeholder="Limite d'utilisation" />
      <input v-model="form.starts_at" type="datetime-local" placeholder="Début" />
      <input v-model="form.ends_at" type="datetime-local" placeholder="Fin" />
      <label class="checkbox">
        <input v-model="form.is_active" type="checkbox" />
        Actif
      </label>
      <textarea v-model.trim="form.description" rows="2" placeholder="Description (optionnel)" />
      <div class="actions">
        <button type="button" class="btn-secondary" @click="resetForm">Annuler</button>
        <button type="submit" class="btn-primary">{{ form.id ? 'Mettre à jour' : 'Ajouter' }}</button>
      </div>
    </form>

    <div class="card table-card">
      <table class="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Valeur</th>
            <th>Validité</th>
            <th>Actif</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="promos.length === 0">
            <td colspan="6" class="empty">Aucun code promo configuré.</td>
          </tr>
          <tr v-for="promo in promos" :key="promo.id">
            <td>{{ promo.code }}</td>
            <td>{{ promo.discount_type === 'percent' ? '%' : 'Fixe' }}</td>
            <td>{{ promo.discount_type === 'percent' ? `${promo.discount_value}%` : formatPrice(promo.discount_value) }}</td>
            <td>{{ formatValidity(promo) }}</td>
            <td>{{ promo.is_active ? 'Oui' : 'Non' }}</td>
            <td class="row-actions">
              <button class="btn-secondary" @click="editPromo(promo)">Modifier</button>
              <button class="btn-danger" @click="deletePromo(promo.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api'

const promos = ref([])
const form = ref(defaultForm())

function defaultForm() {
  return {
    id: null,
    code: '',
    name: '',
    description: '',
    discount_type: 'percent',
    discount_value: '0',
    minimum_amount: '',
    maximum_discount_amount: '',
    usage_limit: '',
    starts_at: '',
    ends_at: '',
    is_active: true,
  }
}

function resetForm() {
  form.value = defaultForm()
}

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value || 0))
}

function toDateTimeInput(value) {
  if (!value) return ''
  return String(value).slice(0, 16)
}

function toIso(value) {
  return value ? new Date(value).toISOString() : null
}

function parseDecimal(value) {
  if (value == null) return 0
  const normalized = String(value).replace(/\s/g, '').replace(',', '.')
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatValidity(promo) {
  if (!promo.starts_at && !promo.ends_at) return 'Toujours'
  const start = promo.starts_at ? new Date(promo.starts_at).toLocaleDateString('fr-FR') : '...'
  const end = promo.ends_at ? new Date(promo.ends_at).toLocaleDateString('fr-FR') : '...'
  return `${start} - ${end}`
}

async function loadPromos() {
  const response = await api.getAdminPromoCodes({ per_page: 100 })
  promos.value = response.data || []
}

function editPromo(promo) {
  form.value = {
    id: promo.id,
    code: promo.code,
    name: promo.name,
    description: promo.description || '',
    discount_type: promo.discount_type,
    discount_value: String(promo.discount_value ?? '0'),
    minimum_amount: promo.minimum_amount == null ? '' : String(promo.minimum_amount),
    maximum_discount_amount: promo.maximum_discount_amount == null ? '' : String(promo.maximum_discount_amount),
    usage_limit: promo.usage_limit == null ? '' : String(promo.usage_limit),
    starts_at: toDateTimeInput(promo.starts_at),
    ends_at: toDateTimeInput(promo.ends_at),
    is_active: Boolean(promo.is_active),
  }
}

async function savePromo() {
  const payload = {
    code: form.value.code,
    name: form.value.name,
    description: form.value.description || null,
    discount_type: form.value.discount_type,
    discount_value: parseDecimal(form.value.discount_value),
    minimum_amount: form.value.minimum_amount === ''
      ? null
      : parseDecimal(form.value.minimum_amount),
    maximum_discount_amount: form.value.maximum_discount_amount === ''
      ? null
      : parseDecimal(form.value.maximum_discount_amount),
    usage_limit: form.value.usage_limit === ''
      ? null
      : Number(form.value.usage_limit),
    starts_at: toIso(form.value.starts_at),
    ends_at: toIso(form.value.ends_at),
    is_active: Boolean(form.value.is_active),
  }

  if (form.value.id) {
    await api.updateAdminPromoCode(form.value.id, payload)
  } else {
    await api.createAdminPromoCode(payload)
  }

  resetForm()
  await loadPromos()
}

async function deletePromo(id) {
  if (!window.confirm('Supprimer ce code promo ?')) return
  await api.deleteAdminPromoCode(id)
  await loadPromos()
}

onMounted(loadPromos)
</script>

<style scoped>
.page { max-width: 1100px; }
.page-header { margin-bottom: 1rem; }
.page-title { margin: 0; font-size: 1.7rem; }
.card { background: #fff; border-radius: 12px; padding: 1rem; border: 1px solid var(--color-sable); margin-bottom: 1rem; }
.form-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .75rem; }
.form-grid textarea, .form-grid .actions { grid-column: 1 / -1; }
.form-grid input, .form-grid textarea, .form-grid select { border: 1px solid var(--color-sable); border-radius: 8px; padding: .65rem .75rem; }
.checkbox { display: flex; align-items: center; gap: .5rem; font-size: .9rem; }
.actions { display: flex; justify-content: flex-end; gap: .5rem; }
.btn-primary, .btn-secondary, .btn-danger { border: none; border-radius: 8px; padding: .5rem .75rem; cursor: pointer; }
.btn-primary { background: var(--color-marron); color: #fff; }
.btn-secondary { background: #efeee8; color: var(--color-dark); }
.btn-danger { background: #b3292f; color: #fff; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { text-align: left; padding: .75rem .5rem; border-bottom: 1px solid #f1f1eb; }
.row-actions { display: flex; gap: .5rem; }
.empty { text-align: center; color: #888; }
</style>
