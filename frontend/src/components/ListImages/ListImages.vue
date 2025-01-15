<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useApi } from "@/composition/api";
import Filters from "@/components/Filters/Filters.vue";
import Pagination from "@/components/Filters/Pagination.vue";
import { useI18n } from "vue-i18n";
import PageTitle from "@/components/ui/PageTitle.vue";

const { t } = useI18n();
const { GetListImage, GetCategoriesByType } = useApi();

const categoriesList = ref<string[]>([]);
const selectedCategory = ref(t('events.filters.allCategories'));
const selectedDate = ref("");
const currentPage = ref(1);
const itemsPerPage = 9;
const selectedType = ref("Images");
const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchCategories = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const rawCategories = await GetCategoriesByType(selectedType.value);
    const categories = rawCategories.flatMap((item: any) =>
        typeof item.fr.category === "string"
            ? item.fr.category.split(",").map((cat: string) => cat.trim())
            : item.fr.category
    );
    categoriesList.value = [t('events.filters.allCategories'), ...categories]; // Ajout de la valeur par défaut
  } catch (err) {
    console.error("Error fetching categories:", err);
    error.value = t("events.filters.errorLoadingCategories");
  } finally {
    isLoading.value = false;
  }
};
const images = ref([]);
const fetchImages = async () => {
  try {
    const result = await GetListImage();
    images.value = Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

const filteredImages = computed(() => {
  let result = images.value;

  // Filtrer par catégorie
  if (selectedCategory.value && selectedCategory.value !== t('events.filters.allCategories')) {
    result = result.filter((event: any) =>
        event.categories.includes(selectedCategory.value)
    );
  }

  // Filtrer par date
  if (selectedDate.value) {
    const selectedDateObj = new Date(selectedDate.value);
    result = result.filter((event: any) => {
      const eventDateObj = new Date(event.date);
      return (
          eventDateObj.getFullYear() === selectedDateObj.getFullYear() &&
          eventDateObj.getMonth() === selectedDateObj.getMonth() &&
          eventDateObj.getDate() === selectedDateObj.getDate()
      );
    });
  }

  return result;
});

const paginatedImages = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredImages.value.slice(startIndex, startIndex + itemsPerPage);
});

const totalPages = computed(() =>
    Math.ceil(filteredImages.value.length / itemsPerPage)
);

const goToPage = (page: number) => {
  currentPage.value = page;
};

const updateSelectedCategory = (category: string) => {
  selectedCategory.value = category;
  currentPage.value = 1;
};

onMounted(() => {
  fetchCategories();
  fetchImages();
});
</script>

<template>
  <div class="listimages">
    <PageTitle type="icon" class="Title">
      {{ t('events.imagesContent.title') }}
    </PageTitle>
    <Filters
        :categories="categoriesList"
        :selectedCategory="selectedCategory"
        :selectedDate="selectedDate"
        @update:selectedCategory="updateSelectedCategory"
        @update:selectedDate="(value: any) => (selectedDate = value)"
    />

    <div v-if="isLoading" class="loading">{{ t('events.filters.loading') }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!isLoading && !error" class="image-grid">
      <div v-for="image in paginatedImages" :key="image.id" class="image-item">
        <div class="image-preview">
          <img :src="image.mainPicture.thumbnail || image.mainPicture.path" alt="Preview" />
        </div>
      </div>
    </div>

    <Pagination
        v-if="!isLoading && !error"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @changePage="goToPage"
    />
  </div>
</template>


<style lang="scss">
.listimages {
  .PageTitle{
    margin-bottom: 20px !important;
  }
  .title{
    font-size: 24px !important;
  }
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    width: 100%;
    max-width: 900px;

    .image-item {
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 5px;
      overflow: hidden;
      text-align: center;

      .image-preview {
        img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }
      }
    }
  }

  .loading {
    text-align: center;
    font-weight: bold;
    margin-top: 20px;
  }

  .error {
    color: red;
    text-align: center;
    font-weight: bold;
    margin-top: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    gap: 5px;

    button {
      padding: 5px 10px;
      border: 1px solid #ccc;
      background-color: #fff;
      cursor: pointer;

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    span {
      padding: 5px 10px;
      cursor: pointer;
      border: 1px solid #ccc;
      background-color: #fff;

      &.active {
        background-color: #007bff;
        color: white;
      }
    }
  }
}
</style>