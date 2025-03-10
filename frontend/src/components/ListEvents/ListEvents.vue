<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { useI18n } from "vue-i18n";
import Filters from "@/components/Filters/Filters.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import IAgenda from "@/components/images/IAgenda.vue";
import ITime from "@/components/images/ITime.vue";
import ILocation from "@/components/images/ILocation.vue";
import IllusIconOpen from "@/components/images/IllusIconOpen.vue";
import ModalEvent from "@/components/ListEvents/ModalEvent.vue";
import { IEventDB } from "@shared/crudTypes";

const { t } = useI18n();
const { getEvents } = useApi();

const eventList = ref<string[]>([]);
const selectedCategory = ref<string>(t("events.filters.allCategories") || "All Categories");
const selectedDate = ref<string>("");
const currentPage = ref<number>(1);
const itemsPerPage = 6;
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);
const isModalVisible = ref<boolean>(false);
const selectedEventDetails = ref<IEventDB | null>(null);
const events = ref<IEventDB[]>([]);

const openModal = (event: IEventDB) => {
  selectedEventDetails.value = event;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const fetchEvents = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getEvents();
    if (Array.isArray(response)) {
      events.value = response;
    } else {
      events.value = [];
      console.warn("Le retour de l'API n'est pas un tableau :", response);
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des événements :", err);
    error.value = "Impossible de récupérer les événements.";
  } finally {
    isLoading.value = false;
  }
};

const filteredEvents = computed(() => {
  let result = events.value;

  if (selectedCategory.value && selectedCategory.value !== t("events.filters.allCategories")) {
    result = result.filter(event =>
        event.categories.some(cat => typeof cat === "string" && cat === selectedCategory.value)
    );
  }
  return result;
});

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredEvents.value.slice(start, start + itemsPerPage);
});

const formatDate = (dateInput: string | number): string => {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
      .format(date)
      .split(" ")
      .map((word, index) =>
          index === 0 || index === 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join(" ");
};

onMounted(() => {
  fetchEvents();
});
</script>

<template>
  <div class="listEvents">
    <PageTitle class="Title" type="icon">
      {{ t("events.eventsContent.title") }}
    </PageTitle>

    <Filters
        :categories="eventList.map(cat => ({ label: cat, value: cat }))"
        :selectedCategory="selectedCategory"
        :selectedDate="selectedDate"
        @update:selectedCategory="value => (selectedCategory = value)"
        @update:selectedDate="value => (selectedDate = value ?? '')"
    />

    <div v-if="isLoading" class="loading-message">
      {{ t("events.loading") }}
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="paginatedEvents.length > 0" class="events-grid">
      <div v-for="event in paginatedEvents" :key="event._id" class="event-card" @click="openModal(event)">
        <img :src="event.mainPicture?.thumbnail || '/Logo.jpeg'" alt="Event Image" class="event-image" />
        <div class="event-details">
          <h2 class="event-title">{{ event.title }}</h2>
          <div class="event-info">
            <div class="event-infosContent">
              <div class="icon"><IAgenda /></div>
              <div class="infos">{{ formatDate(event.date) }}</div>
            </div>
            <div class="event-infosContent">
              <div class="icon"><ITime /></div>
              <div class="infos">{{ event.time }}</div>
            </div>
            <div class="event-infosContent">
              <div class="icon"><ILocation /></div>
              <div class="infos"> {{ event.address }}</div>
            </div>
          </div>
        </div>
        <div class="event-button">
          <div><IllusIconOpen class="icon" /></div>
          <div class="infos">{{ t("events.eventsInfos.seeMore") }}</div>
        </div>
      </div>
    </div>

    <div v-else class="no-events">
      {{ t("events.noEvents") }}
    </div>

    <ModalEvent :show="isModalVisible" :event="selectedEventDetails ?? {} as IEventDB" @close="closeModal" />
  </div>
</template>

<style lang="scss">
.listEvents {
  cursor: pointer;

  .Title {
    font-size: 24px !important;
    @include mobile {
      padding-top: 15px;
    }
  }

  .loading-message,
  .error-message,
  .no-events {
    text-align: center;
    font-size: 18px;
    margin-top: 20px;
    color: #777;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.4rem;
    @include mobile {
      margin: 0 5rem;
    }
  }

  .event-card {
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.3s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;

    &:hover {
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .event-image {
      height: 24vh;
    }

    .event-details {
      padding: 0 16px;

      .event-title {
        text-align: center;
        font-size: 20px;
        width: 100%;
        margin-bottom: 16px;
        border-bottom: 1px solid $csoft-light-gray;
        padding: 16px 0;
        color: $cdeep-blue;
      }

      .event-info {
        .event-infosContent {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 0 10px 0;
        }
      }
    }
  }

  .event-button {
    display: flex;
    justify-content: center;
    gap: 15px;
    align-items: center;
    font-weight: bold;

    .icon {
      width: 24px;
    }
  }
}
</style>