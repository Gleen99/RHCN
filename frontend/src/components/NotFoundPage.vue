<script setup lang="ts">
// Aucun état nécessaire pour cette page 404
import PublicTemplate from "@/components/layout/PublicTemplate.vue";
import MainButton from "@/components/ui/MainButton.vue";
import router from "@/router";
import {Routes} from "@/enums";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
function goToHome() {
  router.push({ name: Routes.home});
}
</script>

<template>
<public-template>
  <div class="not-found history">
    <div class="container">
      <h1>404</h1>
      <p>{{ t('notFound') }}</p>
      <MainButton type="dimmed" @click="goToHome()">
        Retour à l'accueil
      </MainButton>
    </div>
  </div>
</public-template>
</template>

<style scoped lang="scss">
.not-found {
  height: 100vh;
  background-color: $clight-gray;
  .container{
    padding: 34px;
  }
  h1 {
    font-size: 5rem;
    font-family: $Roboto;
    color: $cdark-blue-gray;
  }

  p {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .MainButton {
    width: fit-content;
  }
  .PublicTemplate{
    .PublicFooter {
      margin-top: 0 !important;
    }
  }
}




</style>
