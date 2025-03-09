<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { IArticleDB, IArticle } from "@shared/crudTypes";
import { useI18n } from "vue-i18n";
import { Routes } from "@/enums";
import { useRouter } from "vue-router";

const { getArticles } = useApi();
const articles = ref<IArticleDB[]>([]);
const { t } = useI18n();
const router = useRouter();

onMounted(async () => {
  try {
    const response = await getArticles();
    articles.value = response ?? [];
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }
});

const formatDate = (dateInput?: string | number | Date): string => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
      .format(date)
      .replace(/\b\w/g, (char) => char.toUpperCase());
};

function goToArticle(article: IArticle) {
  if (!article?.slug) return;
  console.log("article:", article);
  router.push({ name: Routes.blog, params: { articleSlug: article.slug } });
}
</script>

<template>
  <div class="AllArticles">
    <div class="articles-grid">
      <div
          class="article-card"
          v-for="(article, index) in articles"
          :key="index"
          @click="goToArticle(article)"
      >
        <img
            class="article-image"
            :src="article.mainPicture?.thumbnail || '/Logo.jpeg'"
            alt="Event Image"
        />
        <div class="article-details">
          <div class="article-info">
            <div class="article-infosContent">
              <div class="date">{{ formatDate(article.date) }}</div>
            </div>
            <div class="article-infosContent">
              <div class="title">{{ article.title }}</div>
            </div>
          </div>
          <div class="readMore">
            <div class="readMoreContent">
              {{ t('articles.readMore') }}
            </div>
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
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.4rem;
  }

  .article-card {
    background-color: #fff;
    border-radius: 12px;
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
