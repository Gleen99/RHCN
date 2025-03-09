<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useApi } from "@/composition/api";
import { useRoute } from "vue-router";
import { IArticleDB } from "@shared/crudTypes";

const { getArticles } = useApi();
const route = useRoute();
const article = ref<IArticleDB | null>(null);

const slug = computed<string>(() => route.params.articleSlug as string);

async function loadArticle() {
  try {
    const articles = await getArticles();
    article.value = articles.find((a: IArticleDB) => a.slug === slug.value) || null;
  } catch (error) {
    console.error("Erreur lors du chargement de l'article :", error);
  }
}



onMounted(loadArticle);
</script>

<template>
  <div class="blog-article" v-if="article" >
    <img
        class="article-image"
        :src="article.mainPicture?.thumbnail || '/Logo.jpeg'"
        alt="Event Image"
    />
    <div class="blog-article-infos">
      <div class="author">{{article.author}}
      </div>
      <div class="title">{{ article.title }}</div>
    </div>

    <div class="content">
      <div>
        {{ article.content }}
      </div>
    </div>
  </div>
  <div v-else class="loading">Chargement de l'article...</div>
</template>

<style scoped lang="scss">
.blog-article {

  .article-image {
    width: 100%;
    max-height: 70vh;
    object-fit: cover;

  }
  .blog-article-infos{
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    .author{
      font-size: 18px;
      color: $cyellow;
      margin: 1rem 0;
    }
    .title {
      font-size: 20px;
      color: $cdeep-blue;
      display: flex;
      justify-content: center;
      text-align: center;
      padding: 10px;
    }

  }

  .content {
    font-size: 18px;
    line-height: 1.6;
  }
}

.loading {
  text-align: center;
  font-size: 20px;
  margin-top: 50px;
}
</style>