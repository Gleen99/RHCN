<script setup lang="ts">
import PublicTemplate from "@/components/layout/PublicTemplate.vue";
import { useI18n } from "vue-i18n";
import MainButton from "@/components/ui/MainButton.vue";
import router from "@/router";
import { Routes } from "@/enums";

const { t } = useI18n();

function goToHome() {
  router.push({ name: Routes.home });
}
</script>

<template>
  <public-template>
    <div class="privacy-policy history">
      <div class="privacy-container">
        <h1>{{ t('footer.privacyPolicy.title') }}</h1>
      <div class="content-columns">
        <p v-html="t('footer.privacyPolicy.content')"></p>
      </div>
        <MainButton type="dimmed" @click="goToHome">
          {{ t('global.buttons.returnHome') }}
        </MainButton>
    </div>
    </div>
  </public-template>
</template>

<style scoped lang="scss">
.privacy-policy {
  min-height: 100vh;
  background-color: $clight-gray;

  .privacy-container {
    padding: 40px;
    max-width: 800px;
    margin: auto;

    h1 {
      font-size: 3rem;
      font-family: $Roboto;
      color: $cdark-blue-gray;
      margin-bottom: 20px;
    }

    .content-columns {
      column-count: 2;
      column-gap: 30px;
      @include mobile {
        column-count: 0;
      }

      p {
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 30px;
      }
    }

    .MainButton {
      display: flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
    }
  }

  .PublicTemplate {
    .PublicFooter {
      margin-top: 0 !important;
    }
  }
}
</style>
