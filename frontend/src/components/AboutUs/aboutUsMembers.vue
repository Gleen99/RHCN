<script setup lang="ts">
import { useI18n } from "vue-i18n";
import PageTitle from "../ui/PageTitle.vue";
import { onMounted, ref } from "vue";
import { useApi } from "@/composition/api";
import { IMemberDB } from "@shared/crudTypes";
import IBGMember from "@/components/images/IBGMember.vue";

const { t } = useI18n();
const { getMembers } = useApi();
const members = ref<IMemberDB[]>([]);
const isLoading = ref(false);

const fetchMembers = async () => {
  isLoading.value = true;
  try {
    const response = await getMembers();
    members.value = Array.isArray(response) ? response : [];
  } catch (err) {
    console.error("Erreur lors de la récupération des members :", err);
    members.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMembers();
});
</script>

<template>
  <div class="aboutUsMembers container">
    <div class="aboutUsMembersContent">
      <PageTitle type="underline" class="title">
        {{ t('aboutUs.title') }}
      </PageTitle>
    </div>
    <div class="aboutUsMembersinfos">
      <div v-for="member in members" :key="member._id" class="event-item">
        <div class="image-preview">
          <img :src="member.picture?.thumbnail || member.picture?.path" alt="Preview" class="member-image" />
          <IBGMember class="ibg-member" />
        </div>
        <div class="info">
          <p class="title">{{ member.firstname }} {{ member.lastname }}</p>
          <p>{{ member.titre }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.aboutUsMembers {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;

  .aboutUsMembersContent {
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .aboutUsMembersinfos {
    display: grid;
    grid-template-columns: repeat(5, 1fr); // 5 colonnes par ligne
    gap: 23px;
    justify-content: center;

    @include mobile {
      grid-template-columns: repeat(2, 1fr); // 2 colonnes sur mobile
      gap: 15px;
    }

    .event-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .image-preview {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 150px;
        margin-bottom: 10px;

        @include mobile {
          width: 120px;
          height: 120px;
        }

        .ibg-member {
          width: 100%;
          height: 100%;
          border-radius: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          z-index: 0;
        }

        .member-image {
          width: 85%;
          height: 85%;
          border-radius: 50%;
          position: relative;
          z-index: 1;
          border: 10px solid $cyellow;

          @include mobile {
            border: 7px solid $cyellow;
          }
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #FFFFFF;
        border-radius: 20px;
        padding: 25% 10% 10% 10%;
        font-size: 18px;
        line-height: 1.5;
        width: 100%;
        height: 100%;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        text-align: center;
        margin-top: -25%;

        @include mobile {
          font-size: 14px;
          padding: 20% 8% 8% 8%;
          margin-top: -20%;
        }

        .title {
          color: $cyellow;
          font-weight: 600;
          font-size: 20px;
          font-family: $Arial;

          @include mobile {
            font-size: 16px;
          }
        }
      }
    }
  }
}

</style>
