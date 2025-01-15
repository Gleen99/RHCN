<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { IMember, IMemberDB } from "@shared/crudTypes";
import PictureLoader from "@/components/ui/PictureLoader.vue";

const { createMember, getMembers, deleteMember, updateMember } = useApi();

const membres = ref<IMemberDB[]>([]);
const nouveauMembre = ref<IMember>({
  firstname: "",
  lastname: "",
  titre: "",
  picture: { path: "", mimetype: "", thumbnail: "" },
});
const idEdition = ref<string | null>(null);
const chargement = ref(false);
const afficherModalSuppression = ref(false);
const membreASupprimer = ref<string | null>(null);

// Récupérer les membres
async function fetchMembres() {
  try {
    chargement.value = true;
    const result = await getMembers();
    if (result && typeof result === "object") {
      membres.value = Object.values(result);
    } else {
      throw new Error("Réponse inattendue de l'API.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des membres :", error);
  } finally {
    chargement.value = false;
  }
}

// Ajouter un membre
async function ajouterMembre() {
  if (!validerMembre(nouveauMembre.value)) {
    alert("Tous les champs sont requis.");
    return;
  }

  try {
    const membreCree = await createMember(nouveauMembre.value);
    if (membreCree) {
      membres.value.push(membreCree);
      reinitialiserFormulaire();
    }
  } catch (error) {
    console.error("Erreur lors de la création du membre :", error);
  }
}

// Modifier un membre
async function modifierMembre() {
  if (!idEdition.value || !validerMembre(nouveauMembre.value)) return;

  try {
    await updateMember(nouveauMembre.value, idEdition.value);
    idEdition.value = null;
    reinitialiserFormulaire();
    fetchMembres();
  } catch (error) {
    console.error("Erreur lors de la modification du membre :", error);
  }
}

// Supprimer un membre
async function supprimerMembre() {
  if (!membreASupprimer.value) return;

  try {
    await deleteMember(membreASupprimer.value);
    afficherModalSuppression.value = false;
    membreASupprimer.value = null;
    fetchMembres();
  } catch (error) {
    console.error("Erreur lors de la suppression du membre :", error);
  }
}

// Valider le membre
function validerMembre(membre: IMember) {
  return membre.firstname && membre.lastname && membre.titre && membre.picture.path;
}

// Réinitialiser le formulaire
function reinitialiserFormulaire() {
  nouveauMembre.value = {
    firstname: "",
    lastname: "",
    titre: "",
    picture: { path: "", mimetype: "", thumbnail: "" },
  };
}

// Activer le mode édition
function activerEdition(membre: IMemberDB) {
  idEdition.value = membre._id;
  nouveauMembre.value = { ...membre };
}

// Annuler l'édition
function annulerEdition() {
  idEdition.value = null;
  reinitialiserFormulaire();
}

// Lifecycle hook
onMounted(fetchMembres);
</script>

<template>
  <div class="gestion-membres">
    <h1 class="titre-page">Gestion des Membres</h1>

    <!-- Formulaire -->
    <div class="formulaire-membre">
      <h2>{{ idEdition ? "Modifier un Membre" : "Créer un Membre" }}</h2>
      <div class="groupe-formulaire">
        <label>Prénom</label>
        <input v-model="nouveauMembre.firstname" placeholder="Entrez le prénom" />
      </div>
      <div class="groupe-formulaire">
        <label>Nom</label>
        <input v-model="nouveauMembre.lastname" placeholder="Entrez le nom" />
      </div>
      <div class="groupe-formulaire">
        <label>Titre</label>
        <input v-model="nouveauMembre.titre" placeholder="Entrez le titre" />
      </div>
      <div class="groupe-formulaire">
        <label>Photo</label>
        <PictureLoader
          :value="nouveauMembre.picture"
          @onChange="(value: any) => (nouveauMembre.picture = value)"
        />
      </div>
      <div class="actions-formulaire">
        <button @click="idEdition ? modifierMembre() : ajouterMembre()" class="btn">
          {{ idEdition ? "Mettre à Jour" : "Ajouter" }}
        </button>
        <button v-if="idEdition" @click="annulerEdition" class="btn btn-secondaire">
          Annuler
        </button>
      </div>
    </div>

    <!-- Liste des Membres -->
    <div v-if="chargement" class="chargement">Chargement...</div>
    <div v-else class="liste-membres">
      <h2>Liste des Membres</h2>
      <div v-for="membre in membres" :key="membre._id" class="carte-membre">
        <h3>{{ membre.firstname }} {{ membre.lastname }}</h3>
        <p>{{ membre.titre }}</p>
        <img v-if="membre.picture.thumbnail" :src="membre.picture.thumbnail" alt="Photo" />
        <div class="actions-carte">
          <button @click="activerEdition(membre)" class="btn">Modifier</button>
          <button @click="() => { membreASupprimer = membre._id; afficherModalSuppression = true; }" class="btn btn-danger">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Modal Suppression -->
    <div v-if="afficherModalSuppression" class="modal">
      <div class="contenu-modal">
        <p>Voulez-vous vraiment supprimer ce membre ?</p>
        <button @click="supprimerMembre" class="btn btn-danger">Oui</button>
        <button @click="() => { afficherModalSuppression = false; membreASupprimer = null; }" class="btn btn-secondaire">Non</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.gestion-membres {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;

  .titre-page {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
  }

  .formulaire-membre {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;

    .groupe-formulaire {
      margin-bottom: 15px;

      label {
        display: block;
        margin-bottom: 5px;
      }

      input {
        width: 100%;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
      }
    }

    .actions-formulaire {
      display: flex;
      gap: 10px;

      .btn {
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &.btn-secondaire {
          background: #6c757d;
          color: white;
        }

        &.btn-danger {
          background: #dc3545;
          color: white;
        }
      }
    }
  }

  .liste-membres {
    .carte-membre {
      background: white;
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;

      img {
        max-width: 100px;
        margin: 10px 0;
      }

      .actions-carte {
        display: flex;
        gap: 10px;

        .btn {
          padding: 8px 12px;
        }
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;

    .contenu-modal {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
  }
}
</style>
