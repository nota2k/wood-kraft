<template>
  <div class="categories-admin">
    <div class="page-header">
      <div>
        <h1 class="page-title">Catégories</h1>
        <p class="page-subtitle">{{ categories.length }} catégorie(s)</p>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        <Plus :size="18" />
        Nouvelle catégorie
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else class="categories-grid">
      <div v-if="categories.length === 0" class="empty-state">
        <Tag :size="40" />
        <p>Aucune catégorie</p>
      </div>

      <div
        v-for="cat in categories"
        :key="cat.id"
        class="category-card"
      >
        <div class="cat-info">
          <span class="cat-name">{{ cat.name }}</span>
          <span class="cat-slug">{{ cat.slug }}</span>
        </div>
        <div class="cat-actions">
          <button class="action-btn edit" @click="openEditModal(cat)" title="Modifier">
            <Pencil :size="15" />
          </button>
          <button class="action-btn delete" @click="confirmDelete(cat)" title="Supprimer">
            <Trash2 :size="15" />
          </button>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editTarget ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}</h3>

        <div class="form-group">
          <label>Nom <span class="required">*</span></label>
          <input
            v-model="modalForm.name"
            type="text"
            placeholder="ex. Tables"
            ref="nameInput"
            @keyup.enter="handleSave"
          />
          <p v-if="modalError" class="field-error">{{ modalError }}</p>
        </div>

        <div class="form-group">
          <label>Slug</label>
          <input
            v-model="modalForm.slug"
            type="text"
            placeholder="ex. tables (auto-généré)"
          />
          <p class="field-hint">Laissez vide pour auto-générer depuis le nom.</p>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="closeModal">Annuler</button>
          <button class="btn-confirm" :disabled="saving" @click="handleSave">
            <span v-if="saving" class="spinner-sm"></span>
            <span v-else>{{ editTarget ? 'Enregistrer' : 'Créer' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal">
        <h3>Supprimer la catégorie ?</h3>
        <p>La catégorie <strong>{{ deleteTarget.name }}</strong> sera supprimée. Les produits associés ne seront pas supprimés.</p>
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
import { ref, nextTick, onMounted } from 'vue'
import api from '@/services/api'
import { Plus, Pencil, Trash2, Tag } from 'lucide-vue-next'

const categories = ref([])
const loading = ref(true)
const showModal = ref(false)
const editTarget = ref(null)
const deleteTarget = ref(null)
const saving = ref(false)
const deleting = ref(false)
const modalError = ref('')
const nameInput = ref(null)

const modalForm = ref({ name: '', slug: '' })

onMounted(loadCategories)

async function loadCategories() {
  loading.value = true
  try {
    const data = await api.getCategories()
    categories.value = data.data || data || []
  } catch {
    categories.value = []
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  editTarget.value = null
  modalForm.value = { name: '', slug: '' }
  modalError.value = ''
  showModal.value = true
  nextTick(() => nameInput.value?.focus())
}

function openEditModal(cat) {
  editTarget.value = cat
  modalForm.value = { name: cat.name, slug: cat.slug || '' }
  modalError.value = ''
  showModal.value = true
  nextTick(() => nameInput.value?.focus())
}

function closeModal() {
  showModal.value = false
  editTarget.value = null
}

async function handleSave() {
  if (!modalForm.value.name.trim()) {
    modalError.value = 'Le nom est requis.'
    return
  }
  saving.value = true
  modalError.value = ''
  try {
    const payload = { name: modalForm.value.name }
    if (modalForm.value.slug) payload.slug = modalForm.value.slug

    if (editTarget.value) {
      await api.updateCategory(editTarget.value.id, payload)
    } else {
      await api.createCategory(payload)
    }
    closeModal()
    await loadCategories()
  } catch (e) {
    modalError.value = e.data?.message || 'Une erreur est survenue.'
  } finally {
    saving.value = false
  }
}

function confirmDelete(cat) {
  deleteTarget.value = cat
}

async function executeDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.deleteCategory(deleteTarget.value.id)
    deleteTarget.value = null
    await loadCategories()
  } catch (e) {
    alert(e.data?.message || 'Erreur lors de la suppression.')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.categories-admin { max-width: 800px; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
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
  white-space: nowrap;
  transition: background 0.2s;
}

.btn-primary:hover { background: var(--color-marron-dark); }

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

.categories-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-marron-light);
  background: white;
  border-radius: 14px;
}

.empty-state p { margin: 0.75rem 0 0; }

.category-card {
  background: white;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 6px rgba(60, 58, 31, 0.06);
  transition: box-shadow 0.2s;
}

.category-card:hover { box-shadow: 0 4px 12px rgba(60, 58, 31, 0.1); }

.cat-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.cat-name {
  font-weight: 600;
  color: var(--color-dark);
  font-size: 0.95rem;
}

.cat-slug {
  font-size: 0.8rem;
  color: var(--color-marron-light);
}

.cat-actions {
  display: flex;
  gap: 0.375rem;
}

.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}

.action-btn.edit { background: #fef3e8; color: var(--color-marron); }
.action-btn.edit:hover { background: var(--color-marron); color: white; }
.action-btn.delete { background: #fdecea; color: #c62828; }
.action-btn.delete:hover { background: #c62828; color: white; }

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
  max-width: 440px;
  width: 100%;
}

.modal h3 {
  margin: 0 0 1.5rem;
  color: var(--color-dark);
  font-size: 1.1rem;
}

.modal p {
  color: var(--color-marron-light);
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-dark);
}

.required { color: #c62828; }

.form-group input {
  padding: 0.7rem 0.875rem;
  border: 1.5px solid var(--color-sable);
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus { border-color: var(--color-marron); }

.field-error {
  color: #c62828;
  font-size: 0.8rem;
  margin: 0;
}

.field-hint {
  color: var(--color-marron-light);
  font-size: 0.78rem;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancel {
  padding: 0.625rem 1.25rem;
  border: 1.5px solid var(--color-sable);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-confirm {
  padding: 0.625rem 1.25rem;
  background: var(--color-marron);
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
  gap: 0.375rem;
}

.btn-confirm:disabled { opacity: 0.7; cursor: not-allowed; }

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
