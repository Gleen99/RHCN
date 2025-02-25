<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composition/api";
import {IListImage, IListImageDB, Picture} from "@shared/crudTypes";
import PictureLoader from "@/components/ui/PictureLoader.vue";

const { GetListImage, CreateListImage, DeleteListImage, UpdateListImage } = useApi();

const images = ref<IListImageDB[]>([]);
const newImage = ref<IListImage>({
  title: "",
  date: Date.now(),
  mainPicture: { path: "" },
  author: "",
  categories: "",
  published: false,
});
const editingImage = ref<{ _id: string; categories: string } | null>(null);

const fetchImages = async () => {
  try {
    const result = await GetListImage();
    images.value = Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};


const addImage = async () => {
  if (!newImage.value.mainPicture.path) {
    alert("Please upload a main picture.");
    return;
  }

  try {
    const createdImage = await CreateListImage(newImage.value);
    images?.value.push(createdImage);
    resetNewImage();
  } catch (error) {
    console.error("Error creating image:", error);
  }
};

const updateImage = async () => {
  if (!editingImage.value) return;

  try {
    const updatedImage = await UpdateListImage(editingImage.value._id, editingImage.value.categories);
    const index = images?.value.findIndex((img) => img._id === editingImage.value?._id);
    if (index !== -1) {
      images.value[index] = { ...images.value[index], categories: updatedImage.categories };
    }
    editingImage.value = null;
  } catch (error) {
    console.error("Error updating image:", error);
  }
};

const deleteImage = async (id: string) => {
  try {
    await DeleteListImage(id);
    images.value = images.value.filter((img) => img._id !== id);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

const handleFileChange = (fileData: Picture) => {
  newImage.value.mainPicture = fileData;
};

const resetNewImage = () => {
  newImage.value = {
    title: "",
    date: Date.now(),
    mainPicture: { path: "" },
    author: "",
    categories: "",
    published: false,
  };
};

onMounted(() => {
  fetchImages();
});
</script>

<template>
  <div class="image-gallery">
    <h1>Image Gallery</h1>

    <!-- Add Image Form -->
    <div class="add-image">
      <h2>Add New Image</h2>
      <input type="text" v-model="newImage.title" placeholder="Title" />
      <input type="text" v-model="newImage.categories" placeholder="Categories" />
      <input type="text" v-model="newImage.author" placeholder="Author" />
      <label>
        Published:
        <input type="checkbox" v-model="newImage.published" />
      </label>

      <PictureLoader :value="newImage.mainPicture" @onChange="handleFileChange" />

      <button @click="addImage">Add Image</button>
    </div>

    <!-- Image List -->
    <div class="image-list">
      <h2>Image List</h2>
      <div v-for="image in images" :key="image._id" class="image-item">
        <div class="image-preview">
          <img :src="image.mainPicture.thumbnail || image.mainPicture.path" alt="Preview" />
        </div>
        <div class="image-details">
          <p><strong>Title:</strong> {{ image.title }}</p>
          <p><strong>Author:</strong> {{ image.author }}</p>
          <p><strong>Categories:</strong> {{ image.categories }}</p>
          <p><strong>Published:</strong> {{ image.published ? "Yes" : "No" }}</p>
        </div>
        <button @click="() => deleteImage(image._id)">Delete</button>
        <button @click="() => (editingImage = { _id: image._id, categories: image.categories })">Edit Category</button>
      </div>
    </div>

    <!-- Edit Image Form -->
    <div v-if="editingImage" class="edit-image">
      <h2>Edit Image Category</h2>
      <input type="text" v-model="editingImage.categories" placeholder="Categories" />
      <button @click="updateImage">Save</button>
      <button @click="() => (editingImage = null)">Cancel</button>
    </div>
  </div>
</template>


<style lang="scss">
.image-gallery {
  max-width: 900px;
  margin: auto;
  font-family: Arial, sans-serif;
  background: #f4f4f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  h1 {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 20px;
  }

  .add-image, .edit-image {
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

    input {
      width: 100%;
      margin: 10px 0;
      padding: 10px;
      border-radius: 5px;
      border: 2px solid #2c3e50;
      transition: border-color 0.3s ease-in-out;
    }

    input:focus {
      border-color: #2c3e50;
      outline: none;
    }
  }

  .image-list {
    h2 {
      color: #2c3e50;
      margin-bottom: 15px;
    }

    .image-item {
      display: flex;
      align-items: center;
      padding: 15px;
      border-left: 5px solid #2c3e50;
      border-radius: 8px;
      margin-bottom: 15px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.02);
      }

      .image-preview {
        width: 100px;
        height: 100px;
        margin-right: 20px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
          border: 2px solid #2c3e50;
        }
      }

      .image-details {
        flex: 1;

        p {
          margin: 5px 0;
          color: #2c3e50;
        }
      }

      button {
        margin-left: 10px;
        padding: 8px 12px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.3s ease, transform 0.2s;

        &:first-of-type {
          background-color: #dc3545;
          color: white;
        }

        &:last-of-type {
          background-color: #2c3e50;
          color: white;
        }

        &:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }
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

    &.btn-danger {
      background: #dc3545;
      color: white;
    }

    &.btn-secondary {
      background: #6c757d;
      color: white;
    }

    &:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }
  }
}
</style>
