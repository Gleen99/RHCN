<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { IArticleDB } from "@shared/crudTypes";

const { getArticles } = useApi();
const route = useRoute();
const { locale } = useI18n();

const article = ref<IArticleDB | null>(null);

const slug = computed<string>(() => route.params.articleSlug as string);

// Récupère les données localisées dynamiquement
const localized = computed(() => {
  if (!article.value) return null;
  return locale.value === "en" ? article.value.en : article.value.fr;
});

const parsedContent = computed(() => {
  const content = localized.value?.content;
  if (Array.isArray(content)) {
    return content.map(block => block.text).join(" ");
  }
  return typeof content === "string" ? content : "";
});

async function loadArticle() {
  try {
    const articles = await getArticles();
    article.value = Array.isArray(articles)
        ? articles.find((a) =>
        locale.value === "en"
            ? a.en.slug === slug.value
            : a.fr.slug === slug.value
    ) || null
        : null;
  } catch (error) {
    console.error("Erreur lors du chargement de l'article :", error);
  }
}

onMounted(loadArticle);
</script>

<template>
  <div class="blog-article" v-if="article && localized">
    <img
        class="article-image"
        :src="article.mainPicture?.thumbnail || '/Logo.jpeg'"
        alt="Image de l'article"
    />
    <div class="blog-article-infos">
      <div class="author">{{ article.author }}</div>
      <div class="title">{{ localized.title }}</div>
    </div>
    <div class="content">
      <div class="article-content container" v-html="parsedContent"></div>
    </div>
  </div>
  <div v-else class="loading">Chargement de l'article...</div>
</template>

<style lang="scss">
.blog-article {
  .article-image {
    width: 100%;
    max-height: 70vh;
    object-fit: cover;
  }

  .blog-article-infos {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1rem;

    .author {
      font-size: 18px;
      color: $cyellow;
      margin: 1rem 0;
    }

    .title {
      font-size: 30px;
      color: $cdeep-blue;
      display: flex;
      justify-content: center;
      text-align: center;
      padding: 10px;
      width: 30%;

    }
  }

  .article-content {
    padding-top: 100px;
    margin: auto auto 23px auto;
    max-width: 1240px;
    width: calc(100% - 60px);
    column-count: 2;
    column-gap: 100px;
    column-fill: balance;
    color: $cdark-blue-gray;
    @include mobile {
      column-count: 1;
    }

    img {
      display: block;
      width: 100%;
      max-height: 600px;
      border-radius: 30px;
      overflow: hidden;
      object-fit: cover;
    }

    h1 {
      font-size: 32px;
      font-weight: bold;

    }

    h2 {
      font-size: 28px;
      font-weight: bold;
    }

    h3 {
      font-size: 24px;
      font-weight: bold;
    }

    p {
      font-size: 16px;
      margin-bottom: 1rem;
    }

    strong {
      font-weight: bold;
    }

    em {
      font-style: italic;
    }

    ul {
      list-style-type: disc;
      padding-left: 20px;
    }

    ol {
      list-style-type: decimal;
      padding-left: 20px;
    }

    li {
      margin-bottom: 5px;
    }

    a {
      color: $cdark-blue-gray;
      font-weight: bold;
      text-decoration: none;
    }
  }
}

.loading {
  text-align: center;
  font-size: 20px;
  margin-top: 50px;
}
</style>
