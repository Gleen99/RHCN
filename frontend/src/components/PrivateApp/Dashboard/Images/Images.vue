<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composition/api";
import {IListImage, IListImageDB} from "@shared/crudTypes";
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
    const updatedImage = await UpdateListImage(editingImage.value._id, { categories: editingImage.value.categories });
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

  .add-image, .edit-image {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;

    input {
      display: block;
      width: 100%;
      margin: 10px 0;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      margin-top: 10px;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .image-list {
    .image-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #f9f9f9;

      .image-preview {
        width: 100px;
        height: 100px;
        margin-right: 20px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }
      }

      .image-details {
        flex: 1;
        p {
          margin: 5px 0;
        }
      }

      button {
        margin-left: 10px;
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:first-of-type {
          background-color: #dc3545;
          color: white;
        }

        &:last-of-type {
          background-color: #007bff;
          color: white;
        }
      }
    }
  }
}
</style>
