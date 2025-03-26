<script setup lang="ts">
import {ref, onMounted, computed, nextTick, watch} from 'vue'
import { useApi } from '@/composition/api'
import html2pdf from 'html2pdf.js'

const { GetContactMessages } = useApi()

const contacts = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')
const search = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5
const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return contacts.value.slice(start, end)
})
const totalPages = computed(() => Math.ceil(contacts.value.length / itemsPerPage))

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

const fetchContacts = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await GetContactMessages(search.value)
    console.log(response)
    contacts.value = response?.data || []
    currentPage.value = 1
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la récupération des messages.'
  } finally {
    loading.value = false
  }
}

watch(search, fetchContacts)
onMounted(fetchContacts)
// ✅ Export PDF
const downloadContactPdf = async (contactId: string) => {
  await nextTick()
  const element = document.getElementById(`contact-card-${contactId}`)
  if (!element) return

  const clone = element.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.no-print').forEach(el => el.remove())
  clone.querySelectorAll('.only-pdf').forEach(el => {
    (el as HTMLElement).style.display = 'block'
  })

  const opt = {
    margin: 0.5,
    filename: `contact_message_${contactId}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().from(clone).set(opt).save()
}
</script>

<template>
  <div class="contact-list">
    <h1>Messages de contact</h1>

    <input
        v-model="search"
        placeholder="Rechercher par email."
        class="search-input"
    />

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="loading" class="loading">Chargement...</div>

    <ul v-else-if="paginatedContacts.length > 0" class="contacts">
      <li
          v-for="contact in paginatedContacts"
          :key="contact._id"
          :id="`contact-card-${contact._id}`"
          class="contact-card"
      >
        <div class="pdf-header only-pdf">
          <img src="../../../../assets/Footer.png" alt="Logo RHCN" class="pdf-logo" />
          <h2>Message de Contact</h2>
          <p>Exporté depuis le site RHCN</p>
          <hr />
        </div>

        <div class="pdf-content">
          <div class="info-row"><span class="label">Nom :</span><span class="value">{{ contact.name }}</span></div>
          <div class="info-row"><span class="label">Email :</span><span class="value">{{ contact.email }}</span></div>
          <div class="info-row" v-if="contact.number"><span class="label">Téléphone :</span><span class="value">{{ contact.number }}</span></div>
          <div class="info-row"><span class="label">Message :</span><span class="value">{{ contact.message }}</span></div>
          <div class="info-row">
            <span class="label">Date :</span>
            <span class="value">{{ new Date(contact.createdAt).toLocaleDateString('fr-FR') }}</span>
          </div>
        </div>
        <div class="pdf-footer only-pdf">
          Exporté le {{ new Date().toLocaleDateString('fr-FR') }}
        </div>

        <!-- Bouton export -->
        <button @click="downloadContactPdf(contact._id)" class="download-btn no-print">
          📄 Télécharger en PDF
        </button>
      </li>
    </ul>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Précédent</button>
      <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.contact-list {
  margin: auto;
  padding: 20px;

  h1 {
    margin-bottom: 20px;
    color: #2c3e50;
  }

  .search-input {
    padding: 10px;
    width: 100%;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-family: $Arial;
  }

  .error {
    color: #e74c3c;
    font-weight: bold;
  }

  .loading {
    color: #3498db;
  }

  .no-result {
    color: #888;
    font-style: italic;
    text-align: center;
    margin-top: 20px;
  }

  .contacts {
    list-style: none;
    padding: 0;

    .contact-card {
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      background: #fff;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

      .pdf-header {
        text-align: center;
        margin-bottom: 15px;

        h2 {
          margin: 5px 0;
        }

        hr {
          margin-top: 10px;
          border: 0;
          border-top: 1px solid #ccc;
        }
      }

      .info-row {
        display: flex;
        padding: 5px 0;

        .label {
          width: 130px;
          font-weight: bold;
          color: #2c3e50;
        }

        .value {
          color: #34495e;
        }
      }

      .pdf-footer {
        margin-top: 30px;
        text-align: right;
        font-size: 12px;
        color: #777;
        border-top: 1px dashed #ccc;
        padding-top: 10px;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;

    button {
      padding: 8px 12px;
      border: 1px solid #2c3e50;
      background: white;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      color: #2c3e50;

      &.active {
        background-color: #2c3e50;
        color: white;
      }

      &:hover:not(.active):not(:disabled) {
        background-color: #ecf0f1;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .download-btn {
    margin-top: 15px;
    padding: 8px 12px;
    border: none;
    background-color: #2c3e50;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #1a252f;
    }
  }

  .only-pdf {
    display: none;
  }

  .contact-card .only-pdf {
    display: none;
  }

  .no-print {
    display: inline-block;
  }
}
</style>
