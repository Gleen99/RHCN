<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useApi } from "@/composition/api";
import { IArticle, IArticleDB } from "@shared/crudTypes";
import TextEditor from "@/components/ui/TextEditor.vue";
import PictureLoader from "@/components/ui/PictureLoader.vue";

const { createArticle, getArticles, deleteArticle, updateArticle } = useApi();

const articles = ref<IArticleDB[]>([]);
const newArticle = ref<IArticle>({
  en: { title: "", categories: [], content: [{ blockName: "Introduction", text: "" }], slug: "" },
  fr: { title: "", categories: [], content: [{ blockName: "Introduction", text: "" }], slug: "" },
  author: "",
  mainPicture: { path: "" },
});

const idEdition = ref<string | null>(null);
const chargement = ref(false);
const afficherModalSuppression = ref(false);
const articleASupprimer = ref<IArticleDB | null>(null);
const articleAffiche = ref<IArticleDB | null>(null);
const afficherContenuModal = ref(false);
const messageErreur = ref<string | null>(null);

// Pagination
const currentPage = ref(1);
const articlesPerPage = 5;
const totalPages = computed(() => Math.ceil(articles.value.length / articlesPerPage));
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage;
  return articles.value.slice(start, start + articlesPerPage);
});

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}

function ouvrirContenu(article: IArticleDB) {
  articleAffiche.value = article;
  afficherContenuModal.value = true;
}
function fermerContenu() {
  articleAffiche.value = null;
  afficherContenuModal.value = false;
}
function parseCategories(value: string[] | string): string[] {
  if (Array.isArray(value)) return value;
  return value.split(",").map((cat) => cat.trim()).filter(Boolean);
}
async function fetchArticles() {
  try {
    chargement.value = true;
    const result = await getArticles();
    if (Array.isArray(result)) articles.value = result;
    else throw new Error("Réponse inattendue de l'API.");
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    messageErreur.value = "Impossible de charger les articles.";
  } finally {
    chargement.value = false;
  }
}
async function enregistrerArticle() {
  try {
    messageErreur.value = null;
    newArticle.value.fr.categories = parseCategories(newArticle.value.fr.categories);
    newArticle.value.en.categories = parseCategories(newArticle.value.en.categories);

    if (!validerArticle(newArticle.value)) {
      messageErreur.value = "Veuillez remplir tous les champs obligatoires.";
      return;
    }

    if (idEdition.value) await updateArticle(newArticle.value, idEdition.value);
    else {
      const articleCree = await createArticle(newArticle.value);
      if (articleCree) articles.value.push(articleCree);
    }

    idEdition.value = null;
    reinitialiserFormulaire();
    fetchArticles();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'article :", error);
    messageErreur.value = "Une erreur est survenue lors de l'enregistrement.";
  }
}
function supprimerArticle() {
  if (!articleASupprimer.value) return;
  deleteArticle(articleASupprimer.value._id)
      .then(() => {
        afficherModalSuppression.value = false;
        articleASupprimer.value = null;
        fetchArticles();
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'article :", error);
        messageErreur.value = "Erreur lors de la suppression.";
      });
}
function validerArticle(article: IArticle) {
  return (
      article.fr.title.trim() !== "" &&
      article.en.title.trim() !== "" &&
      article.fr.categories.length > 0 &&
      article.en.categories.length > 0
  );
}
function reinitialiserFormulaire() {
  newArticle.value = {
    en: { title: "", categories: [], content: [{ blockName: "Introduction", text: "" }], slug: "" },
    fr: { title: "", categories: [], content: [{ blockName: "Introduction", text: "" }], slug: "" },
    author: "",
    mainPicture: { path: "" },
  };
}
function activerEdition(article: IArticleDB) {
  idEdition.value = article._id;
  newArticle.value = JSON.parse(JSON.stringify(article));
}
function annulerEdition() {
  idEdition.value = null;
  reinitialiserFormulaire();
}
onMounted(fetchArticles);
watch(newArticle, (val) => {
  console.log("Article chargé pour édition:", val);
}, { deep: true });
</script>

<template>
  <div class="article-manager">
    <h1 class="page-title">Gestion des Articles</h1>
    <p v-if="messageErreur" class="error-message">{{ messageErreur }}</p>

    <!-- Formulaire -->
    <div class="article-form">
      <h1>{{ idEdition ? "Modifier l'article" : "Créer un article" }}</h1>
      <div class="article-form-content">
        <div>
          <label>Titre (FR)</label>
          <input v-model="newArticle.fr.title" placeholder="Titre en français" />
        </div>
        <div>
          <label>Catégories (FR)</label>
          <input v-model="newArticle.fr.categories" placeholder="Catégories FR (virgules)" />
        </div>
      </div>
      <div class="article-form-content">
        <div>
          <label>Titre (EN)</label>
          <input v-model="newArticle.en.title" placeholder="Titre en anglais" />
        </div>
        <div>
          <label>Catégories (EN)</label>
          <input v-model="newArticle.en.categories" placeholder="Catégories EN (virgules)" />
        </div>
      </div>
      <label>Auteur</label>
      <input v-model="newArticle.author" placeholder="Auteur de l'article" />
      <div class="article-form-content-image">
        <label>Image principale</label>
        <PictureLoader
            class="picture-loader"
            :value="newArticle.mainPicture"
            @onChange="(fileData: any) => (newArticle.mainPicture = fileData)"
        />
      </div>
      <label>Contenu (FR)</label>
      <div v-for="(block, index) in newArticle.fr.content" :key="'fr-' + index" class="content-block">
        <TextEditor v-model="block.text" />
      </div>
      <label>Contenu (EN)</label>
      <div v-for="(block, index) in newArticle.en.content" :key="'en-' + index" class="content-block">
        <TextEditor v-model="block.text" />
      </div>
      <div class="form-actions">
        <button @click="enregistrerArticle" class="btn btn-primary">{{ idEdition ? "Mettre à jour" : "Ajouter" }}</button>
        <button v-if="idEdition" @click="annulerEdition" class="btn btn-secondary">Annuler</button>
      </div>
    </div>

    <!-- Liste des articles -->
    <div class="article-list">
      <h1>Liste des Articles</h1>
      <div v-for="article in paginatedArticles" :key="article._id" class="article-item">
        <h3><strong>Titre FR :</strong> {{ article.fr.title }}</h3>
        <h3><strong>Titre EN :</strong> {{ article.en.title }}</h3>
        <h3><strong>Auteur :</strong> {{ article.author }}</h3>
        <h3><strong>Catégories (FR) :</strong> {{ article.fr.categories.join(', ') }}</h3>
        <h3><strong>Catégories (EN) :</strong> {{ article.en.categories.join(', ') }}</h3>
        <div class="form-actions">
          <button @click="activerEdition(article)" class="btn btn-info">Modifier</button>
          <button @click="ouvrirContenu(article)" class="btn btn-primary">Voir contenu</button>
          <button @click="() => { articleASupprimer = article; afficherModalSuppression = true }" class="btn btn-danger">Supprimer</button>
        </div>
      </div>

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
    </div>

    <!-- Suppression -->
    <div v-if="afficherModalSuppression" class="modal-backdrop">
      <div class="modal">
        <h3>Confirmer la suppression</h3>
        <p>Supprimer l'article <strong>{{ articleASupprimer?.fr.title }}</strong> ?</p>
        <div class="form-actions">
          <button @click="supprimerArticle" class="btn btn-danger">Oui, supprimer</button>
          <button @click="() => { afficherModalSuppression = false; articleASupprimer = null }" class="btn btn-secondary">Annuler</button>
        </div>
      </div>
    </div>

    <!-- Popin contenu -->
    <div v-if="afficherContenuModal" class="modal-backdrop">
      <div class="modal large-modal">
        <h2>Contenu de l'article</h2>
        <div class="lang-block">
          <h3>Contenu FR</h3>
          <div v-for="(block, index) in articleAffiche?.fr.content" :key="'fr-' + index">
            <h4>{{ block.blockName }}</h4>
            <div v-html="block.text"></div>
          </div>
        </div>
        <div class="lang-block">
          <h3>Contenu EN</h3>
          <div v-for="(block, index) in articleAffiche?.en.content" :key="'en-' + index">
            <h4>{{ block.blockName }}</h4>
            <div v-html="block.text"></div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary" @click="fermerContenu">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-manager {
  margin: auto;
  box-shadow: 0 2px 5px white;
  padding: 20px;
  border-radius: 10px;

  .error-message {
    color: #dc3545;
    background-color: #ffe5e5;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
  }

  .page-title {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
  }

  .article-form {
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    box-shadow: 0 2px 5px white;

    .article-form-content {
      display: flex;
      justify-content: space-between;
      gap:23px;
      div{
        flex: 1;
      }
    }
    .article-form-content-image{
      margin: 10px 0;
      .picture-loader{
        margin-top: 10px;
      }
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 15px;
    }

    label {
      font-weight: bold;
      color: #2c3e50;
    }

    input, textarea {
      font-family: $Arial;
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
    margin: 10px 0;
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
        line-height: 18px;
        strong{
          font-weight: bold;
        }
      }

      &:hover {
        transform: scale(1.02);
      }
    }
  }
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    padding: 30px;
    border-radius: 10px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  .form-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
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
  .modal.large-modal {
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 30px;
    background: white;
    border-radius: 10px;
    text-align: left;

    h2 {
      margin-bottom: 20px;
      text-align: center;
      color: #2c3e50;
    }

    .lang-block {
      margin-bottom: 30px;

      h3 {
        color: #2c3e50;
        margin-top: 20px;
      }

      h4 {
        margin-top: 10px;
        font-weight: bold;
      }

      div {
        background: #f4f4f4;
        padding: 10px;
        border-radius: 6px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>