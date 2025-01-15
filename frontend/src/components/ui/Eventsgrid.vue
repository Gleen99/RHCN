<script lang="tsx" setup>
import { ref, } from "vue";
import ISwapButton from "@/components/images/ISwapButton.vue";
import ISwapButtonWhite from "@/components/images/ISwapButtonWhite.vue";

const props = defineProps<{
  type: "eventsInfos" | "imagesInfos" |"partnerInfos" | "memeberInfos";
  isSelected: boolean;
  title: string;
  text: string;
  details: string;
}>();

const showDetails = ref(false);

const toggleDetails = (event: Event) => {
  event.stopPropagation();
  showDetails.value = !showDetails.value;
};
</script>

<template>
  <div :class="type" @click="$emit('select')">
    <div class="ButtonImages">
      <ISwapButtonWhite v-if="isSelected" />
      <ISwapButton v-else />
    </div>
    <div>
      <div class="title">
        {{ title }}
      </div>
      <div class="text">
        {{ text }}
      </div>
      <div v-if="!showDetails" class="details" @click="toggleDetails">
        {{ $t('events.cacheDetails') }}
      </div>
      <div v-if="showDetails" class="detailsContent" @click="toggleDetails">
        {{ details }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.eventsInfos, .imagesInfos, .partnerInfos, .memeberInfos {
  display: flex;
  gap: 30px;
  cursor: pointer;

  .ButtonImages {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    font-size: 18px;
    padding-bottom: 10px;
  }
  .text {
    font-size: 14px;
    padding-bottom: 10px;
  }
  .details {
    padding-bottom: 10px;
    font-weight: 500;
    text-decoration: underline;
  }
}
</style>
