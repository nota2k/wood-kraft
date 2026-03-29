<template>
  <div class="product-form-page">
    <div class="page-header">
      <div class="header-left">
        <RouterLink :to="{ name: 'admin-products' }" class="back-link">
          <ArrowLeft :size="18" />
          Produits
        </RouterLink>
        <h1 class="page-title">{{ isEditing ? 'Modifier le produit' : 'Nouveau produit' }}</h1>
      </div>
      <div class="header-actions">
        <a v-if="isEditing" :href="'/product/' + $route.params.id" target="_blank" class="btn-secondary btn-icon">
          <ExternalLink :size="16" />
          Voir le produit
        </a>
        <button class="btn-secondary" @click="$router.push({ name: 'admin-products' })">
          Annuler
        </button>
        <button class="btn-primary" :class="{ 'btn-success': saved }" :disabled="saving || saved" @click="handleSave">
          <span v-if="saving" class="spinner-sm"></span>
          <Check v-else-if="saved" :size="16" />
          <Save v-else :size="16" />

          <span v-if="saved">Enregistré</span>
          <span v-else>{{ isEditing ? 'Enregistrer' : 'Créer' }}</span>
        </button>
      </div>
    </div>

    <div v-if="loadingProduct" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else class="form-layout">
      <!-- Left column -->
      <div class="form-main">
        <!-- Infos générales -->
        <div class="card">
          <h2 class="card-title">Informations générales</h2>

          <div class="form-group">
            <label>Titre <span class="required">*</span></label>
            <input v-model="form.title" type="text" placeholder="ex. Table basse en chêne" />
            <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Prix (€) <span class="required">*</span></label>
              <input v-model="form.price" type="number" step="0.01" min="0" placeholder="0.00" />
              <p v-if="errors.price" class="field-error">{{ errors.price }}</p>
            </div>
            <div class="form-group">
              <label>Référence</label>
              <input v-model="form.reference" type="text" placeholder="ex. WK-001" />
            </div>
            <div class="form-group">
              <label>Stock</label>
              <input v-model="form.quantity" type="number" min="0" placeholder="0" />
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="5" placeholder="Description du produit..."></textarea>
          </div>
        </div>

        <!-- Caractéristiques -->
        <div class="card">
          <h2 class="card-title">Caractéristiques</h2>

          <div class="form-row">
            <div class="form-group">
              <label>Matériau</label>
              <select v-model="form.material_id">
                <option value="">Sélectionner un matériau</option>
                <option v-for="mat in materials" :key="mat.id" :value="mat.id">
                  {{ mat.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row mt-3">
            <div class="form-group">
              <label>Largeur (cm)</label>
              <input v-model="form.width" type="number" step="0.1" placeholder="ex. 60" />
            </div>
            <div class="form-group">
              <label>Longueur (cm)</label>
              <input v-model="form.length" type="number" step="0.1" placeholder="ex. 120" />
            </div>
            <div class="form-group">
              <label>Profondeur (cm)</label>
              <input v-model="form.depth" type="number" step="0.1" placeholder="ex. 40" />
            </div>
          </div>
        </div>

        <!-- Variations -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Variations</h2>
            <button class="btn-add-variation" @click="addVariation">
              <Plus :size="15" />
              Ajouter
            </button>
          </div>

          <div v-if="form.variations.length === 0" class="empty-variations">
            Aucune variation. Ajoutez des options (couleur, finition…)
          </div>

          <div v-for="(variation, index) in form.variations" :key="index" class="variation-row">
            <div class="form-group flex-1">
              <label>Type</label>
              <input v-model="variation.type" type="text" placeholder="ex. couleur" />
            </div>
            <div class="form-group flex-1">
              <label>Valeur</label>
              <input v-model="variation.value" type="text" placeholder="ex. Chêne naturel" />
            </div>
            <div class="form-group" style="width:100px">
              <label>Quantité</label>
              <input v-model="variation.quantity" type="number" min="0" placeholder="0" />
            </div>
            <button class="btn-remove-variation" @click="removeVariation(index)" title="Supprimer">
              <X :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="form-side">
        <!-- Catégories -->
        <div class="card">
          <h2 class="card-title">Catégories</h2>
          <div class="categories-list">
            <label v-for="cat in categories" :key="cat.id" class="checkbox-item">
              <input type="checkbox" :value="cat.id" v-model="form.category_ids" />
              <span>{{ cat.name }}</span>
            </label>
            <p v-if="categories.length === 0" class="muted-sm">Aucune catégorie disponible</p>
          </div>
        </div>

        <!-- Images -->
        <div class="card">
          <h2 class="card-title">Images</h2>

          <!-- Existing images (edit mode) -->
          <div v-if="existingImages.length > 0" class="existing-images">
            <div v-for="img in existingImages" :key="img.id" class="existing-img">
              <img :src="img.image_path" :alt="form.title" />
              <div class="img-overlay">
                <button class="img-default-btn" :class="{ active: img.is_default }" @click="setDefaultImage(img.id)"
                  title="Image principale">
                  <Bookmark :size="14" />
                </button>
                <button class="img-delete-btn" @click="markImageForDeletion(img.id)" title="Supprimer">
                  <Trash :size="14" />
                </button>
              </div>
              <span v-if="img.markedForDeletion" class="img-delete-mark">Supprimée</span>
            </div>
          </div>

          <!-- Upload new images -->
          <div class="upload-zone" :class="{ dragging: isDragging }" @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false" @drop.prevent="onDrop" @click="$refs.fileInput.click()">
            <Upload :size="24" />
            <p>Glissez des images ici ou cliquez pour sélectionner</p>
            <span class="upload-hint">PNG, JPG, WEBP · Max 5 MB</span>
            <input ref="fileInput" type="file" accept="image/*" multiple style="display:none" @change="onFileSelect" />
          </div>

          <!-- Preview new images -->
          <div v-if="newImagePreviews.length > 0" class="new-images-preview">
            <div v-for="(preview, i) in newImagePreviews" :key="i" class="preview-img">
              <img :src="preview.url" :alt="'Image ' + (i + 1)" />
              <button class="img-delete-btn" @click="removeNewImage(i)">
                <X :size="14" />
              </button>
            </div>
          </div>
        </div>

        <!-- Error global -->
        <div v-if="globalError" class="global-error">
          {{ globalError }}
        </div>

        <!-- Success -->
        <div v-if="successMsg" class="global-success">
          {{ successMsg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { ArrowLeft, Save, Plus, X, Upload, Bookmark, ExternalLink, Check, Trash } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => !!route.params.id)
const loadingProduct = ref(isEditing.value)
const saving = ref(false)
const saved = ref(false)
const globalError = ref('')
const successMsg = ref('')
const errors = ref({})

const categories = ref([])
const materials = ref([])
const existingImages = ref([])
const newImageFiles = ref([])
const newImagePreviews = ref([])
const isDragging = ref(false)
const fileInput = ref(null)

const form = ref({
  title: '',
  price: '',
  reference: '',
  quantity: '',
  description: '',
  material_id: '',
  width: '',
  length: '',
  depth: '',
  category_ids: [],
  variations: [],
})

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadMaterials()
  ])
  if (isEditing.value) {
    await loadProduct()
  }
})

async function loadMaterials() {
  try {
    const data = await api.getMaterials()
    materials.value = data.data || data || []
  } catch {
    materials.value = []
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

async function loadProduct() {
  try {
    const data = await api.getProduct(route.params.id)
    const product = data.data || data
    form.value = {
      title: product.title || '',
      price: product.price || '',
      reference: product.reference || '',
      quantity: product.quantity ?? '',
      description: product.description || '',
      material_id: product.material_id || '',
      width: product.width || '',
      length: product.length || '',
      depth: product.depth || '',
      category_ids: (product.categories || []).map(c => c.id),
      variations: (product.variations || []).map(v => ({
        id: v.id,
        type: v.type,
        value: v.value,
        quantity: v.pivot?.quantity ?? v.quantity ?? '',
      })),
    }
    existingImages.value = (product.images || []).map(img => ({ ...img, markedForDeletion: false }))
  } catch (e) {
    globalError.value = 'Impossible de charger le produit.'
  } finally {
    loadingProduct.value = false
  }
}

function addVariation() {
  form.value.variations.push({ type: 'couleur', value: '', quantity: 0 })
}

function removeVariation(index) {
  form.value.variations.splice(index, 1)
}

function onFileSelect(e) {
  addFiles(Array.from(e.target.files))
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  addFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')))
}

function addFiles(files) {
  files.forEach(file => {
    newImageFiles.value.push(file)
    const url = URL.createObjectURL(file)
    newImagePreviews.value.push({ url, file })
  })
}

function removeNewImage(index) {
  URL.revokeObjectURL(newImagePreviews.value[index].url)
  newImageFiles.value.splice(index, 1)
  newImagePreviews.value.splice(index, 1)
}

function setDefaultImage(imgId) {
  existingImages.value.forEach(img => {
    img.is_default = img.id === imgId
  })
}

function markImageForDeletion(imgId) {
  const img = existingImages.value.find(i => i.id === imgId)
  if (img) img.markedForDeletion = !img.markedForDeletion
}

function validate() {
  errors.value = {}
  if (!form.value.title.trim()) errors.value.title = 'Le titre est requis.'
  if (!form.value.price || isNaN(form.value.price)) errors.value.price = 'Le prix est requis.'
  return Object.keys(errors.value).length === 0
}

async function handleSave() {
  if (!validate()) return

  saving.value = true
  globalError.value = ''
  successMsg.value = ''

  try {
    const formData = buildFormData()

    if (isEditing.value) {
      await api.updateProduct(route.params.id, formData)
      successMsg.value = 'Produit mis à jour avec succès.'
      await loadProduct()

      saved.value = true
      setTimeout(() => saved.value = false, 1000)
    } else {
      const response = await api.createProduct(formData)
      successMsg.value = 'Produit créé avec succès.'

      saved.value = true
      const newId = response?.data?.id || response?.id
      if (newId) {
        setTimeout(() => router.push({ name: 'admin-product-edit', params: { id: newId } }), 1000)
      } else {
        setTimeout(() => saved.value = false, 1000)
      }
    }
  } catch (e) {
    if (e.data?.errors) {
      // Validation Laravel
      const laravelErrors = e.data.errors
      Object.keys(laravelErrors).forEach(key => {
        errors.value[key] = laravelErrors[key][0]
      })
      globalError.value = 'Veuillez corriger les erreurs ci-dessous.'
    } else {
      globalError.value = e.data?.message || 'Une erreur est survenue.'
    }
  } finally {
    saving.value = false
  }
}

function buildFormData() {
  const fd = new FormData()

  fd.append('title', form.value.title)
  fd.append('price', form.value.price)
  if (form.value.reference) fd.append('reference', form.value.reference)
  if (form.value.quantity !== '') fd.append('quantity', form.value.quantity)
  if (form.value.description) fd.append('description', form.value.description)
  if (form.value.material_id) fd.append('material_id', form.value.material_id)
  if (form.value.width !== '') fd.append('width', form.value.width)
  if (form.value.length !== '') fd.append('length', form.value.length)
  if (form.value.depth !== '') fd.append('depth', form.value.depth)

  form.value.category_ids.forEach((id, i) => {
    fd.append(`category_ids[${i}]`, id)
  })

  form.value.variations.forEach((v, i) => {
    if (v.id) fd.append(`variations[${i}][id]`, v.id)
    fd.append(`variations[${i}][type]`, v.type)
    fd.append(`variations[${i}][value]`, v.value)
    fd.append(`variations[${i}][quantity]`, v.quantity || 0)
  })

  // Nouvelles images
  newImageFiles.value.forEach((file, i) => {
    fd.append(`images[${i}]`, file)
  })

  // Images à supprimer
  const toDelete = existingImages.value.filter(img => img.markedForDeletion).map(img => img.id)
  toDelete.forEach((id, i) => {
    fd.append(`delete_images[${i}]`, id)
  })

  // Image par défaut
  const defaultImg = existingImages.value.find(img => img.is_default && !img.markedForDeletion)
  if (defaultImg) fd.append('default_image_id', defaultImg.id)

  return fd
}
</script>

<style scoped>
.product-form-page {
  max-width: 1100px;
}

.mt-3 {
  margin-top: 1rem;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-marron-light);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--color-marron);
}

.page-title {
  font-size: 1.75rem;
  color: var(--color-dark);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 1.5px solid var(--color-sable);
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s;
  text-decoration: none;
  color: var(--color-dark);
}

.btn-secondary:hover {
  border-color: var(--color-marron);
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
  transition: background 0.2s;
  min-width: 110px;
  justify-content: center;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-marron-dark);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary.btn-success {
  background: #27ae60 !important;
  border-color: #27ae60 !important;
  color: white;
  opacity: 1 !important;
}

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

.spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Layout */
.form-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 900px) {
  .form-layout {
    grid-template-columns: 1fr;
  }
}

/* Cards */
.card {
  background: white;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(60, 58, 31, 0.06);
  margin-bottom: 1.5rem;
}

.card:last-child {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-dark);
  margin: 0 0 1.25rem;
}

.card-header .card-title {
  margin: 0;
}

/* Forms */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-dark);
}

.required {
  color: #c62828;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.7rem 0.875rem;
  border: 1.5px solid var(--color-sable);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--color-dark);
  background: #fafaf7;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--color-marron);
  background: white;
}

.field-error {
  color: #c62828;
  font-size: 0.8rem;
  margin: 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

/* Variations */
.empty-variations {
  color: var(--color-marron-light);
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
  background: #fafaf7;
  border-radius: 8px;
}

.variation-row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  padding: 0.75rem;
  background: #fafaf7;
  border-radius: 10px;
  margin-bottom: 0.75rem;
}

.variation-row .form-group {
  margin-bottom: 0;
}

.flex-1 {
  flex: 1;
}

.btn-add-variation {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: var(--color-beige);
  border: 1.5px solid var(--color-sable);
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.btn-add-variation:hover {
  border-color: var(--color-marron);
}

.btn-remove-variation {
  width: 32px;
  height: 32px;
  background: #fdecea;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c62828;
  flex-shrink: 0;
  margin-bottom: 0;
  align-self: flex-end;
}

/* Categories */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-dark);
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-marron);
}

.muted-sm {
  color: var(--color-marron-light);
  font-size: 0.875rem;
  margin: 0;
}

/* Images */
.existing-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.existing-img {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
}

.existing-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.existing-img:hover .img-overlay {
  opacity: 1;
}

.img-default-btn,
.img-delete-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;
}

.img-default-btn:hover,
.img-delete-btn:hover {
  transform: scale(1.1);
}

.img-default-btn {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.img-default-btn.active {
  background: #27ae60;
  color: white;
}

.img-delete-btn {
  background: rgba(198, 40, 40, 0.8);
  color: white;
}

.img-delete-btn:hover {
  background: #c62828;
}

.img-delete-mark {
  position: absolute;
  inset: 0;
  background: rgba(198, 40, 40, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
}

.upload-zone {
  border: 2px dashed var(--color-sable);
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  color: var(--color-marron-light);
}

.upload-zone:hover,
.upload-zone.dragging {
  border-color: var(--color-marron);
  background: #fdf9f5;
}

.upload-zone p {
  margin: 0.5rem 0 0.25rem;
  font-size: 0.875rem;
}

.upload-hint {
  font-size: 0.75rem;
}

.new-images-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.preview-img {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
}

.preview-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-img .img-delete-btn {
  position: absolute;
  top: 3px;
  right: 3px;
  opacity: 0;
  transition: opacity 0.2s;
}

.preview-img:hover .img-delete-btn {
  opacity: 1;
}

/* Alerts */
.global-error {
  background: #fdecea;
  color: #c62828;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
}

.global-success {
  background: #e8f5e9;
  color: #388e3c;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
}
</style>
