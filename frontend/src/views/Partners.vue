<script lang="ts" setup>
import PublicTemplate from "@/components/layout/PublicTemplate.vue";
import Eventsgrid from "@/components/ui/Eventsgrid.vue";
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import PartnerInfos from "@/components/Partners/PartnerInfos.vue";
import MemeberInfos from "@/components/Partners/MemeberInfos.vue";
import ListEvents from "@/components/ListEvents/ListEvents.vue";

const {t} = useI18n();
const selectedInfo = ref<"partnerInfos" | "membersInfos">("partnerInfos");

const toggleSelection = (info: "partnerInfos" | "membersInfos") => {
  selectedInfo.value = info;
};
</script>


<template>
  <public-template>
    <div class="partners">
      <div class="PartnersGrid">
        <Eventsgrid
            type="partnerInfos"
            :isSelected="selectedInfo === 'partnerInfos'"
            :title="t('partners.partnersInfos.title')"
            :text="t('partners.partnersInfos.text')"
            :details="t('partners.partnersInfos.details')"
            @select="() => toggleSelection('partnerInfos')"
        />
        <Eventsgrid
            type="memeberInfos"
            :isSelected="selectedInfo === 'membersInfos'"
            :title="t('partners.membersInfos.title')"
            :text="t('partners.membersInfos.text')"
            :details="t('partners.membersInfos.details')"
            @select="() => toggleSelection('membersInfos')"
        />
      </div>
      <div>
        <PartnerInfos v-if="selectedInfo === 'partnerInfos'" />
        <MemeberInfos v-else/>
      </div>
    </div>
  </public-template>
</template>

<style lang="scss">
.partners {
  height: 100%;
  overflow: auto;
  display: flex;
  gap: 10rem;
  .PartnersGrid {
    background-color: $clight-gray;
    padding: 40px;
    height: max-content;

    .eventsInfos {
      margin-bottom: 25px;
    }
  }
}
</style>