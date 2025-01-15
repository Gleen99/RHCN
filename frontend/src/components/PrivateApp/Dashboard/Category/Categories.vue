<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { ICategorieDB, ICategorie } from "@shared/crudTypes";

const {
  GetCategories,
  CreateCategory,
  DeleteCategories,
  UpdateCategories,
} = useApi();

const categories = ref<ICategorieDB[]>([]);
const newCategories = ref<ICategorie>({
  type: "",
  en: { category: [] },
  fr: { category: [] },
});

// Liste des types de catégories disponibles
const categoryTypes = ref(["Articles", "Evènements", "Images"]);
const selectedType = ref<string>("");
const editingCategory = ref<ICategorieDB | null>(null);

const fetchCategories = async () => {
  try {
    categories.value = await GetCategories();
  } catch (error) {
    console.error("Échec de la récupération des catégories:", error);
  }
};

const addCategories = async () => {
  if (newCategories.value.en.category.length > 0 && newCategories.value.fr.category.length > 0) {
    try {
      newCategories.value.type = [selectedType.value];
      const createdCategory = await CreateCategory(newCategories.value);
      categories.value.push(createdCategory);
      fetchCategories();
      newCategories.value = { type: [], en: { category: [] }, fr: { category: [] } };
    } catch (error) {
      console.error("Échec de la création des catégories:", error);
    }
  } else {
    alert("Veuillez remplir les champs de catégories en français et en anglais.");
  }
};

const deleteCategory = async (id: string) => {
  try {
    await DeleteCategories(id);
    categories.value = categories.value.filter((category) => category._id !== id);
  } catch (error) {
    console.error("Échec de la suppression de la catégorie:", error);
  }
};

const filteredCategories = computed(() => {
  return categories.value.filter((category: any) => category.type && category.type.includes(selectedType.value));
});

const showAddForm = computed(() => {
  return filteredCategories.value.length === 0;
});

const editCategory = (category: ICategorieDB) => {
  editingCategory.value = { ...category };
};

const cancelEdit = () => {
  editingCategory.value = null;
};

const updateCategory = async () => {
  if (!editingCategory.value) return;

  try {
    const updatedCategory = await UpdateCategories(editingCategory.value, editingCategory.value._id);
    const index = categories.value.findIndex((cat) => cat._id === editingCategory.value?._id);
    if (index !== -1) {
      categories.value[index] = updatedCategory;
    }
    editingCategory.value = null;
  } catch (error) {
    console.error("Échec de la mise à jour de la catégorie:", error);
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="category-manager">
    <h1>Gestion des Catégories</h1>

    <!-- Menu déroulant pour sélectionner le type -->
    <div class="type-selector">
      <label for="type-select">Type de catégories</label>
      <select id="type-select" v-model="selectedType">
        <option disabled value="">Sélectionnez un type</option>
        <option v-for="type in categoryTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <!-- Formulaire d'ajout de catégories -->
    <div v-if="selectedType && showAddForm" class="add-category">
      <h2>Ajouter des Catégories pour {{ selectedType }}</h2>
      <label for="categories-fr">Français (séparées par des virgules)</label>
      <input
          id="categories-fr"
          type="text"
          placeholder="Entrez les catégories en français"
          @input="e => newCategories.fr.category = (e.target as HTMLInputElement).value.split(',').map(cat => cat.trim())"
      />

      <label for="categories-en">English (comma-separated)</label>
      <input
          id="categories-en"
          type="text"
          placeholder="Enter categories in English"
          @input="e => newCategories.en.category = (e.target as HTMLInputElement).value.split(',').map(cat => cat.trim())"
      />

      <button class="btn-primary" @click="addCategories">Ajouter</button>
    </div>

    <!-- Liste des catégories -->
    <div v-if="selectedType" class="categories-list">
      <h2>Liste des Catégories pour {{ selectedType }}</h2>
      <div v-if="filteredCategories.length > 0">
        <div v-for="category in filteredCategories" :key="category._id" class="category-item">
          <div class="category-language">
            <h3>Français:</h3>
            <ul>
              <li v-for="cat in category.fr.category" :key="cat" class="category">{{ cat }}</li>
            </ul>
          </div>
          <div class="category-language">
            <h3>English:</h3>
            <ul>
              <li v-for="cat in category.en.category" :key="cat">{{ cat }}</li>
            </ul>
          </div>
          <button class="btn-danger" @click="deleteCategory(category._id)">Supprimer</button>
          <button class="btn-primary" @click="editCategory(category)">Modifier</button>
        </div>
      </div>
      <p v-else>Aucune catégorie disponible pour {{ selectedType }}.</p>
    </div>

    <!-- Formulaire de modification -->
    <div v-if="editingCategory" class="edit-category">
      <h2>Modifier une Catégorie</h2>
      <label for="edit-categories-fr">Français (séparées par des virgules)</label>
      <input
          id="edit-categories-fr"
          v-model="editingCategory.fr.category"
          type="text"
          placeholder="Entrez les catégories en français"
      />

      <label for="edit-categories-en">English (comma-separated)</label>
      <input
          id="edit-categories-en"
          v-model="editingCategory.en.category"
          type="text"
          placeholder="Enter categories in English"
      />

      <button class="btn-primary" @click="updateCategory">Sauvegarder</button>
      <button class="btn-secondary" @click="cancelEdit">Annuler</button>
    </div>
  </div>
</template>

<style lang="scss">
.category-manager {
  max-width: 900px;
  margin: auto;
  font-family: Arial, sans-serif;

  input, select {
    width: 100%;
    margin: 10px 0;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  button {
    margin: 5px;
    padding: 10px 15px;
    border: none;
    cursor: pointer;

    &.btn-primary {
      background-color: #007bff;
      color: white;
    }

    &.btn-danger {
      background-color: #dc3545;
      color: white;
    }

    &.btn-secondary {
      background-color: #6c757d;
      color: white;
    }
  }

  .categories-list {
    margin-top: 20px;

    .category-item {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
      background-color: #f9f9f9;

      .category-language {
        margin-bottom: 10px;

        h3 {
          margin-bottom: 5px;
        }

        ul {
          padding-left: 20px;
          display: flex;
        }
      }
    }
  }

  .edit-category {
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
  }
}
</style>
