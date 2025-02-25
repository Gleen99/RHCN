<script setup lang="ts">
import Modal from "@/components/ui/Modal.vue";
import MainButton from "@/components/ui/MainButton.vue";
import {useI18n} from "vue-i18n";
import ITime from "@/components/images/ITime.vue";
import ILocation from "@/components/images/ILocation.vue";
import IAgenda from "@/components/images/IAgenda.vue";
import IDollars from "@/components/images/IDollars.vue";
import ILink from "@/components/images/ILink.vue";
import {IEventDB} from "@shared/crudTypes";

const {t} = useI18n();

const props = defineProps<{
  event: IEventDB;
  show: boolean;
}>();
const emit = defineEmits(['close']);


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
</script>

<template>
  <Modal v-if="props.show" :show="props.show" :title="props.event?.title || ''" :closeButton="true" @close="emit('close')">
    <template #default >
      <div class="ModalEvent">
        <div class="event-infos">
          <div class="event-infos-image">
            <img :src="props.event.mainPicture?.thumbnail || '/placeholder.png'" alt="Event Image" class="event-image"/>
          </div>
          <div v-if="props.event" class="event-details">
            <div class="event-info">
              <h2 class="event-title">{{ props.event.title }}</h2>
              <div class="event-infosContent">
                <div class="icon">
                  <IAgenda/>
                </div>
                <div class="infos">{{ formatDate(props.event.date) }}</div>
              </div>
              <div class="event-infosContent">
                <div class="icon">
                  <ITime/>
                </div>
                <div class="infos">{{ props.event.time }}</div>
              </div>
              <div class="event-infosContent">
                <div class="icon">
                  <ILocation/>
                </div>
                <div class="infos">{{ props.event.address }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="more-infos">
          <div class="more-infos-content description">
            <div  class="infos">{{ props.event.description }}</div>
          </div>
          <div class="more-infos-content">
            <div  class="infos">
              <IDollars />
              <div>
                {{t("modal.modalEvent.price")}}
                <span class="price">{{ props.event.price }}$</span>
              </div>
             </div>
            <div  class="infos">
              <ILink />
              <span class="link">{{t('modal.modalEvent.link')}}</span>
              </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <MainButton type="standard" @click="emit('close')">{{ t("modal.modalDonate.cancel") }}</MainButton>
    </template>
  </Modal>
</template>

<style scoped lang="scss">
.ModalEvent{
  .event-infos{
    display: flex;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    .event-infos-image{
      .event-image{
        width: 10vw;
        height: 10vw;
        border-bottom-left-radius: 12px;
        border-top-left-radius: 12px;
      }
    }
  }

  .event-details {
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: $Arial;
    .event-title {
      font-size: 20px;
      margin-bottom: 1rem;
    }
    .event-infosContent {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 4px 0;
      font-size: 14px;
      color: #00353D;
    }
    .event-infosContent > *:last-child {
      padding: 0;
    }

  }
  .more-infos{
    margin-top: 16px;
    background-color: $clight-gray;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 16px;
    width: 80vh;
    height: auto;
    color: #00353D;
    font-size: 14px;
    .more-infos-content{
      margin-top:3%;
    }
    .infos{
      display: flex;
      gap: 1.5rem;

      .price, .link{
       font-weight: bold;
      }
    }
  }
}

</style>
