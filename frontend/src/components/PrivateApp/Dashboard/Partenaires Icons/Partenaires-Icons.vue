<script setup lang="ts">
import PictureLoader from "@/components/ui/PictureLoader.vue";
import { ref, onMounted } from "vue";
import {IPartnerIconDB, IPartnerIcon} from "@shared/crudTypes";
import { useApi } from "@/composition/api";

const { GetPartnerIcon, CreatePartnerIcon, UpdatePartnerIcon, DeletePartnerIcon } = useApi();

const newPartenaire = ref<IPartnerIcon>({
  title: "",
  mainPicture: { path: "", mimetype: "", thumbnail: "" },
});
const partenaires = ref<IPartnerIconDB[]>([]);
const idEdition = ref<string | null>(null);
const chargement = ref(false);


async function fetchPartenaires() {
  try {
    chargement.value = true;
    const result = await GetPartnerIcon();
    if (result && typeof result === "object") {
      partenaires.value = Object.values(result);
    } else {
      throw new Error("Réponse inattendue de l'API.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des icons partenaires :", error);
  } finally {
    chargement.value = false;
  }
}

const ajouterPartenaire = async () => {
  try {
    await CreatePartnerIcon(newPartenaire.value);
    await fetchPartenaires();
    newPartenaire.value = { title: "", mainPicture: { path: "", mimetype: "", thumbnail: "" } };
  } catch (error) {
    console.error("Erreur lors de l'ajout du partenaire", error);
  }
};


function validerPartner(partnerIcon: IPartnerIcon) {
  return partnerIcon.title && (partnerIcon.mainPicture?.path ?? '');

}

// Réinitialiser le formulaire
function reinitialiserFormulaire() {
  newPartenaire.value ={
    title: "",
    mainPicture: { path: "", mimetype: "", thumbnail: "" },
  };
}


// Modifier un membre
async function modifierPartenaire() {
  if (!idEdition.value || !validerPartner(newPartenaire.value)) return;

  try {
    await UpdatePartnerIcon(newPartenaire.value, idEdition.value);
    idEdition.value = null;
    reinitialiserFormulaire();
    await fetchPartenaires();
    annulerEdition();
  } catch (error) {
    console.error("Erreur lors de la modification du partenaire :", error);
  }
}

const supprimerPartenaire = async (id: string) => {
  try {
    await DeletePartnerIcon(id);
    await fetchPartenaires();
  } catch (error) {
    console.error("Erreur lors de la suppression du partenaire", error);
  }
};

const editerPartenaire = (partenaire: IPartnerIconDB) => {
  idEdition.value = partenaire._id;
  newPartenaire.value = JSON.parse(JSON.stringify(partenaire));
};

const annulerEdition = () => {
  idEdition.value = null;
  newPartenaire.value = { title: "", mainPicture: { path: "", mimetype: "", thumbnail: "" } };
};

onMounted(() => {
  fetchPartenaires();
});
</script>

<template>
  <div class="Partenaires-Icons">
    <div>
      <label>Photo</label>
      <PictureLoader
          class="photo"
          :value="newPartenaire.mainPicture"
          @onChange="(value: any) => (newPartenaire.mainPicture = value)"
      />
    </div>
    <div class="title">
      <label>Titre</label>
      <input v-model="newPartenaire.title" type="text" placeholder="Titre du partenaire" />
    </div>
    <div class="actions-formulaire">
      <button @click="idEdition ? modifierPartenaire() : ajouterPartenaire()" class="btn">
        {{ idEdition ? "Mettre à Jour" : "Ajouter" }}
      </button>
      <button v-if="idEdition" @click="annulerEdition" class="btn btn-secondaire">
        Annuler
      </button>
    </div>
    <div>
      <h2 class="listPartners">Liste des Partenaires</h2>
      <ul>
          <li v-for="partenaire in partenaires" :key="partenaire._id">

          <div class="partenaires-infos">
            <img :src="partenaire.mainPicture?.thumbnail" alt="Partenaire" />
            <span>{{ partenaire.title }}</span>
          </div>
          <div>
            <button @click="editerPartenaire(partenaire)">Modifier</button>
            <button @click="supprimerPartenaire(partenaire._id)">Supprimer</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.Partenaires-Icons {
  padding: 20px;
  border-radius: 10px;
  .photo {
    padding: 10px 0 0 0;

  }
  .title{
    padding: 20px 0 0 0;
  }
  .actions-formulaire {
    margin-top: 10px;
  }
  .listPartners{
    padding: 10px 0 0 0;
  }
  input {
    display: block;
    width: 100%;
    padding: 5px;
    margin: 10px 0;
    background: #34495e;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px;
  }
  button {
    background: #1abc9c;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 5px;
  }
  .btn-secondaire {
    background: #e74c3c;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #34495e;
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    color: white;
    .partenaires-infos{
      display: flex;
      gap: 23px;
      align-items: center;
    }
  }
  img {
    max-width: 50px;
    border-radius: 5px;
  }
}
</style>
