<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useApi } from "@/composition/api";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["selectCategory"]);
const { GetCategoryArticles } = useApi();
const { locale } = useI18n();

const rawCategories = ref<{ fr: string[]; en: string[] }[]>([]);

// Catégories en fonction de la langue, avec "Tous"/"All" en tête
const categories = computed(() => {
  const lang = locale.value;
  const all = rawCategories.value.flatMap((c) => c[lang] || []);
  const unique = Array.from(new Set(all));
  return [lang === "fr" ? "Tous les catégories" : "All categories", ...unique];
});

onMounted(async () => {
  try {
    const response = await GetCategoryArticles();
    rawCategories.value = Array.isArray(response.categories)
        ? response.categories.map((cat) => ({
          fr: Array.isArray(cat.fr) ? cat.fr : [],
          en: Array.isArray(cat.en) ? cat.en : [],
        }))
        : [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
});
function select(cat: string) {
  emit("selectCategory", cat === "All categories" || cat === "Tous les catégories" ? null : cat);
}
</script>

<template>
  <div class="ArticleCategorie">
    <div
        class="ListArticleCategorieContent"
        v-for="(category, index) in categories"
        :key="index"
        @click="select(category)"
    >
      {{ category }}
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
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>