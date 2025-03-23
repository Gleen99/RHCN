<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import ArticleCategorie from "@/components/Article/ArticleCategorie.vue";
import AllArticles from "@/components/Article/AllArticles.vue";

const { t } = useI18n();
const selectedCategory = ref<string | null>(null);

function handleCategorySelect(category: string) {
  selectedCategory.value = category;
}
</script>

<template>
  <div class="Listarticle">
    <div class="ListarticleHeader">
      <div class="ListarticleTitle">
        <PageTitle type="underline" class="title">
          {{ t("articles.title") }}
        </PageTitle>
      </div>
      <div class="ArticleCategorie">
        <ArticleCategorie @selectCategory="handleCategorySelect" />
      </div>
    </div>
    <AllArticles :selectedCategory="selectedCategory" />
  </div>
</template>

<style scoped lang="scss">
.Listarticle {
  height: 100%;
  display: flex;
  flex-direction: column;
  .ListarticleHeader {
    background-color: $cdark-blue-gray;
    padding-top: 15%;
    @include desktopMax {
      padding-top: 10%;
    }

    .ListarticleTitle {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>