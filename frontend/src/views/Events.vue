<script lang="tsx" setup>
import { ref } from "vue";
import PublicTemplate from "@/components/layout/PublicTemplate.vue";
import ListImages from "@/components/ListImages/ListImages.vue";
import ListEvents from "@/components/ListEvents/ListEvents.vue";
import { useI18n } from "vue-i18n";
import Eventsgrid from "@/components/ui/Eventsgrid.vue";

const { t } = useI18n();
const selectedInfo = ref<"eventsInfos" | "imagesInfos">("eventsInfos");

const toggleSelection = (info: "eventsInfos" | "imagesInfos") => {
  selectedInfo.value = info;
};
</script>

<template>
  <PublicTemplate>
    <div class="Events">
      <div class="EventsGrid">
        <Eventsgrid
            type="eventsInfos"
            :isSelected="selectedInfo === 'eventsInfos'"
            :title="t('events.eventsInfos.title')"
            :text="t('events.eventsInfos.text')"
            :details="t('events.eventsInfos.details')"
            @select="() => toggleSelection('eventsInfos')"
        />
        <Eventsgrid
            type="imagesInfos"
            :isSelected="selectedInfo === 'imagesInfos'"
            :title="t('events.imagesInfos.title')"
            :text="t('events.imagesInfos.text')"
            :details="t('events.imagesInfos.details')"
            @select="() => toggleSelection('imagesInfos')"
        />
      </div>
      <div class="eventContent">
        <ListEvents v-if="selectedInfo === 'eventsInfos'" />
        <ListImages v-else />
      </div>
    </div>
  </PublicTemplate>
</template>

<style lang="scss">
.Events {
  height: 100%;
  display: flex;
  margin-bottom: 100px;

  .EventsGrid {
    background-color: $clight-gray;
    padding: 40px;
    height: max-content;
    .eventsInfos {
      margin-bottom: 25px;
    }
  }
}
</style>
