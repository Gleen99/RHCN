<script setup lang="ts">
import {ref, computed, onMounted} from "vue";
import {useApi} from "@/composition/api";
import {useRoute} from "vue-router";
import {IArticleDB} from "@shared/crudTypes";

const {getArticles} = useApi();
const route = useRoute();
const article = ref<IArticleDB | null>(null);

const slug = computed<string>(() => route.params.articleSlug as string);
const parsedContent = computed(() => {
  if (Array.isArray(article.value?.content)) {
    return article.value.content
        .map(block => block.text) // Prend seulement le texte HTML
        .join(' '); // Ajoute un espace pour éviter qu'ils se collent
  }
  return typeof article.value?.content === "string" ? article.value.content : "";
});

async function loadArticle() {
  try {
    const articles = await getArticles();
    article.value = Array.isArray(articles) ? articles.find((a) => a.slug === slug.value) || null : null;
  } catch (error) {
    console.error("Erreur lors du chargement de l'article :", error);
  }
}


onMounted(loadArticle);
</script>

<template>
  <div class="blog-article" v-if="article">
    <img
        class="article-image"
        :src="article.mainPicture?.thumbnail || '/Logo.jpeg'"
        alt="Event Image"
    />
    <div class="blog-article-infos">
      <div class="author">{{ article.author }}
      </div>
      <div class="title">{{ article.title }}</div>
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
