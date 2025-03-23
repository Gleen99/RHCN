<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { useI18n } from "vue-i18n";
import Filters from "@/components/Filters/Filters.vue";
import Pagination from "@/components/Filters/Pagination.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import { watch } from "vue";

const { t, locale } = useI18n();
const { GetListImage } = useApi();

// State
const categoriesList = ref<string[]>([t("events.filters.allCategories") || "All Categories"]);
const selectedCategory = ref(t("events.filters.allCategories") || "All Categories");
const selectedDate = ref("");
const selectedType = ref("Images");
const currentPage = ref(1);
const itemsPerPage = 9;
const isLoading = ref(false);
const error = ref<string | null>(null);
const images = ref<any[]>([]);


const fetchImages = async () => {
  isLoading.value = true;
  try {
    const result = await GetListImage();
    images.value = Array.isArray(result) ? result : [];
    generateCategoriesFromImages();
  } catch (err) {
    console.error("Error fetching images:", err);
    images.value = [];
    error.value = t("events.filters.errorLoadingImages");
  } finally {
    isLoading.value = false;
  }
};
const generateCategoriesFromImages = () => {
  const categoriesSet = new Set<string>();

  images.value.forEach((img: any) => {
    const raw = locale.value === "fr" ? img.fr?.categories : img.en?.categories;

    if (typeof raw === "string") {
      raw.split(",").forEach((cat) => {
        const trimmed = cat.trim();
        if (trimmed) categoriesSet.add(trimmed);
      });
    }
  });

  const uniqueSorted = Array.from(categoriesSet).sort();

  categoriesList.value = [
    t("events.filters.allCategories") || "All Categories",
    ...uniqueSorted
  ];
};
watch(locale, () => {
  generateCategoriesFromImages(); // 💡 ici aussi
  selectedCategory.value = t("events.filters.allCategories");
  currentPage.value = 1;
});
const filteredImages = computed(() => {
  let result = images.value || [];

  // Filtrage par catégorie
  if (
      selectedCategory.value &&
      selectedCategory.value !== t("events.filters.allCategories")
  ) {
    result = result.filter((image: any) => {
      const langCategories =
          locale.value === "fr" ? image.fr?.categories : image.en?.categories;

      const imageCategories =
          typeof langCategories === "string"
              ? langCategories.split(",").map((cat: string) => cat.trim())
              : [];

      return imageCategories.includes(selectedCategory.value);
    });
  }

  // Filtrage par date
  if (selectedDate.value) {
    const selectedDateObj = new Date(Number(selectedDate.value));
    const selectedDateStr = selectedDateObj.toLocaleDateString("fr-CA"); // "YYYY-MM-DD"
    result = result.filter((image: any) => {
      const imageDateObj = new Date(image.date);
      const imageDateStr = imageDateObj.toLocaleDateString("fr-CA");
      return imageDateStr === selectedDateStr;
    });
  }

  return result;
});
// Paginate images
const paginatedImages = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredImages.value.slice(startIndex, startIndex + itemsPerPage);
});

// Calculate total pages
const totalPages = computed(() => Math.ceil(filteredImages.value.length / itemsPerPage));

// Handle pagination
const goToPage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Update selected category
const updateSelectedCategory = (category: string) => {
  selectedCategory.value = category;
  currentPage.value = 1;
};

// On component mount
onMounted(() => {
  fetchImages();
});
</script>

<template>
  <div class="listImages">
    <PageTitle type="icon" class="Title">
      {{ t("events.imagesContent.title") }}
    </PageTitle>
    <Filters
        :categories="categoriesList.map(cat => ({ label: cat, value: cat }))"
        :selectedCategory="selectedCategory"
        :selectedDate="selectedDate"
        @update:selectedCategory="updateSelectedCategory"
        @update:selectedDate="(value: any) => (selectedDate = value)"
    />

    <div v-if="isLoading" class="loading">{{ t("events.filters.loading") }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!isLoading && !error && paginatedImages.length > 0" class="image-grid">
      <div v-for="image in paginatedImages" :key="image.id" class="image-item">
        <div class="image-preview">
          <img
              :src="image.mainPicture?.thumbnail || image.mainPicture?.path || '/Logo.jpeg'"
              alt="Preview"
          />
        </div>
      </div>
    </div>

    <div v-if="!isLoading && !error && paginatedImages.length === 0" class="no-images">
      {{ t("events.filters.noResults") }}
    </div>

    <Pagination v-if="!isLoading && !error" :currentPage="currentPage" :totalPages="totalPages" @changePage="goToPage" />
  </div>
</template>

<style lang="scss">
.listImages {
  .Title {
    font-size: 24px !important;
    @include mobile {
      padding-top: 15px;
    }
  }

  .image-grid {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: 0.2s linear;
    columns: 1rem 3;
    gap: 1.4rem;

    @include mobile {
      margin: 0 2rem;
      columns: 1 !important;
      gap: 1rem;
    }
  }

  .image-item {
    width: 100%; // S'assurer que chaque élément occupe toute la largeur
    break-inside: avoid; // Évite que les images se cassent sur plusieurs colonnes

    .image-preview {
      img {
        width: 100%;
        margin-bottom: 1rem;
        border-radius: 0.7rem;
        transition: transform 0.2s ease-in-out;

        &:hover {
          transform: scale(1.01);
        }
      }
    }
  }

  .loading, .error, .no-images {
    text-align: center;
    font-weight: bold;
    margin-top: 20px;
  }

  .error {
    color: red;
  }
}
</style>