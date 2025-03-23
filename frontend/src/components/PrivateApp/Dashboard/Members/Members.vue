<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { IMember, IMemberDB, } from "@shared/crudTypes";
import PictureLoader from "@/components/ui/PictureLoader.vue";

const { createMember, getMembers, deleteMember, updateMember } = useApi();

const membres = ref<IMemberDB[]>([]);

const nouveauMembre = ref<IMember>({
  picture: {
    path: '',
    mimetype: '',
    thumbnail: '',
  },
  firstname: '',
  lastname: '',
  fr: {
    titre: '',
  },
  en: {
    titre: '',
  },
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
  return membre.firstname && membre.lastname && membre.fr.titre && membre.en.titre && membre.picture.path;
}

// Réinitialiser le formulaire
function reinitialiserFormulaire() {
  nouveauMembre.value = {
    picture: { path: '', mimetype: '', thumbnail: '' },
    firstname: '',
    lastname: '',
    fr: { titre: '' },
    en: { titre: '' },
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
      <h1>{{ idEdition ? "Modifier un Membre" : "Créer un Membre" }}</h1>
      <div class="groupe-formulaire">
        <label>Prénom</label>
        <input v-model="nouveauMembre.firstname" placeholder="Entrez le prénom" />
      </div>
      <div class="groupe-formulaire">
        <label>Nom</label>
        <input v-model="nouveauMembre.lastname" placeholder="Entrez le nom" />
      </div>
      <div class="groupe-formulaire">
        <label>Titre (Français)</label>
        <input v-model="nouveauMembre.fr.titre" placeholder="Entrez le titre en Français" />
      </div>
      <div class="groupe-formulaire">
        <label>Titre (Anglais)</label>
        <input v-model="nouveauMembre.en.titre" placeholder="Entrez le titre en Anglais" />
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
      <h1>Liste des Membres</h1>
      <div v-for="membre in membres" :key="membre._id" class="carte-membre">
        <img v-if="membre.picture.thumbnail" :src="membre.picture.thumbnail" alt="Photo" />
        <h3>{{ membre.firstname }} {{ membre.lastname }}</h3>
       <div class="carte-membre-title">
         <p><strong>Fr :</strong> {{ membre.fr.titre }}</p>
         <p><strong>En :</strong> {{ membre.en.titre }}</p>
       </div>
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
  margin: auto;
  padding: 20px;
  box-shadow: 0 2px 5px white;
  border-radius: 10px;

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
        border: 1px solid #ddd;
        font-family: $Arial;
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

      .btn, .btn-secondaire  {
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
      }
    }
  }

  .liste-membres {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    margin-top: 20px;

    h1 {
      grid-column: 1 / -1;
      color: #2c3e50;
      margin-bottom: 5px;
    }
    .carte-membre-title{
      display: flex;
      justify-content: center;
      gap: 23px;
    }


    .carte-membre {
      text-align: center;
      padding: 20px;
      background: white;
      border-radius: 12px;
      border: 2px solid #2c3e50;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
      }

      h3 {
        color: #2c3e50;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        color: #555;
      }

      img {
        margin: 10px auto;
        display: block;
        max-width: 100px;
        border-radius: 50%;
        border: 3px solid $cyellow;
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

    }
  }
  .actions-carte {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;

    .btn {
      padding: 10px 16px;
      font-size: 14px;
      font-weight: bold;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-family: $Arial;
      transition: background-color 0.3s ease, transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    }

    .btn:hover {
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
    }

    .btn:active {
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;

      &:hover {
          filter: brightness(0.9); // rend la couleur plus sombre

      }
    }

    .btn-edit {
      background-color: #2c3e50;
      color: white;

      &:hover {
        filter: brightness(0.9);
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