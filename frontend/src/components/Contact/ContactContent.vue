<script setup lang="ts">
import IFacebook from '../images/IFacebook.vue';
import IInstagram from '../images/IInstagram.vue';
import ILinkedlin from '../images/ILinkedlin.vue';
import ITwitter from '../images/ITwitter.vue';
import {useI18n} from "vue-i18n";
const {t} = useI18n();

const socialNetworks = [
  {key: "facebook", url: t('footer.socialNetwork.facebook'), component: IFacebook},
  {key: "twitter", url: t('footer.socialNetwork.twitter'), component: ITwitter},
  {key: "instagram", url: t('footer.socialNetwork.instagram'), component: ILinkedlin},
  {key: "linkedin", url: t('footer.socialNetwork.linkedin'), component: IInstagram}
];

</script>

<template>
  <div class="ContactContent">
    <div class="infos">
      3 avenue de la Révolution
      <div>33000 Bordeaux</div>
      <div>France</div>
    </div>
    <div class="infos">
      06 00 00 00 00
    </div>
    <div class="infos">info@rhcn.ca</div>
    <div class="RSLink">
      <div class="title">Retrouvez-nous sur les réseaux sociaux :</div>
      <div class="Icon">
        <a v-for="network  in socialNetworks" :key="network.key" :href="network.url" class="toggle-icon"><component :is="network.component"/></a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ContactContent {
  background-color: $clight-gray;
  padding: 40px;
  height: max-content;

  .infos,
  .title {
    padding-bottom: 14px;
    margin: 14px;
    font-size: 18px;
    font-family: $Arial;
    line-height: 1.5;
  }

  .infos {
    border-bottom: 1px solid $clight-gray2;
  }

  .Icon {
    display: flex;
    gap: 10px;

    .toggle-icon {
      width: 52px;
      height: 30px;
      flex-shrink: 0;
      cursor: pointer;
      transition: transform 0.3s;
       svg {
        width: 100%;
        height: 100%;
      }

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
