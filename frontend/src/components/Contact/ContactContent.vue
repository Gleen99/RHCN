<script setup lang="ts">
import IFacebook from '../images/IFacebook.vue';
import IInstagram from '../images/IInstagram.vue';
import ILinkedlin from '../images/ILinkedlin.vue';
import ITwitter from '../images/ITwitter.vue';
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
        <ITwitter class="toggle-icon" />
        <ILinkedlin class="toggle-icon" />
        <IInstagram class="toggle-icon" />
        <IFacebook class="toggle-icon" />

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

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
