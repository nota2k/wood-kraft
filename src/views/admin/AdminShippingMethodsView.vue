<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Modes de livraison</h1>
    </div>

    <form class="card form-grid" @submit.prevent="saveMethod">
      <input v-model.trim="form.name" placeholder="Nom (ex: Standard)" required />
      <input v-model.trim="form.code" placeholder="Code (ex: STANDARD)" required />
      <input v-model.trim="form.price" type="text" placeholder="Prix (€)" required />
      <input v-model.trim="form.free_from_amount" type="text"
        placeholder="Gratuit dès (€) - optionnel" />
      <input v-model.number="form.position" type="number" min="0" step="1" placeholder="Position" />
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
            <th>Nom</th>
            <th>Code</th>
            <th>Prix</th>
            <th>Gratuit dès</th>
            <th>Actif</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="methods.length === 0">
            <td colspan="6" class="empty">Aucun mode configuré.</td>
          </tr>
          <tr v-for="method in methods" :key="method.id">
            <td>{{ method.name }}</td>
            <td>{{ method.code }}</td>
            <td>{{ formatPrice(method.price) }}</td>
            <td>{{ method.free_from_amount == null ? '—' : formatPrice(method.free_from_amount) }}</td>
            <td>{{ method.is_active ? 'Oui' : 'Non' }}</td>
            <td class="row-actions">
              <button class="btn-secondary" @click="editMethod(method)">Modifier</button>
              <button class="btn-danger" @click="deleteMethod(method.id)">Supprimer</button>
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

const methods = ref([])
const form = ref(defaultForm())

function defaultForm() {
  return {
    id: null,
    name: '',
    code: '',
    description: '',
    price: '0',
    free_from_amount: '',
    position: 0,
    is_active: true,
  }
}

function resetForm() {
  form.value = defaultForm()
}

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value || 0))
}

function parseDecimal(value) {
  if (value == null) return 0
  const normalized = String(value).replace(/\s/g, '').replace(',', '.')
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

async function loadMethods() {
  const response = await api.getAdminShippingMethods({ per_page: 100 })
  methods.value = response.data || []
}

function editMethod(method) {
  form.value = {
    id: method.id,
    name: method.name,
    code: method.code,
    description: method.description || '',
    price: String(method.price ?? '0'),
    free_from_amount: method.free_from_amount == null ? '' : String(method.free_from_amount),
    position: Number(method.position || 0),
    is_active: Boolean(method.is_active),
  }
}

async function saveMethod() {
  const payload = {
    name: form.value.name,
    code: form.value.code,
    description: form.value.description || null,
    price: parseDecimal(form.value.price),
    free_from_amount: form.value.free_from_amount === ''
      ? null
      : parseDecimal(form.value.free_from_amount),
    position: Number(form.value.position || 0),
    is_active: Boolean(form.value.is_active),
  }

  if (form.value.id) {
    await api.updateAdminShippingMethod(form.value.id, payload)
  } else {
    await api.createAdminShippingMethod(payload)
  }

  resetForm()
  await loadMethods()
}

async function deleteMethod(id) {
  if (!window.confirm('Supprimer ce mode de livraison ?')) return
  await api.deleteAdminShippingMethod(id)
  await loadMethods()
}

onMounted(loadMethods)
</script>

<style scoped>
.page { max-width: 1100px; }
.page-header { margin-bottom: 1rem; }
.page-title { margin: 0; font-size: 1.7rem; }
.card { background: #fff; border-radius: 12px; padding: 1rem; border: 1px solid var(--color-sable); margin-bottom: 1rem; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }
.form-grid textarea, .form-grid .actions { grid-column: 1 / -1; }
.form-grid input, .form-grid textarea { border: 1px solid var(--color-sable); border-radius: 8px; padding: .65rem .75rem; }
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
