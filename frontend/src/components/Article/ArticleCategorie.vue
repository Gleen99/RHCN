<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { ICategoryContent } from "@shared/crudTypes";

const { GetCategoryArticles } = useApi();
const categories = ref<ICategoryContent[]>([]);

onMounted(async () => {
  try {
    const response = await GetCategoryArticles();
    categories.value = response.categories?.map((cat) => ({
      category: Array.isArray(cat) ? cat : [cat]
    })) ?? [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
});
</script>

<template>
  <div class="ArticleCategorie">
    <div class="ListArticleCategorieContent" v-for="(category, index) in categories" :key="index">
      {{category}}
    </div>
  </div>
</template>

<style scoped lang="scss">
.ArticleCategorie {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 4rem 0 18rem 0;
  @include desktopMax {
    margin: 5rem 0 25rem 0;
  }
  .ListArticleCategorieContent {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid $cteal-dark;
    border-radius: 5px;
    padding: 10px;
    color: $cwhite;
    min-width: 120px;
    text-align: center;
  }
}
</style>