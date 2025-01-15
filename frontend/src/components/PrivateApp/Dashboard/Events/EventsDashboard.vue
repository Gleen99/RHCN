<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composition/api";
import PictureLoader from "@/components/ui/PictureLoader.vue";

import { IEvent, IEventDB } from "@shared/crudTypes";

const { createEvent, getEvents, deleteEvent, updateEvent, GetCategoriesByType } = useApi();

const events = ref<IEventDB[]>([]);
const newEvent = ref<IEvent>({
  title: "",
  date: "",
  time: "",
  address: "",
  description: "",
  price: "",
  categories: [],
  mainPicture: null,
});
const initializeDateTime = () => {
  const now = new Date();
  newEvent.value.date = now.toISOString().slice(0, 10);
  newEvent.value.time = now.toTimeString().slice(0, 5);
};

const editingEvent = ref<IEventDB | null>(null);

const selectedCategories = ref<string[]>([]);
const categoriesList = ref<string[]>([]);
const selectedType = ref("Evènements");

const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchCategories = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const rawCategories = await GetCategoriesByType(selectedType.value);
    categoriesList.value = rawCategories.flatMap((item: any) =>
        typeof item.fr.category === "string"
            ? item.fr.category.split(",").map((cat: string) => cat.trim())
            : item.fr.category
    );
  } catch (err) {
    console.error("Error fetching categories:", err);
    error.value = "Failed to load categories. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const fetchEvents = async () => {
  try {
    events.value = await getEvents();
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

const createNewEvent = async () => {
  try {
    newEvent.value.categories = selectedCategories.value;
    const createdEvent = await createEvent(newEvent.value);
    events.value.push(createdEvent);
    resetNewEvent();
  } catch (error) {
    console.error("Error creating event:", error);
  }
};

const deleteExistingEvent = async (id: string) => {
  try {
    await deleteEvent(id);
    events.value = events.value.filter(event => event._id !== id);
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

const updateExistingEvent = async () => {
  try {
    if (editingEvent.value) {
      const updatedEvent = await updateEvent(editingEvent.value._id, editingEvent.value);
      const index = events.value.findIndex(event => event._id === editingEvent.value._id);
      if (index !== -1) {
        events.value[index] = updatedEvent;
      }
      editingEvent.value = null;
    }
  } catch (error) {
    console.error("Error updating event:", error);
  }
};

const resetNewEvent = () => {
  newEvent.value = {
    title: "",
    date: "",
    time: "",
    address: "",
    description: "",
    price: "",
    categories: [],
    mainPicture: null,
  };
  initializeDateTime();
  selectedCategories.value = [];
};

onMounted(() => {
  fetchEvents();
  fetchCategories();
  initializeDateTime();
});
</script>

<template>
  <div class="event-management">
    <h1>Event Management</h1>

    <div class="add-event">
      <h2>Add New Event</h2>
      <input type="text" v-model="newEvent.title" placeholder="Title" />
      <input type="date" v-model="newEvent.date" placeholder="Date" />
      <input type="time" v-model="newEvent.time" placeholder="Time" />
      <input type="text" v-model="newEvent.address" placeholder="Address" />
      <textarea v-model="newEvent.description" placeholder="Description"></textarea>
      <input type="text" v-model="newEvent.price" placeholder="Price" />

      <h3>Categories (Evènements)</h3>
      <p v-if="isLoading">Loading categories...</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <div v-else>
        <p>Select categories:</p>
        <div v-for="category in categoriesList" :key="category">
          <label>
            <input
                type="checkbox"
                :value="category"
                v-model="selectedCategories"
            />
            {{ category }}
          </label>
        </div>
      </div>
      <p>Selected Categories: {{ selectedCategories.join(", ") }}</p>
      <picture-loader
          :value="newEvent.mainPicture"
          @onChange="(fileData : any) => (newEvent.mainPicture = fileData)"
      />

      <button @click="createNewEvent">Add Event</button>
    </div>

    <div class="event-list">
      <h2>Event List</h2>
      <div v-for="event in events" :key="event._id" class="event-item">
        <h3>{{ event.title }}</h3>
        <p><strong>Date:</strong> {{ event.date }}</p>
        <p><strong>Time:</strong> {{ event.time }}</p>
        <p><strong>Address:</strong> {{ event.address }}</p>
        <p><strong>Description:</strong> {{ event.description }}</p>
        <p><strong>Price:</strong> {{ event.price }}</p>
        <p><strong>Categories:</strong> {{ event.categories.join(", ") }}</p>
        <div class="image-preview">
          <img :src="event.mainPicture?.thumbnail || event.mainPicture?.path" alt="Preview" />
        </div>
        <button @click="() => deleteExistingEvent(event._id)">Delete</button>
        <button @click="() => (editingEvent.value = { ...event })">Edit</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.event-management {
  max-width: 900px;
  margin: auto;
  font-family: Arial, sans-serif;

  .add-event,
  .edit-event {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;

    input,
    textarea {
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

  .event-list {
    .event-item {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #f9f9f9;
      margin-bottom: 10px;

      button {
        margin-right: 10px;
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
