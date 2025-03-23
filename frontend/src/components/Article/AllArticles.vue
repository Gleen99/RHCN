<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useApi } from "@/composition/api";
import { IArticleDB } from "@shared/crudTypes";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { Routes } from "@/enums";

const props = defineProps<{ selectedCategory: string | null }>();

const { getArticles } = useApi();
const articles = ref<IArticleDB[]>([]);
const { locale, t } = useI18n();
const router = useRouter();

onMounted(async () => {
  try {
    const response = await getArticles();
    articles.value = Array.isArray(response) ? response : [response];
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }
});

const localizedArticle = (article: IArticleDB) =>
    locale.value === "en" ? article.en : article.fr;

const filteredArticles = computed(() => {
  if (!props.selectedCategory) return articles.value;
  return articles.value.filter((article) =>
      localizedArticle(article).categories.includes(props.selectedCategory!)
  );
});

function formatDate(dateInput?: string | number | Date): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat(locale.value, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
      .format(date)
      .replace(/\b\w/g, (c) => c.toUpperCase());
}

function goToArticle(article: IArticleDB) {
  const slug = localizedArticle(article).slug;
  if (!slug) return;
  router.push({ name: Routes.blog, params: { articleSlug: slug } });
}
</script>

<template>
  <div class="AllArticles">
    <div class="articles-grid">
      <div
          class="article-card"
          v-for="(article, index) in filteredArticles"
          :key="index"
          @click="goToArticle(article)"
      >
        <img
            class="article-image"
            :src="article.mainPicture?.thumbnail || '/Logo.jpeg'"
            alt="Image de l'article"
        />
        <div class="article-details">
          <div class="article-info">
            <div class="article-infosContent">
              <div class="date">{{ formatDate(article.date) }}</div>
            </div>
            <div class="article-infosContent">
              <div class="title">{{ localizedArticle(article).title }}</div>
            </div>
          </div>
          <div class="readMore">
            <div class="readMoreContent">{{ t("articles.readMore") }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.AllArticles {
  margin: -12rem 5.8rem 0 5.8rem;

  @include desktopMax {
    margin: -16rem 10rem 0 10rem;
  }

  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 30%);
    justify-content: space-between;
    gap: 1.4rem;

    @include desktopMax {
      grid-template-columns: repeat(auto-fill, 20%);
    }

    @include mobile {
      grid-template-columns: repeat(auto-fill, 100%);
      margin: 0 5rem;
    }
  }

  .article-card {
    background-color: #fff;
    border-radius: 29px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.3s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
    cursor: pointer;

    &:hover {
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .article-image {
      height: 24vh;
      object-fit: cover;
    }

    .article-details {
      padding: 16px;

      .article-info {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 1rem;

        .date {
          font-size: 18px;
          color: $cyellow;
        }

        .title {
          font-size: 20px;
          color: $cdeep-blue;
          display: flex;
          justify-content: center;
          text-align: center;
          padding: 10px;
        }

        .slug {
          font-size: 18px;
          padding-bottom: 10px;
        }
      }

      .readMore {
        width: fit-content;
        padding-top: 16px;

        .readMoreContent {
          font-size: 18px;
          color: $cyellow;
          border-bottom: 1px solid $cyellow;
        }
      }
    }
  }
}
</style>
