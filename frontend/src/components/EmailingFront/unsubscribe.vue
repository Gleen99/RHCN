<script setup lang="ts">
import PublicTemplate from "@/components/layout/PublicTemplate.vue"
import MainButton from "@/components/ui/MainButton.vue"
import router from "@/router"
import { Routes } from "@/enums"
import { useRoute } from "vue-router"
import { ref, onMounted } from "vue"
import axios from "axios"
import {useApi} from "@/composition/api";

const route = useRoute()
const success = ref(false)
const loading = ref(true)
const error = ref("")
const { unsubscribeNewsletter } = useApi();
const email = route.query.email?.toString()

async function unsubscribe() {
  if (!email) {
    error.value = "Aucune adresse email fournie."
    loading.value = false
    return
  }

  try {
    const res = unsubscribeNewsletter(email)
    success.value = true;
  } catch (err) {
    error.value = "Une erreur est survenue lors de la désinscription."
  } finally {
    loading.value = false
  }
}

function goToHome() {
  router.push({ name: Routes.home })
}

onMounted(unsubscribe)
</script>

<template>
  <PublicTemplate>
    <div class="unsubscribe-page history">
      <div class="unsubscribe-container">
        <h1 v-if="success">Désinscription réussie</h1>
        <h1 v-else-if="error">Erreur</h1>
        <p v-if="loading">Traitement en cours...</p>
        <p v-else-if="success">
          Vous avez bien été désinscrit(e) de notre infolettre. Merci d'avoir fait partie de la communauté du RHCN.
        </p>
        <p v-else-if="error" class="error">{{ error }}</p>

        <MainButton type="dimmed" @click="goToHome">
          Retour à l'accueil
        </MainButton>
      </div>
    </div>
  </PublicTemplate>
</template>

<style scoped lang="scss">
.unsubscribe-page {
  height: 100vh;
  background-color: $clight-gray;

  .unsubscribe-container {
    padding: 34px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h1 {
      font-size: 2.5rem;
      color: $cdark-blue-gray;
      margin-bottom: 16px;
    }

    p {
      font-size: 1.2rem;
      color: #333;
      margin-bottom: 24px;
      max-width: 600px;
      text-align: center;
    }

    .error {
      color: #e74c3c;
    }

    .MainButton {
      width: fit-content;
    }
  }
}
</style>