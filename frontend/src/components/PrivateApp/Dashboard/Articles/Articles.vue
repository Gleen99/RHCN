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
  background: #f4f4f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  .page-title {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
  }

  .article-form {
    background: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h2 {
      color: #2c3e50;
      margin-bottom: 15px;
    }

    label {
      font-weight: bold;
      color: #2c3e50;
    }

    input, textarea {
      width: 100%;
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #2c3e50;
      border-radius: 5px;
      transition: border-color 0.3s ease-in-out;
    }

    input:focus, textarea:focus {
      border-color: #2c3e50;
      outline: none;
    }
  }

  .content-block {
    margin-bottom: 20px;
    padding: 10px;
    border: 2px dashed #2c3e50;
    border-radius: 4px;
    background: #f8f9fa;
  }

  .article-list {
    h2 {
      color: #2c3e50;
      margin-bottom: 15px;
    }

    .article-item {
      background: white;
      padding: 15px;
      border-left: 5px solid #2c3e50;
      border-radius: 8px;
      margin-bottom: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;

      h3 {
        color: #2c3e50;
        margin-bottom: 5px;
      }

      &:hover {
        transform: scale(1.02);
      }
    }
  }

  .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s ease, transform 0.2s;

    &.btn-primary {
      background: #2c3e50;
      color: white;
    }

    &.btn-success {
      background: #28a745;
      color: white;
    }

    &.btn-secondary {
      background: #6c757d;
      color: white;
    }

    &.btn-danger {
      background: #dc3545;
      color: white;
    }

    &.btn-info {
      background: #17a2b8;
      color: white;
    }

    &:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }
  }
}
</style>
