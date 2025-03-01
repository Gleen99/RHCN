<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useApi } from "@/composition/api";
import { IArticle, IArticleDB } from "@shared/crudTypes";
import TextEditor from "@/components/ui/TextEditor.vue";
import PictureLoader from "@/components/ui/PictureLoader.vue";

const { createArticle, getArticles, deleteArticle, updateArticle } = useApi();

const articles = ref<IArticleDB[]>([]);
const newArticle = ref<IArticle>({
  title: "",
  slug: "",
  categories: [],
  content: [{ blockName: "", text: "" }],
  author: "",
  published: false,
  mainPicture: { path: "" },
});

const idEdition = ref<string | null>(null);
const chargement = ref(false);
const afficherModalSuppression = ref(false);
const articleASupprimer = ref<IArticleDB | null>(null);

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

onMounted(fetchArticles);

// Ajouter ou modifier un article
async function enregistrerArticle() {
  try {
    if (idEdition.value) {
      await updateArticle(newArticle.value, idEdition.value);
    } else {
      const articleCree = await createArticle(newArticle.value);
      if (articleCree) articles.value.push(articleCree);
    }
    idEdition.value = null;
    reinitialiserFormulaire();
    fetchArticles();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'article :", error);
  }
}

// Supprimer un article
async function supprimerArticle() {
  if (!articleASupprimer.value) return;
  try {
    await deleteArticle(articleASupprimer.value._id);
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
      article.title.trim() !== "" &&
      article.slug.trim() !== "" &&
      Array.isArray(article.categories) && article.categories.length > 0
  );
}

// Réinitialiser le formulaire
function reinitialiserFormulaire() {
  newArticle.value = {
    title: "",
    slug: "",
    categories: [],
    content: [{ blockName: "Introduction", text: "" }],
    author: "",
    published: false,
    mainPicture: { path: "" },
  };
}

// Supprimer un bloc de contenu
function supprimerContenu(index: number) {
  newArticle.value.content.splice(index, 1);
}

// Ajouter un bloc de contenu
function ajouterBloc() {
  newArticle.value.content.push({ blockName: "Nouvelle section", text: "" });
}

// Activer le mode édition
function activerEdition(article: IArticleDB) {
  idEdition.value = article._id;
  newArticle.value = JSON.parse(JSON.stringify(article));
}

// Surveiller newArticle pour assurer la mise à jour correcte de TextEditor
watch(newArticle, (val) => {
  console.log("Article chargé pour édition:", val);
}, { deep: true });

// Annuler l'édition
function annulerEdition() {
  idEdition.value = null;
  reinitialiserFormulaire();
}
</script>

<template>
  <div class="article-manager">
    <h1 class="page-title">Gestion des Articles</h1>
    <div class="article-form">
      <h2>{{ idEdition ? "Modifier l'article" : "Créer un article" }}</h2>
      <label>Titre</label>
      <input v-model="newArticle.title" placeholder="Entrez le titre" />

      <label>Slug</label>
      <input v-model="newArticle.slug" placeholder="Entrez le slug" />

      <label>Auteur</label>
      <input v-model="newArticle.author" placeholder="Entrez l'auteur" />

      <label>Catégories</label>
      <input v-model="newArticle.categories" placeholder="Catégories (séparées par des virgules)" />
      <picture-loader
          :value="newArticle.mainPicture"
          @onChange="(fileData : any) => (newArticle.mainPicture = fileData)"
      />
      <div>ajouter voyre ilage</div>
      <label>Publié</label>
      <input type="checkbox" v-model="newArticle.published" />

      <h3>Contenu</h3>
      <div v-for="(block, index) in newArticle.content" :key="index" class="content-block">
        <TextEditor v-model="block.text" />
        <button @click="supprimerContenu(index)" class="btn btn-danger">Supprimer ce bloc</button>
      </div>

      <button @click="enregistrerArticle" class="btn btn-primary">
        {{ idEdition ? "Mettre à jour" : "Ajouter" }}
      </button>
      <button v-if="idEdition" @click="annulerEdition" class="btn btn-secondary">Annuler</button>
    </div>

    <div class="article-list">
      <h2>Liste des Articles</h2>
      <div v-for="article in articles" :key="article.slug" class="article-item">
        <h3>{{ article.title }}</h3>
        <p><strong>Auteur :</strong> {{ article.author }}</p>
        <p><strong>Catégories :</strong> {{ article.categories}}</p>
        <button @click="activerEdition(article)" class="btn btn-info">Modifier</button>
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
