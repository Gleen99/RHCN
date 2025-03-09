<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composition/api";
import PictureLoader from "@/components/ui/PictureLoader.vue";

import { IEvent, IEventDB } from "@shared/crudTypes";

const { createEvent, getEvents, deleteEvent, GetCategoriesByType } = useApi();

const events = ref<IEventDB[]>([]);
const newEvent = ref<IEvent>({
  title: "",
  date: Date.now(),
  time: Date.now(),
  address: "",
  description: "",
  price: "",
  categories: [],
  mainPicture: { path: "" },
});
const initializeDateTime = () => {
  const now = new Date();
  newEvent.value.date = now.getTime();
  newEvent.value.time = now.getTime();
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
    if (!Array.isArray(rawCategories)) {
      console.error("rawEvents n'est pas un tableau :", rawCategories);
      return;
    }
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
      const result = await getEvents();
      events.value = Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

const createNewEvent = async () => {
  try {
    newEvent.value.categories = selectedCategories.value.map((cat) => ({
      type: "event",
      en: { category: [cat] },
      fr: { category: [cat] },
    }));
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


const startEditing = (event: IEventDB) => {
  editingEvent.value = { ...event };
};


const resetNewEvent = () => {
  newEvent.value = {
    title: "",
    date: Date.now(),
    time: Date.now(),
    address: "",
    description: "",
    price: "",
    categories: [],
    mainPicture: { path: "" },
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
        <button @click="startEditing(event)">Edit</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.event-management {
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

  .add-event, .edit-event {
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
      border-radius: 5px;
      border: 2px solid #2c3e50;
      transition: border-color 0.3s ease-in-out;
    }

    input:focus, textarea:focus {
      border-color: #2c3e50;
      outline: none;
    }
  }

  .event-list {
    h2 {
      color: #2c3e50;
      margin-bottom: 15px;
    }

    .event-item {
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

      h3 {
        color: #2c3e50;
        margin-bottom: 5px;
      }

      p {
        color: #555;
        margin: 5px 0;
      }

      .image-preview {
        width: 100px;
        height: 100px;
        margin-top: 10px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
          border: 2px solid #2c3e50;
        }
      }

      button {
        margin-top: 10px;
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
