<script setup lang="ts">
import PictureLoader from "@/components/ui/PictureLoader.vue";
import { ref, onMounted, computed } from "vue";
import { IPartnerIconDB, IPartnerIcon } from "@shared/crudTypes";
import { useApi } from "@/composition/api";

const { GetPartnerIcon, CreatePartnerIcon, UpdatePartnerIcon, DeletePartnerIcon } = useApi();

const newPartenaire = ref<IPartnerIcon>({
  mainPicture: { path: "", mimetype: "", thumbnail: "" },
});
const partenaires = ref<IPartnerIconDB[]>([]);
const idEdition = ref<string | null>(null);
const message = ref<string | null>(null);
const isError = ref(false);
const showPopup = ref(false);
const showConfirmModal = ref(false);
const partenaireASupprimer = ref<string | null>(null);

const page = ref(1);
const perPage = 6;

const paginatedPartenaires = computed(() => {
  const start = (page.value - 1) * perPage;
  return partenaires.value.slice(start, start + perPage);
});

function showMessage() {
  showPopup.value = true;
  setTimeout(() => {
    showPopup.value = false;
  }, 3000);
}

async function fetchPartenaires() {
  try {
    const result = await GetPartnerIcon();
    if (Array.isArray(result)) {
      partenaires.value = result;
    } else {
      throw new Error("Réponse inattendue de l'API.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des icons partenaires :", error);
  }
}

function validerPartner(partnerIcon: IPartnerIcon) {
  return !!partnerIcon.mainPicture?.path;
}

async function ajouterPartenaire() {
  if (!validerPartner(newPartenaire.value)) {
    message.value = "Veuillez sélectionner une image pour le partenaire.";
    isError.value = true;
    showMessage();
    return;
  }

  try {
    await CreatePartnerIcon(newPartenaire.value);
    message.value = "Partenaire ajouté avec succès !";
    isError.value = false;
    await fetchPartenaires();
    reinitialiserFormulaire();
  } catch (error) {
    isError.value = true;
    message.value = "Erreur lors de l'ajout du partenaire.";
    console.error(error);
  } finally {
    showMessage();
  }
}

function reinitialiserFormulaire() {
  newPartenaire.value = {
    mainPicture: { path: "", mimetype: "", thumbnail: "" },
  };
}

async function modifierPartenaire() {
  if (!idEdition.value || !validerPartner(newPartenaire.value)) {
    message.value = "ID ou image manquante.";
    isError.value = true;
    showMessage();
    return;
  }

  try {
    await UpdatePartnerIcon(newPartenaire.value, idEdition.value);
    message.value = "Partenaire modifié avec succès !";
    isError.value = false;
    await fetchPartenaires();
    annulerEdition();
  } catch (error) {
    isError.value = true;
    message.value = "Erreur lors de la modification du partenaire.";
    console.error(error);
  } finally {
    showMessage();
  }
}

function demanderSuppression(id: string) {
  partenaireASupprimer.value = id;
  showConfirmModal.value = true;
}

async function confirmerSuppression() {
  if (!partenaireASupprimer.value) return;
  try {
    await DeletePartnerIcon(partenaireASupprimer.value);
    message.value = "Partenaire supprimé avec succès.";
    isError.value = false;
    await fetchPartenaires();
  } catch (error) {
    isError.value = true;
    message.value = "Erreur lors de la suppression du partenaire.";
    console.error(error);
  } finally {
    showPopup.value = true;
    showConfirmModal.value = false;
    partenaireASupprimer.value = null;
  }
}

function annulerSuppression() {
  partenaireASupprimer.value = null;
  showConfirmModal.value = false;
}

function editerPartenaire(partenaire: IPartnerIconDB) {
  idEdition.value = partenaire._id;
  newPartenaire.value = { ...partenaire };
}

function annulerEdition() {
  idEdition.value = null;
  reinitialiserFormulaire();
}

onMounted(fetchPartenaires);
</script>

<template>
  <div class="Partenaires-Icons">
    <transition name="fade">
      <div v-if="showPopup" :class="['popup-message', isError ? 'error' : 'success']">{{ message }}</div>
    </transition>

    <transition name="fade">
      <div v-if="showConfirmModal" class="modal-overlay">
        <div class="modal">
          <p>Voulez-vous vraiment supprimer ce partenaire ?</p>
          <div class="modal-actions">
            <button @click="confirmerSuppression" class="btn btn-danger">Oui, supprimer</button>
            <button @click="annulerSuppression" class="btn btn-secondaire">Annuler</button>
          </div>
        </div>
      </div>
    </transition>
    <h1>
      Ajouter un partenaire
    </h1>
    <PictureLoader
        class="photo"
        :value="newPartenaire.mainPicture"
        @onChange="(value: any) => (newPartenaire.mainPicture = value)"
    />

    <div class="actions-formulaire">
      <button @click="idEdition ? modifierPartenaire() : ajouterPartenaire()" class="btn">
        {{ idEdition ? "Mettre à Jour" : "Ajouter" }}
      </button>
      <button v-if="idEdition" @click="annulerEdition" class="btn btn-secondaire">
        Annuler
      </button>
    </div>

    <div>
      <h1 class="listPartners">Liste des Partenaires</h1>
      <ul>
        <li v-for="partenaire in paginatedPartenaires" :key="partenaire._id">
          <div class="partenaires-infos">
            <img :src="partenaire.mainPicture?.thumbnail || '/placeholder.jpg'" alt="Partenaire" />
          </div>
          <div>
            <button @click="editerPartenaire(partenaire)">Modifier</button>
            <button @click="() => demanderSuppression(partenaire._id)" class="btn btn-danger">Supprimer</button>
          </div>
        </li>
      </ul>

      <div class="pagination">
        <button :disabled="page === 1" @click="page--">&lt; Précédent</button>
        <button :disabled="page * perPage >= partenaires.length" @click="page++">Suivant &gt;</button>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.Partenaires-Icons {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px white;

  .popup-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    &.success {
      background-color: #2ecc71;
    }
    &.error {
      background-color: #e74c3c;
    }
  }

  .photo {
    padding: 10px 0 0 0;
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-family: $Arial;
    transition: border-color 0.3s;
  }

  .actions-formulaire {
    margin-top: 10px;
    button {
      background-color: $cyellow;
      color: white;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: background-color 0.3s, transform 0.3s;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
      margin-right: 20px;
      font-family: $Arial;
      &:hover {
        background-color: $cyellow;
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(2px);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .listPartners {
    padding: 10px 0 0 0;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    padding: 0;
    margin-top: 20px;
  }

  li {
    background: white;
    border: 1px solid #f1c40f;
    border-radius: 15px;
    padding: 15px;
    color: #2c3e50;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.03);
    }

    .partenaires-infos {
      margin-bottom: 10px;

      img {
        max-width: 80%;
        height: auto;
        border-radius: 6px;
      }
    }

    button {
      padding: 8px 12px;
      margin: 5px 4px;
      font-size: 0.9rem;
      font-weight: bold;
      background: #1abc9c;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background: #16a085;
      }

      &.btn-danger {
        background: #e74c3c;

        &:hover {
          background: #c0392b;
        }
      }
    }

    > div:last-child {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;

    button {
      padding: 8px 12px;
      border: none;
      border-radius: 5px;
      background: #2c3e50;
      color: white;
      cursor: pointer;
      font-weight: bold;

      &:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
      }
    }
  }
}
</style>
