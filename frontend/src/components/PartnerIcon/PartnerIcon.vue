<script setup lang="ts">
import {useApi} from "@/composition/api";
import {onMounted, ref} from "vue";
import {IPartnerIconDB} from "@shared/crudTypes";
import PageTitle from "@/components/ui/PageTitle.vue";
import {useI18n} from "vue-i18n";

const { GetPartnerIcon } = useApi();
const {t} = useI18n();
const partenaires = ref<IPartnerIconDB[]>([]);
const visiblePartenaires = ref<IPartnerIconDB[]>([]);
const index = ref(0);
const maxVisible = 6;

async function fetchPartenaires() {
  try {
    const result = await GetPartnerIcon();
    if (result && typeof result === "object") {
      partenaires.value = Object.values(result);
      updateVisibleImages();
      startCarousel();
    } else {
      throw new Error("Réponse inattendue de l'API.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des icons partenaires :", error);
  }
}

function updateVisibleImages() {
  const total = partenaires.value.length;
  visiblePartenaires.value = [];
  for (let i = 0; i < maxVisible; i++) {
    visiblePartenaires.value.push(partenaires.value[(index.value + i) % total]);
  }
}

function startCarousel() {
  setInterval(() => {
    index.value = (index.value + 1) % partenaires.value.length;
    updateVisibleImages();
  }, 3000);
}

onMounted(() => {
  fetchPartenaires();
});
</script>

<template>
  <div class="partnerIcons">
    <div class="partnerIcons-content">
      <PageTitle class="page-title">
        {{ t('partnerIcon.title') }}
      </PageTitle>
      <div class="content-icons">
        <div v-for="partenaire in visiblePartenaires" :key="partenaire._id" class="partenaire-item">
          <div class="partenaires-infos">
            <img :src="partenaire.mainPicture?.thumbnail" alt="Partenaire" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.partnerIcons{
  background-color: $clight-gray;
  position: relative;
  right: 11.5%;
  bottom: 30rem;
  height: fit-content;
  width: 102.5vw;
  margin: 0;
  padding: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .page-title {
    text-align: center;
  }

  .content-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow: hidden;

    .partenaire-item {
      display: flex;
      justify-content: center;
      align-items: center;
      transition: opacity 0.5s ease-in-out;
    }

    .partenaires-infos {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 10vw;
        height: 20vh;
      }
    }
  }
}
</style>
