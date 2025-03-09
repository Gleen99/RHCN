
<script setup lang="ts">
import {useApi} from "@/composition/api";
import {onMounted, ref, computed} from "vue";
import {IPartnerIconDB} from "@shared/crudTypes";
import PageTitle from "@/components/ui/PageTitle.vue";
import {useI18n} from "vue-i18n";

const { GetPartnerIcon } = useApi();
const {t} = useI18n();
const partenaires = ref<IPartnerIconDB[]>([]);
const visiblePartenaires = ref<IPartnerIconDB[]>([]);
const index = ref(0);
const maxVisible = ref(6);

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

const updateVisibleImages = () => {
  const total = partenaires.value.length;
  const visibleCount = window.innerWidth <= 768 ? 3 : maxVisible.value; // 3 en mobile, 6 sinon
  visiblePartenaires.value = [];
  for (let i = 0; i < visibleCount; i++) {
    visiblePartenaires.value.push(partenaires.value[(index.value + i) % total]);
  }
};

const startCarousel = () => {
  setInterval(() => {
    index.value = (index.value + 1) % partenaires.value.length;
    updateVisibleImages();
  }, 3000);
};

onMounted(() => {
  fetchPartenaires();
  window.addEventListener('resize', updateVisibleImages);
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
  height: fit-content;
  margin: 0;
  padding: 2% 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .page-title {
    text-align: center;
    .title{
      @include mobile {
        display: block;
      }
    }
  }

  .content-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow: hidden;

    @include mobile {
      gap: 15px;
      overflow: hidden;
    }

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

        @include mobile {
          width: 50vw;
          height: auto;
        }
      }
    }
  }
}

</style>
