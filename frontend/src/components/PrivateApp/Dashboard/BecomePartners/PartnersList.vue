<script setup lang="ts">
import {ref, onMounted, computed, watch, nextTick} from 'vue'
import { useApi } from '@/composition/api'
import html2pdf from "html2pdf.js";

const { GetBecomePartners } = useApi()

const partners = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')
const search = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5
const paginatedPartners = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return partners.value.slice(start, end)
})
const totalPages = computed(() => Math.ceil(partners.value.length / itemsPerPage))

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

const fetchPartners = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await GetBecomePartners(search.value)
    partners.value = response?.data || []
    currentPage.value = 1
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la récupération des partenaires.'
  } finally {
    loading.value = false
  }
}

watch(search, fetchPartners)
onMounted(fetchPartners)
const downloadPartnerPdf = async (partnerId: string) => {
  await nextTick()
  const element = document.getElementById(`partner-card-${partnerId}`)
  if (!element) return

  const clone = element.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.no-print').forEach(el => el.remove())

  const opt = {
    margin: 0.5,
    filename: `partner_${partnerId}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().from(clone).set(opt).save()
}
</script>

<template>
  <div class="partner-list">
    <h1>Partenaires</h1>

    <input
        v-model="search"
        placeholder="Rechercher un partenaire..."
        class="search-input"
    />

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="loading" class="loading">Chargement...</div>

    <ul v-else-if="paginatedPartners.length > 0" class="partners">
      <li
          v-for="partner in paginatedPartners"
          :key="partner._id"
          :id="`partner-card-${partner._id}`"
          class="partner-card"
      >
        <div class="pdf-header only-pdf">
          <img src="../../../../assets/Footer.png" alt="Logo RHCN" class="pdf-logo" />
          <h2>Message de Contact</h2>
          <p>Exporté depuis le site RHCN</p>
          <hr />
        </div>
        <div class="pdf-content">
          <div class="info-row"><span class="label">Nom :</span><span class="value">{{ partner.name }}</span></div>
          <div class="info-row"><span class="label">Référence :</span><span class="value">{{ partner.reference }}</span></div>
          <div class="info-row"><span class="label">Type de partenariat :</span><span class="value">{{ partner.typeOfPartnership }}</span></div>
          <div class="info-row"><span class="label">Apport :</span><span class="value">{{ partner.apport }}</span></div>
          <div class="info-row"><span class="label">Attentes :</span><span class="value">{{ partner.expentation }}</span></div>
          <div class="info-row" v-if="Array.isArray(partner.documentUploader)">
            <span class="label">Document(s) :</span>
            <div class="value document-list">
              <div
                  v-for="(doc, index) in partner.documentUploader"
                  :key="index"
                  class="document-link"
              >
                📎
                <a
                    :href="doc.content"
                    :download="doc.name"
                    target="_blank"
                    rel="noopener"
                >
                  {{ doc.name }}
                </a>
              </div>
            </div>
          </div>
          <div class="info-row">
            <span class="label">Date :</span>
            <span class="value">{{ new Date(partner.createdAt).toLocaleDateString('fr-FR') }}</span>
          </div>
        </div>

        <div class="pdf-footer only-pdf">
          Exporté le {{ new Date().toLocaleDateString('fr-FR') }}
        </div>
        <!-- Bouton export -->
        <button @click="downloadPartnerPdf(partner._id)" class="download-btn no-print">
          📄 Télécharger en PDF
        </button>
      </li>
    </ul>

    <div v-else class="no-result">Aucun partenaire trouvé.</div>

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
.partner-list {
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

  .partners {
    display: flex;
    flex-direction: column;
    gap: 20px;
    list-style: none;
    padding: 0;

    .partner-card {
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 20px;
      background: #fff;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

      .info-row {
        display: flex;
        padding: 5px 0;
        .document-list {
          display: flex;
          flex-direction: column;
          gap: 6px;

          .document-link {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;

            a {
              color: #2980b9;
              text-decoration: underline;
              word-break: break-word;

              &:hover {
                color: #1f5c8b;
              }
            }
          }
        }
        .label {
          width: 160px;
          font-weight: bold;
          color: #2c3e50;
        }

        .value {
          color: #34495e;
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
}
</style>