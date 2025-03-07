<script lang="ts" setup>
import PublicTemplate from "@/components/layout/PublicTemplate.vue";
import Eventsgrid from "@/components/ui/Eventsgrid.vue";
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import PartnerInfos from "@/components/Partners/PartnerInfos.vue";
import MemeberInfos from "@/components/Partners/MemeberInfos.vue";
import ListEvents from "@/components/ListEvents/ListEvents.vue";
import Donate from "@/components/Donate/Donate.vue";
import EmailingFront from "@/components/EmailingFront/EmailingFront.vue";

const {t} = useI18n();
const selectedInfo = ref<"partnerInfos" | "membersInfos">("partnerInfos");

const toggleSelection = (info: "partnerInfos" | "membersInfos") => {
  selectedInfo.value = info;
};
</script>


<template>
  <public-template>
    <div class="partners container history">
      <div class="PartnersGrid">
        <Eventsgrid
            class="partnerInfos"
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
        <PartnerInfos v-if="selectedInfo === 'partnerInfos'"/>
        <MemeberInfos v-else/>
      </div>
    </div>
    <Donate></Donate>
    <EmailingFront/>
  </public-template>
</template>

<style lang="scss">
.partners {
  height: 100%;
  display: flex;
  margin-bottom: 100px;

  .PartnersGrid {
    background-color: $clight-gray;
    padding: 40px;
    .partnerInfos{
      margin-bottom: 25px;

    }
  }
}
</style>