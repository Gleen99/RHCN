<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composition/api";
import PictureLoader from "@/components/ui/PictureLoader.vue";
import { IEvent, IEventDB } from "@shared/crudTypes";

const { createEvent, getEvents, deleteEvent, updateEvent, GetCategoriesByType } = useApi();

const events = ref<IEventDB[]>([]);
const newEvent = ref<IEvent>({
  en: { title: "", description: "", categories: [] },
  fr: { title: "", description: "", categories: [] },
  date: Date.now(),
  time: Date.now(),
  address: "",
  price: "",
  mainPicture: { path: "" },
});

const categoryInput = ref<{ fr: string; en: string }>({ fr: "", en: "" });

const isEditing = ref(false);
const editingId = ref<string | null>(null);

const selectedType = ref("Evènements");
const categoriesList = ref<string[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const initializeDateTime = () => {
  const now = new Date();
  newEvent.value.date = now.getTime();
  newEvent.value.time = now.getTime();
};

const fetchCategories = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const rawCategories = await GetCategoriesByType(selectedType.value);
    if (!Array.isArray(rawCategories)) return;

    categoriesList.value = rawCategories.flatMap((item: any) => {
      if (item?.fr && item?.en) {
        return [
          ...(Array.isArray(item.fr.category) ? item.fr.category : [item.fr.category]),
          ...(Array.isArray(item.en.category) ? item.en.category : [item.en.category]),
        ].map((cat: string) => cat.trim());
      }
      return [];
    });
  } catch (err) {
    error.value = "Failed to load categories.";
    console.error(err);
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

const saveEvent = async () => {
  try {
    newEvent.value.fr.categories = categoryInput.value.fr.split(",").map(c => c.trim());
    newEvent.value.en.categories = categoryInput.value.en.split(",").map(c => c.trim());

    if (isEditing.value && editingId.value) {
      await updateEvent(newEvent.value, editingId.value);
      const idx = events.value.findIndex(e => e._id === editingId.value);
      if (idx !== -1) {
        events.value[idx] = { _id: editingId.value, ...newEvent.value } as IEventDB;
      }
    } else {
      const created = await createEvent(newEvent.value);
      events.value.push(created);
    }

    resetNewEvent();
  } catch (err) {
    console.error("Error saving event:", err);
  }
};

const startEditing = (event: IEventDB) => {
  newEvent.value = {
    en: { ...event.en },
    fr: { ...event.fr },
    date: event.date,
    time: event.time,
    address: event.address,
    price: event.price,
    mainPicture: {
      path: event.mainPicture?.path ?? "",
      thumbnail: event.mainPicture?.thumbnail,
      mimetype: event.mainPicture?.mimetype,
    },
  };
  categoryInput.value = {
    fr: event.fr.categories.join(", "),
    en: event.en.categories.join(", ")
  };
  isEditing.value = true;
  editingId.value = event._id;
};

const resetNewEvent = () => {
  newEvent.value = {
    en: { title: "", description: "", categories: [] },
    fr: { title: "", description: "", categories: [] },
    date: Date.now(),
    time: Date.now(),
    address: "",
    price: "",
    mainPicture: { path: "" },
  };
  categoryInput.value = { fr: "", en: "" };
  isEditing.value = false;
  editingId.value = null;
  initializeDateTime();
};

const deleteExistingEvent = async (id: string) => {
  try {
    await deleteEvent(id);
    events.value = events.value.filter(event => event._id !== id);
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

onMounted(() => {
  fetchEvents();
  fetchCategories();
  initializeDateTime();
});
</script>

<template>
  <div class="event-management">
    <h1>{{ isEditing ? 'Modifier un événement' : 'Créer un événement' }}</h1>
    <div class="add-event">
      <div class="add-event-container">
        <div>
          <label>Title FR</label>
          <input v-model="newEvent.fr.title" placeholder="Titre (français)" />
        </div>
        <div>
          <label>Title EN</label>
          <input v-model="newEvent.en.title" placeholder="Title (english)" />
        </div>
      </div>

      <div class="add-event-container">
        <div>
          <label>Date</label>
          <input type="date" :value="new Date(newEvent.date).toISOString().substring(0, 10)" @input="e => newEvent.date = new Date((e.target as HTMLInputElement).value).getTime()" />
        </div>
        <div>
          <label>Heure</label>
          <input type="time" :value="new Date(newEvent.time).toTimeString().substring(0,5)" @input="e => newEvent.time = new Date('1970-01-01T' + (e.target as HTMLInputElement).value).getTime()" />
        </div>
      </div>

      <div class="add-event-container">
        <div>
          <label>Description FR</label>
          <textarea v-model="newEvent.fr.description"></textarea>
        </div>
        <div>
          <label>Description EN</label>
          <textarea v-model="newEvent.en.description"></textarea>
        </div>
      </div>

      <div class="add-event-container">
        <div>
          <label>Catégories FR</label>
          <input v-model="categoryInput.fr" placeholder="Catégories FR, séparées par virgules" />
        </div>
        <div>
          <label>Catégories EN</label>
          <input v-model="categoryInput.en" placeholder="Categories EN, comma-separated" />
        </div>
      </div>

      <div class="add-event-container">
        <div><label>Adresse</label><input v-model="newEvent.address" /></div>
        <div><label>Prix</label><input v-model="newEvent.price" /></div>
      </div>

      <div class="add-event-container">
        <div>
          <label>Image</label>
          <picture-loader :value="newEvent.mainPicture" @onChange="(fileData) => (newEvent.mainPicture = fileData)" />
        </div>
      </div>

      <div class="form-actions">
        <button @click="saveEvent">{{ isEditing ? "Modifier l'événement" : "Ajouter l'événement" }}</button>
        <button v-if="isEditing" @click="resetNewEvent" class="btn-secondary">Annuler</button>
      </div>
    </div>

    <div class="event-list">
      <h1>Liste des événements</h1>
      <div v-for="event in events" :key="event._id" class="event-item">
        <div class="event-item-content">
          <div class="image-preview">
            <img :src="event.mainPicture?.thumbnail || event.mainPicture?.path" alt="Preview" />
          </div>
          <div class="info">
            <p><strong>Titre (FR):</strong> {{ event.fr.title }}</p>
            <p><strong>Titre (EN):</strong> {{ event.en.title }}</p>
            <p><strong>Date:</strong> {{ new Date(event.date).toLocaleDateString() }}</p>
            <p><strong>Heure:</strong> {{ new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
            <p><strong>Adresse:</strong> {{ event.address }}</p>
            <p><strong>Description (FR):</strong> {{ event.fr.description }}</p>
            <p><strong>Description (EN):</strong> {{ event.en.description }}</p>
            <p><strong>Prix:</strong> {{ event.price }}</p>
            <p><strong>Catégories (FR):</strong> {{ event.fr.categories.join(", ") }}</p>
            <p><strong>Catégories (EN):</strong> {{ event.en.categories.join(", ") }}</p>
          </div>
        </div>

        <div class="event-info-buttons">
          <button @click="() => deleteExistingEvent(event._id)">Delete</button>
          <button @click="startEditing(event)">Edit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.event-management {
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px white;

  .add-event-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 23px;
    div{
      flex: 1;
    }
  }
  .add-event, .edit-event {
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    box-shadow: 0 2px 5px white;

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
      font-family: $Arial;
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
      .event-item-content{
        display: flex;
        align-items: center;
        gap: 25px;

        p {
          color: #2c3e50;
          margin: 5px 0;
          line-height: 17px;

          strong{
            font-weight: bold;
          }
        }

        .image-preview {
          width: 10vw;
          margin-top: 10px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;

          }
        }
        .info{
          flex:1;
        }
      }

    }
  }

  .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  .event-info-buttons{
    margin-top: 10px;
    display: flex;
    gap: 23px;
    justify-content: center;
  }
  button {
    width: fit-content;
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
</style>