<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { IListImage, IListImageDB, Picture } from "@shared/crudTypes";
import PictureLoader from "@/components/ui/PictureLoader.vue";

const { GetListImage, CreateListImage, DeleteListImage, UpdateListImage } = useApi();

const images = ref<IListImageDB[]>([]);
const isEditing = ref(false);
const editingImageId = ref<string | null>(null);

const newImage = ref<IListImage>({
  fr: { categories: "" },
  en: { categories: "" },
  date: Date.now(),
  mainPicture: { path: "" },
  published: false,
});

const fetchImages = async () => {
  try {
    const result = await GetListImage();
    images.value = Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error("Erreur lors de la récupération des images :", error);
  }
};

const submitImage = async () => {
  if (!newImage.value.mainPicture.path) {
    alert("Merci de téléverser une image.");
    return;
  }

  try {
    if (isEditing.value && editingImageId.value) {
      await UpdateListImage(newImage.value, editingImageId.value);
      await fetchImages(); // 🔁 Recharger les données depuis le backend après mise à jour
    } else {
      const created = await CreateListImage(newImage.value);
      images.value.push(created);
    }
    resetForm();
  } catch (error) {
    console.error("Erreur lors de la soumission :", error);
  }
};

const deleteImage = async (id: string) => {
  try {
    await DeleteListImage(id);
    images.value = images.value.filter((img) => img._id !== id);
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
};

const startEditing = (image: IListImageDB) => {
  newImage.value = {
    fr: { categories: image.fr?.categories || "" },
    en: { categories: image.en?.categories || "" },
    date: image.date,
    mainPicture: image.mainPicture,
    published: image.published,
  };
  editingImageId.value = image._id;
  isEditing.value = true;
};

const resetForm = () => {
  newImage.value = {
    fr: { categories: "" },
    en: { categories: "" },
    date: Date.now(),
    mainPicture: { path: "" },
    published: false,
  };
  isEditing.value = false;
  editingImageId.value = null;
};

const handleFileChange = (fileData: Picture) => {
  newImage.value.mainPicture = fileData;
};

onMounted(fetchImages);
</script>

<template>
  <div class="image-gallery">
    <h1>Galerie d'Images</h1>

    <div class="add-image">

      <div class="groupe-formulaire">
        <label>Catégories (FR)</label>
        <input v-model="newImage.fr.categories" />
      </div>

      <div class="groupe-formulaire">
        <label>Categories (EN)</label>
        <input v-model="newImage.en.categories" />
      </div>

      <label class="checkbox">
        Publié :
        <input type="checkbox" class="checkbox" v-model="newImage.published" />
      </label>

      <PictureLoader :value="newImage.mainPicture" @onChange="handleFileChange" />

      <button @click="submitImage">
        {{ isEditing ? 'Enregistrer les modifications' : 'Ajouter' }}
      </button>
      <button v-if="isEditing" @click="resetForm">Annuler</button>
    </div>
    <h1>Liste des images</h1>
    <div class="image-list">
      <div v-for="image in images" :key="image._id" class="image-item">
        <div class="image-preview">
          <img :src="image.mainPicture.thumbnail || image.mainPicture.path" alt="Preview" />
        </div>
        <div class="image-details">
          <p><strong>Catégories (FR):</strong> {{ image.fr?.categories }}</p>
          <p><strong>Categories (EN):</strong> {{ image.en?.categories }}</p>
          <p><strong>Publié :</strong> {{ image.published ? "Oui" : "Non" }}</p>
        </div>
        <button @click="() => deleteImage(image._id)">Supprimer</button>
        <button @click="() => startEditing(image)">Modifier</button>
      </div>
    </div>
  </div>
</template>



<style lang="scss">
.image-gallery {
  margin: auto;
  font-family: $Arial;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 5px white;

  h1 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 30px;
  }

  .add-image, .edit-image {
    background: white;
    padding: 25px;
    border-radius: 10px;
    margin-bottom: 40px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);


    label {
      font-weight: bold;
      color: #2c3e50;
    }

    input {
      width: 100%;
      margin: 10px 0;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #ddd;
      transition: border-color 0.3s ease-in-out;

      &:focus {
        border-color: #1a1a1a;
        outline: none;
      }
    }
    .checkbox{
      width: fit-content;
    }

    button {
      margin-top: 15px;
      padding: 10px 20px;
      background-color: #2c3e50;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.3s ease, transform 0.2s;

      &:hover {
        background-color: #1e2b37;
        transform: translateY(-2px);
      }

      & + button {
        margin-left: 10px;
        background-color: #6c757d;

        &:hover {
          background-color: #5a6268;
        }
      }
    }
  }

  .image-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;

    .image-item {
      background: white;
      border-radius: 12px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
      padding: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.02);
      }

      .image-preview {
        width: 100%;
        height: 180px;
        margin-bottom: 15px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #2c3e50;
        }
      }

      .image-details {
        width: 100%;
        text-align: left;
        margin-bottom: 15px;

        p {
          margin: 6px 0;
          font-size: 14px;
          color: #2c3e50;

          strong {
            font-weight: 600;
          }
        }
      }

      button {
        width: 100%;
        margin-bottom: 10px;
        padding: 10px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.3s ease, transform 0.2s;

        &:first-of-type {
          background-color: #dc3545;
          color: white;

          &:hover {
            background-color: #b02a37;
          }
        }

        &:last-of-type {
          background-color: #2c3e50;
          color: white;

          &:hover {
            background-color: #1e2b37;
          }
        }
      }
    }
  }
}
</style>
