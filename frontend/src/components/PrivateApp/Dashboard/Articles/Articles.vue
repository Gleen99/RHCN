<script setup lang="ts">
import { ref } from "vue";
import { useApi } from "@/composition/api";
import { IArticle } from "@shared/crudTypes";
import TextEditor from "@/components/ui/TextEditor.vue";

// API Simulation
const {
  createArticle,
  getArticles,
  deleteArticle,
  updateArticle,
} = useApi();

const articles = ref<IArticle[]>([]);

const newArticle = ref<IArticle>({
  title: "",
  slug: "",
  categories: [],
  content: [
    {
      blockName: "Introduction",
      text: "",
    },
  ],
  author: "",
  published: false,
});

const idEdition = ref<string | null>(null);
const chargement = ref(false);
const afficherModalSuppression = ref(false);
const articleASupprimer = ref<string | null>(null);

// Récupérer les articles
async function fetchArticles() {
  try {
    chargement.value = true;
    const result = await getArticles();
    if (result && Array.isArray(result)) {
      articles.value = result;
    } else {
      throw new Error("Réponse inattendue de l'API.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
  } finally {
    chargement.value = false;
  }
}


// Ajouter un article
async function ajouterArticle() {
  if (!validerArticle(newArticle.value)) {
    alert("Tous les champs sont requis.");
    return;
  }

  try {
    const articleCree = await createArticle(newArticle.value);
    if (articleCree) {
      articles.value.push(articleCree);
      reinitialiserFormulaire();
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'article :", error);
  }
}

// Modifier un article
async function modifierArticle() {
  if (!idEdition.value || !validerArticle(newArticle.value)) return;

  try {
    await updateArticle(newArticle.value, idEdition.value);
    idEdition.value = null;
    reinitialiserFormulaire();
    fetchArticles();
  } catch (error) {
    console.error("Erreur lors de la modification de l'article :", error);
  }
}

// Supprimer un article
async function supprimerArticle() {
  if (!articleASupprimer.value) return;

  try {
    await deleteArticle(articleASupprimer.value);
    afficherModalSuppression.value = false;
    articleASupprimer.value = null;
    fetchArticles();
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article :", error);
  }
}

// Valider l'article
function validerArticle(article: IArticle) {
  return (
      article.title &&
      article.slug &&
      article.categories.length > 0 &&
      article.content.every((block) => block.blockName && block.text)
  );
}

// Réinitialiser le formulaire
function reinitialiserFormulaire() {
  newArticle.value = {
    title: "",
    slug: "",
    categories: [],
    content: [
      {
        blockName: "Introduction",
        text: "",
      },
    ],
    author: "",
    published: false,
  };
}



// Supprimer un bloc de contenu
function supprimerContenu(index: number) {
  newArticle.value.content.splice(index, 1);
}

// Activer le mode édition
function activerEdition(article: IArticle) {
  idEdition.value = article.slug; // Utiliser un identifiant unique
  newArticle.value = { ...article };
}

// Annuler l'édition
function annulerEdition() {
  idEdition.value = null;
  reinitialiserFormulaire();
}


</script>

<template>
  <div class="article-manager">
    <h1 class="page-title">Gestion des Articles</h1>
    <!-- Formulaire pour créer ou modifier un article -->
    <div class="article-form">
      <h2>{{ idEdition ? "Modifier l'article" : "Créer un article" }}</h2>
      <div>
        <label>Titre</label>
        <input v-model="newArticle.title" placeholder="Entrez le titre" />
      </div>
      <div>
        <label>Slug</label>
        <input v-model="newArticle.slug" placeholder="Entrez le slug" />
      </div>
      <div>
        <label>Auteur</label>
        <input v-model="newArticle.author" placeholder="Entrez l'auteur" />
      </div>
      <div>
        <label>Catégories</label>
        <input
            v-model="newArticle.categories"
            placeholder="Catégories (séparées par des virgules)"
        />
      </div>
      <div>
        <label>Publié</label>
        <input type="checkbox" v-model="newArticle.published" />
      </div>
      <div>
        <h3>Contenu</h3>
        <div
            v-for="(block, index) in newArticle.content"
            :key="index"
            class="content-block"
        >
          <TextEditor v-model="block.text" />
          <button
              @click="() => supprimerContenu(index)"
              class="btn btn-danger"
          >
            Supprimer ce bloc
          </button>
        </div>
      </div>
      <div class="form-actions">
        <button v-if="!idEdition" @click="ajouterArticle" class="btn btn-primary">
          Ajouter
        </button>
        <button v-else @click="modifierArticle" class="btn btn-success">
          Mettre à jour
        </button>
        <button v-if="idEdition" @click="annulerEdition" class="btn btn-secondary">
          Annuler
        </button>
      </div>
    </div>

    <!-- Liste des articles -->
    <div class="article-list">
      <h2>Liste des Articles</h2>
      <div v-for="article in articles" :key="article.slug" class="article-item">
        <h3>{{ article.title }}</h3>
        <p><strong>Auteur :</strong> {{ article.author }}</p>
        <p><strong>Catégories :</strong> {{ article.categories.join(", ") }}</p>
        <button @click="activerEdition(article)" class="btn btn-info">
          Modifier
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.article-manager {
  max-width: 900px;
  margin: auto;
  font-family: Arial, sans-serif;

  .page-title {
    text-align: center;
    margin-bottom: 20px;
  }

  input {
    width: 100%;
    margin: 10px 0;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .content-block {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px dashed #ccc;
    border-radius: 4px;
  }

  .btn {
    margin: 5px;
    padding: 10px 15px;
    border: none;
    cursor: pointer;

    &.btn-primary {
      background-color: #007bff;
      color: white;
    }

    &.btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    &.btn-danger {
      background-color: #dc3545;
      color: white;
    }

    &.btn-info {
      background-color: #17a2b8;
      color: white;
    }
  }
}
</style>
