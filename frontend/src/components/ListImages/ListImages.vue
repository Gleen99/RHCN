<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { useI18n } from "vue-i18n";
import Filters from "@/components/Filters/Filters.vue";
import Pagination from "@/components/Filters/Pagination.vue";
import PageTitle from "@/components/ui/PageTitle.vue";

const { t } = useI18n();
const { GetListImage, GetCategoriesByType } = useApi();

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

// Fetch categories
const fetchCategories = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const rawCategories = await GetCategoriesByType(selectedType.value);
    if (!Array.isArray(rawCategories)) {
      console.error("Error: rawCategories is not an array", rawCategories);
      return;
    }
    const categories = rawCategories.flatMap((item: any) =>
        typeof item.fr.category === "string"
            ? item.fr.category.split(",").map((cat: string) => cat.trim())
            : item.fr.category
    );
    categoriesList.value = [t("events.filters.allCategories"), ...categories];
  } catch (err) {
    console.error("Error fetching categories:", err);
    error.value = t("events.filters.errorLoadingCategories");
  } finally {
    isLoading.value = false;
  }
};

// Fetch images
const fetchImages = async () => {
  isLoading.value = true;
  try {
    const result = await GetListImage();
    images.value = Array.isArray(result) ? result : [];
  } catch (err) {
    console.error("Error fetching images:", err);
    images.value = [];
    error.value = t("events.filters.errorLoadingImages");
  } finally {
    isLoading.value = false;
  }
};

// Filter images
const filteredImages = computed(() => {
  let result = images.value || [];

  // Filter by category
  if (selectedCategory.value && selectedCategory.value !== t("events.filters.allCategories")) {
    result = result.filter((image: any) =>
        Array.isArray(image.categories) && image.categories.includes(selectedCategory.value)
    );
  }

  // Filter by date
  if (selectedDate.value) {
    const selectedDateObj = new Date(selectedDate.value);
    result = result.filter((image: any) => {
      const imageDateObj = new Date(image.date);
      return (
          imageDateObj.getFullYear() === selectedDateObj.getFullYear() &&
          imageDateObj.getMonth() === selectedDateObj.getMonth() &&
          imageDateObj.getDate() === selectedDateObj.getDate()
      );
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
  fetchCategories();
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
              :src="image.mainPicture?.thumbnail || image.mainPicture?.path || '/placeholder.png'"
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
    margin-bottom: 20px !important;

  }
  .image-grid {
    margin:0;
    padding: 0;
    box-sizing: border-box;
    transition: 0.2s linear;
    columns: 1rem 3;
    gap:1.4rem;

  }

  .image-item {
    .image-preview {
      img {
        width: 100%;
        margin-bottom: 1rem;
        border-radius: 0.7rem;
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