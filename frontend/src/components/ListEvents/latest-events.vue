<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { useI18n } from "vue-i18n";
import IAgenda from "@/components/images/IAgenda.vue";
import ITime from "@/components/images/ITime.vue";
import ILocation from "@/components/images/ILocation.vue";
import IllusIconOpen from "@/components/images/IllusIconOpen.vue";
import ModalEvent from "@/components/ListEvents/ModalEvent.vue";
import { useRouter } from "vue-router";
import { IEventDB } from "@shared/crudTypes";
import PageTitle from "@/components/ui/PageTitle.vue";

const { t } = useI18n();
const { getEvents } = useApi();
const router = useRouter();

const isLoading = ref(false);
const events = ref<IEventDB[]>([]);
const isModalVisible = ref(false);
const selectedEventDetails = ref<IEventDB | null>(null);

const openModal = async (event: IEventDB) => {
  selectedEventDetails.value = event;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const fetchEvents = async () => {
  isLoading.value = true;
  try {
    const response = await getEvents();
    events.value = Array.isArray(response) ? response.slice(-5).reverse() : [];
  } catch (err) {
    console.error("Erreur lors de la récupération des événements :", err);
    events.value = [];
  } finally {
    isLoading.value = false;
  }
};

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
  <div class="latest-events">
    <PageTitle class="page-title">
      {{ t("events.latestEvents.title") }}
    </PageTitle>
    <div v-if="!isLoading && events.length > 0" class="events-grid">
      <div v-for="event in events" :key="event._id" class="event-card" @click="openModal(event)">
        <img :src="event.mainPicture?.thumbnail || '/placeholder.png'" alt="Event Image" class="event-image" />
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
              <div class="infos">{{ event.address }}</div>
            </div>
          </div>
        </div>
        <div class="event-button">
          <div><IllusIconOpen class="icon" /></div>
          <div class="infos">{{ t("events.eventsInfos.seeMore") }}</div>
        </div>
      </div>
    </div>

    <div v-if="events.length > 0" class="view-more-container">
      <button @click="router.push('/events')" class="view-more-button">
        {{ t("events.latestEvents.viewMore") }}
      </button>
    </div>

    <ModalEvent :show="isModalVisible" :event="selectedEventDetails ?? {} as IEventDB" @close="closeModal" />
  </div>
</template>

<style lang="scss">
.latest-events {
  padding: 0 90px;
  text-align: center;

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.4rem;
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
    cursor: pointer;

    .event-image {
      height: 24vh;
      object-fit: cover;
    }

    .event-details {
      padding: 16px;

      .event-title {
        font-size: 20px;
        text-align: center;
        margin-bottom: 16px;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 10px;
        color: #1d3557;
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

  .view-more-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;

    .view-more-button {
      background-color: #1d3557;
      color: white;
      padding: 12px 24px;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      transition: background 0.3s;

      &:hover {
        background-color: #457b9d;
      }
    }
  }
}
</style>