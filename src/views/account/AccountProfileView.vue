<template>
  <div class="account-profile">
    <div class="profile-header">
      <h1 class="page-title">Mon profil</h1>
      <p class="page-subtitle">Gérez vos informations personnelles et vos adresses.</p>
    </div>

    <form @submit.prevent="handleUpdate" class="profile-form">
      <div class="grid-form">
        <!-- Informations personnelles -->
        <div class="form-section card">
          <h2 class="section-title"><UserIcon :size="20" /> Informations personnelles</h2>
          
          <div class="form-group">
            <label>Nom complet</label>
            <input v-model="form.name" type="text" placeholder="Jean Dupont" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="votre@email.com" required />
          </div>

          <div class="form-group">
            <label>Téléphone</label>
            <input v-model="form.phone" type="tel" placeholder="06 00 00 00 00" />
          </div>

          <div class="form-group">
            <label>Nouveau mot de passe (optionnel)</label>
            <input v-model="form.password" type="password" placeholder="••••••••" />
          </div>

          <div v-if="form.password" class="form-group">
            <label>Confirmer le mot de passe</label>
            <input v-model="form.password_confirmation" type="password" placeholder="••••••••" />
          </div>
        </div>

        <!-- Adresse de livraison -->
        <div class="form-section card">
          <h2 class="section-title"><Truck :size="20" /> Adresse de livraison</h2>
          
          <div class="form-group">
            <label>Adresse</label>
            <input v-model="form.shipping_address" type="text" placeholder="123 Rue du Bois" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Ville</label>
              <input v-model="form.shipping_city" type="text" placeholder="Paris" />
            </div>
            <div class="form-group">
              <label>Code postal</label>
              <input v-model="form.shipping_zip_code" type="text" placeholder="75001" />
            </div>
          </div>

          <div class="form-group">
            <label>Pays</label>
            <input v-model="form.shipping_country" type="text" placeholder="France" />
          </div>
        </div>

        <!-- Adresse de facturation -->
        <div class="form-section card">
          <h2 class="section-title"><CreditCard :size="20" /> Adresse de facturation</h2>
          
          <div class="form-group">
            <label>Adresse</label>
            <input v-model="form.billing_address" type="text" placeholder="123 Rue du Bois" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Ville</label>
              <input v-model="form.billing_city" type="text" placeholder="Paris" />
            </div>
            <div class="form-group">
              <label>Code postal</label>
              <input v-model="form.billing_zip_code" type="text" placeholder="75001" />
            </div>
          </div>

          <div class="form-group">
            <label>Pays</label>
            <input v-model="form.billing_country" type="text" placeholder="France" />
          </div>
        </div>
      </div>

      <!-- Actions globales -->
      <div class="actions-bar">
        <button type="submit" class="btn-save" :disabled="saving">
          <span v-if="saving" class="spinner"></span>
          <span v-else>Enregistrer les modifications</span>
        </button>
      </div>

      <div v-if="message" class="success-message">
        {{ message }}
      </div>
    </form>

    <div class="danger-zone">
      <div class="section-title danger">
        <h2>Zone de danger</h2>
        <p>Actions irréversibles sur votre compte.</p>
      </div>
      
      <div class="danger-card card">
        <div class="danger-info">
          <h3>Supprimer mon compte</h3>
          <p>Une fois supprimé, toutes vos informations et commandes seront définitivement effacées.</p>
        </div>
        <button class="btn-delete" @click="handleDelete">Supprimer définitivement</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { User as UserIcon, Truck, CreditCard, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const saving = ref(false)
const message = ref('')
const loading = ref(true)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  shipping_address: '',
  shipping_city: '',
  shipping_zip_code: '',
  shipping_country: 'France',
  billing_address: '',
  billing_city: '',
  billing_zip_code: '',
  billing_country: 'France',
  password: '',
  password_confirmation: ''
})

onMounted(async () => {
  try {
    const response = await api.get('/customer/profile')
    const { user, client } = response
    form.name = user.name
    form.email = user.email
    if (client) {
      Object.assign(form, client)
    }
  } catch (err) {
    console.error('Erreur chargement profil:', err)
  } finally {
    loading.value = false
  }
})

async function handleUpdate() {
  saving.value = true
  message.value = ''
  try {
    await api.put('/customer/profile', form)
    message.value = 'Profil mis à jour avec succès.'
    setTimeout(() => { message.value = '' }, 3000)
  } catch (err) {
    console.error(err)
    alert('Erreur lors de la mise à jour')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (confirm('Êtes-vous sûr de vouloir supprimer votre compte Wood&Kraft ? Cette action est irréversible.')) {
    try {
      await api.delete('/customer/profile')
      localStorage.removeItem('customer_user')
      router.push('/')
    } catch (err) {
      alert('Erreur lors de la suppression')
    }
  }
}
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

.grid-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.form-section {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  color: var(--color-marron);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.card {
  background: white;
  border-radius: 20px;
  border: 1px solid var(--color-sable);
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
}

.form-group input {
  padding: 0.875rem;
  border-radius: 10px;
  border: 1.5px solid #eee;
  outline: none;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: var(--color-marron);
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.actions-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4rem;
}

.btn-save {
  padding: 1rem 2.5rem;
  border-radius: 12px;
  border: none;
  background: var(--color-marron);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(67,39,28, 0.2);
  transition: all 0.2s;
}

.btn-save:hover:not(:disabled) {
  background: #472d24;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(67,39,28, 0.3);
}

.btn-save:disabled {
  opacity: 0.7;
}

.success-message {
  padding: 1rem;
  background: #f0fdf4;
  color: #166534;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 600;
}

.danger-zone {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--color-sable);
}

.danger-zone .section-title.danger h2 {
  color: #b91c1c;
}

.danger-card {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.5rem;
  border: 1.5px solid #fee2e2;
  background: #fffafa;
}

.danger-info h3 {
  font-size: 1.1rem;
  color: #b91c1c;
  margin-bottom: 0.5rem;
}

.danger-info p {
  color: #666;
  font-size: 0.9rem;
}

.btn-delete {
  padding: 0.875rem 2rem;
  background: white;
  color: #b91c1c;
  border: 1.5px solid #b91c1c;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete:hover {
  background: #b91c1c;
  color: white;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: rotate 0.8s linear infinite;
  display: inline-block;
}

@keyframes rotate { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .grid-form {
    grid-template-columns: 1fr;
  }
}
</style>
