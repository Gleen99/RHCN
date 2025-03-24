<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useApi } from '@/composition/api'
import { IMembersPartnerDB } from '@shared/crudTypes'
import html2pdf from 'html2pdf.js'

const { GetMembersPartners } = useApi()

const members = ref<IMembersPartnerDB[]>([])
const loading = ref(false)
const errorMessage = ref('')
const search = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5
const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return members.value.slice(start, end)
})
const totalPages = computed(() => Math.ceil(members.value.length / itemsPerPage))

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

const fetchMembers = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await GetMembersPartners(search.value)
    members.value = response?.data || []
    currentPage.value = 1
  } catch (error: any) {
    errorMessage.value =
        error.response?.data?.message || 'Erreur lors de la récupération des membres.'
  } finally {
    loading.value = false
  }
}

watch(search, fetchMembers)
onMounted(fetchMembers)

const downloadPdf = async (memberId: string) => {
  await nextTick()
  const element = document.getElementById(`member-card-${memberId}`)
  if (!element) return

  const clone = element.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.no-print').forEach(el => el.remove())
  clone.querySelectorAll('.only-pdf').forEach(el => {
    (el as HTMLElement).style.display = 'block'
  })

  const opt = {
    margin: 0.5,
    filename: `fiche_membre_${memberId}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().from(clone).set(opt).save()
}

const formatDate = (timestamp: string | number): string => {
  const date = new Date(Number(timestamp))
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<template>
  <div class="member-list">
    <h1>Membres partenaires</h1>

    <input
        v-model="search"
        placeholder="Rechercher un membre (nom, email, téléphone)"
        class="search-input"
    />

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="loading" class="loading">Chargement...</div>

    <ul v-else-if="paginatedMembers.length > 0" class="members">
      <li
          v-for="member in paginatedMembers"
          :key="member._id"
          :id="`member-card-${member._id}`"
          class="member-card"
      >
        <div class="pdf-header only-pdf">
          <img src="../../../../assets/Footer.png" alt="Logo RHCN" class="pdf-logo" />
          <h2>Fiche Membre</h2>
          <p>Regroupement des Haïtiens de la Capitale-Nationale</p>
          <hr />
        </div>

        <div class="pdf-content">
          <div class="info-row">
            <span class="label">Nom :</span>
            <span class="value">{{ member.firstName }} {{ member.lastName }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email :</span>
            <span class="value">{{ member.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">Téléphone :</span>
            <span class="value">{{ member.phone }}</span>
          </div>
          <div class="info-row">
            <span class="label">Adresse :</span>
            <span class="value">{{ member.address }}</span>
          </div>
          <div class="info-row">
            <span class="label">Date de naissance :</span>
            <span class="value">{{ formatDate(member.birthday) }}</span>
          </div>
          <div class="info-row">
            <span class="label">Age :</span>
            <span class="value">{{ member.age }}</span>
          </div>
          <div class="info-row">
            <span class="label">Message :</span>
            <span class="value">{{ member.message }}</span>
          </div>
          <div class="info-row">
            <span class="label">Confirmation cotisation :</span>
            <span class="value">
              {{
                member.confirmationPaiements === 'accepted'
                    ? 'Accepté'
                    : member.confirmationPaiements === 'rejected'
                        ? 'Rejeté'
                        : member.confirmationPaiements
              }}
            </span>
          </div>
        </div>

        <div class="pdf-footer only-pdf">
          Exporté le {{ new Date().toLocaleDateString('fr-FR') }}
        </div>

        <button @click="downloadPdf(member._id)" class="download-btn no-print">
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

    <div v-else class="no-result">Aucun membre trouvé.</div>
  </div>
</template>

<style scoped lang="scss">
.member-list {
  margin: auto;
  box-shadow: 0 2px 5px white;
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

  .members {
    list-style: none;
    padding: 0;

    .member-card {
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 25px;
      margin-bottom: 20px;
      background: #ffffff;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

      .pdf-logo {
        width: 80px;
        margin-bottom: 10px;
      }

      .pdf-header {
        text-align: center;
        margin-bottom: 25px;

        h2 {
          margin: 5px 0;
          font-size: 20px;
          color: #2c3e50;
        }

        p {
          font-size: 14px;
          color: #555;
        }

        hr {
          margin-top: 10px;
          border: 0;
          border-top: 1px solid #eee;
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

      .pdf-content {
        margin-top: 20px;

        .info-row {
          display: flex;
          padding: 6px 0;
          border-bottom: 1px solid #eee;

          .label {
            font-weight: bold;
            width: 220px;
            color: #2c3e50;
          }

          .value {
            color: #34495e;
          }
        }
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;

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

  .member-card .only-pdf {
    display: none;
  }

  .no-print {
    display: inline-block;
  }
}
</style>
