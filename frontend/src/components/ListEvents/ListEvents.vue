<script lang="ts" setup>
import {useApi} from "@/composition/api";
import {ref, computed, onMounted} from "vue";
import {IEventDB} from "@shared/crudTypes";
import Filters from "@/components/Filters/Filters.vue";
import Pagination from "@/components/Filters/Pagination.vue";
import {useI18n} from "vue-i18n";
import PageTitle from "@/components/ui/PageTitle.vue";
import IAgenda from "@/components/images/IAgenda.vue";
import ITime from "@/components/images/ITime.vue";
import ILocation from "@/components/images/ILocation.vue";
import IllusIconOpen from "@/components/images/IllusIconOpen.vue";


const {t} = useI18n();
const {getEvents, GetCategoriesByType} = useApi();

const eventList = ref<string[]>([]);
const selectedEvent = ref(t('events.filters.allCategories'));
const selectedDate = ref("");
const selectedType = ref("Evènements");
const currentPage = ref(1);
const itemsPerPage = 6;
const isLoading = ref(false);
const error = ref<string | null>(null);
const events = ref([]);
const fetchEvents = async () => {
  isLoading.value = true;
  try {
    events.value = await getEvents();
  } catch (err) {
    console.error("Error fetching events:", err);
    error.value = t("events.filters.errorLoadingEvents");
  } finally {
    isLoading.value = false;
  }
};

const fetchEventsCategories = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const rawEvents = await GetCategoriesByType(selectedType.value);
    const events = rawEvents.flatMap((item: any) =>
        typeof item.fr.category === "string"
            ? item.fr.category.split(",").map((cat: string) => cat.trim())
            : item.fr.category
    );
    eventList.value = [t('events.filters.allCategories'), ...events]; // Ajout de la valeur par défaut
  } catch (err) {
    console.error("Error fetching events:", err);
    error.value = t("events.filters.errorLoading");
  } finally {
    isLoading.value = false;
  }
};

const filteredEvents = computed(() => {
  let result = events.value;

  // Filtrer par catégorie
  if (selectedEvent.value && selectedEvent.value !== t('events.filters.allCategories')) {
    result = result.filter((event: any) =>
        event.categories.includes(selectedEvent.value)
    );
  }

  // Filtrer par date
  if (selectedDate.value) {
    const selectedDateObj = new Date(selectedDate.value);
    result = result.filter((event: any) => {
      const eventDateObj = new Date(event.date);
      return (
          eventDateObj.getFullYear() === selectedDateObj.getFullYear() &&
          eventDateObj.getMonth() === selectedDateObj.getMonth() &&
          eventDateObj.getDate() === selectedDateObj.getDate()
      );
    });
  }

  return result;
});


const paginatedEvents = computed<IEventDB[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredEvents.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredEvents.value.length / itemsPerPage));


const goToPage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);

  // Mettre la première lettre en majuscule
  return formattedDate
      .split(" ")
      .map((word, index) =>
          index === 0 || index === 2 // Mettre en majuscule le jour et le mois
              ? word.charAt(0).toUpperCase() + word.slice(1)
              : word
      )
      .join(" ");
};


onMounted(() => {
  fetchEvents();
  fetchEventsCategories();
});
</script>

<template>
  <div class="listEvents">
    <PageTitle class="Title" type="icon">
      {{ t('events.eventsContent.title') }}
    </PageTitle>
    <Filters
        :categories="eventList"
        :selectedCategory="selectedEvent"
        :selectedDate="selectedDate"
        @update:selectedCategory="(value: any) => (selectedEvent = value)"
        @update:selectedDate="(value: any) => (selectedDate = value)"
    />

    <div v-if="isLoading" class="loading">{{ t('events.filters.loading') }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!isLoading && !error" class="events-grid">
      <div v-for="event in paginatedEvents" :key="event._id" class="event-card">
        <img :src="event.mainPicture?.thumbnail || '/placeholder.png'" alt="Event Image" class="event-image"/>
        <div class="event-details">
          <h2 class="event-title">{{ event.title }}</h2>
          <div class="event-info">
            <div class="event-infosContent">
              <div class="icon">
                <IAgenda/>
              </div>
              <div class="infos">{{ formatDate(event.date) }}</div>
            </div>
            <div class="event-infosContent">
              <div class="icon">
                <ITime/>
              </div>
              <div class="infos">{{ event.time }}</div>
            </div>
            <div class="event-infosContent">
              <div class="icon">
                <ILocation/>
              </div>
              <div class="infos"> {{ event.address }}</div>
            </div>
          </div>
        </div>
        <div class="event-button">
          <div>
            <IllusIconOpen class="icon"/>
          </div>
          <div class="infos">{{ t('events.eventsInfos.seeMore') }}</div>
        </div>
      </div>
    </div>

    <Pagination
        v-if="!isLoading && !error"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @changePage="goToPage"
    />
  </div>
</template>

<style lang="scss">
.listEvents {
  cursor: pointer;

  .title {
    font-size: 24px !important;
    margin-bottom: 20px !important;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 74px;
    width: 100%;
    max-width: 900px;
  }

  .event-card {
    background-color: #fff;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 48px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .event-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }

    .event-details {
      padding: 15px 15px 0 15px ;

      .event-infosContent {
        display: flex;
        gap: 15px;
        align-items: center;

        &:not(:last-child) {
          padding-bottom: 15px;
        }


      .infos {
          font-size: 18px;
        }
      }

      .event-title {
        font-size: 20px;
        margin-bottom: 10px;
        padding-bottom: 10px;
        font-weight: 500;
        display: flex;
        justify-content: center;
        color: $cdeep-blue;
        border-bottom: 1px solid $csoft-light-gray;
      }


    }
    .event-button {
      display: flex;
      justify-content: center;
      gap:15px;
      align-items: center;
      padding:0 0 10px 0;

      .icon {
        width: 15px;
      }
      .infos{
        color: $cdeep-blue;
        font-size: 18px;
        font-weight: bold;
        font-family: $Roboto;
      }

      &:hover {
        transform: scale(1.1);
      }
    }
  }

}
</style>
