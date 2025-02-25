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
      membres.value.push(membreCree); // Mise à jour locale sans rechargement
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
<style  lang="scss">
.gestion-membres {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  .titre-page {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
  }

  .formulaire-membre {
    background: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    h2 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .groupe-formulaire {
      margin-bottom: 15px;

      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #2c3e50;
      }

      input {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #2c3e50;
        transition: border-color 0.3s;
      }
      input:focus {
        border-color:#2c3e50;
        outline: none;
      }
    }

    .actions-formulaire {
      display: flex;
      gap: 10px;

      .btn {
        background: #2c3e50;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s ease, transform 0.2s;
        font-weight: bold;

        &.btn-secondaire {
          background: #6c757d;
        }

        &.btn-danger {
          background: #dc3545;
        }

        &:hover {
          transform: translateY(-2px);
          opacity: 0.9;
          background:#2c3e50;
        }
      }
    }
  }

  .liste-membres {
    h2 {
      color: #2c3e50;
      margin-bottom: 5px;
    }

    .carte-membre {
      background: white;
      border: 2px solid #2c3e50;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      h2 {
        color: #2c3e50;
        margin-bottom: 5px;
      }

      p {
        color: #555;
      }

      &:hover {
        transform: scale(1.02);
      }

      img {
        max-width: 100px;
        margin: 10px 0;
        border-radius: 50%;
        border: 2px solid #2c3e50;
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
    transition: opacity 0.3s ease;

    .contenu-modal {
      background: #2c3e50;
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      animation: fadeIn 0.3s ease-in-out;

      p {
        margin-bottom: 15px;
      }

      .btn {
        background: white;
        color: #2c3e50;
        font-weight: bold;
      }

      .btn-danger {
        background: #dc3545;
        color: white;
      }

      .btn-secondaire {
        background: #6c757d;
        color: white;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
