<script setup lang="ts">
import {useI18n} from "vue-i18n";
import MainButton from "@/components/ui/MainButton.vue";
import PageTitle from "@/components/ui/PageTitle.vue";

const {t} = useI18n()
</script>

<template>
  <div class="join-us">
    <div class="join-us-wrapper">
      <div class="join-us-content">
        <div class="join-us-content-infos">
          <div class="join-us-content-infos-content">
            <div class="join-us-content-title">
              <PageTitle class="page-title">
                {{ t('joinUs.member.title') }}
              </PageTitle>
            </div>
            <div class="join-us-content-content">
              {{ t('joinUs.member.description') }}
            </div>
          </div>
          <div class="join-us-content-image">
            <img src="../../assets/MemberJoinUS.png" class="image"/>
          </div>
        </div>
        <MainButton type="dimmed">{{ t('joinUs.member.bottom') }}</MainButton>
      </div>
      <div class="join-us-content">
        <div class="join-us-content-infos">
          <div class="join-us-content-infos-content">
            <PageTitle class="page-title">
              {{ t('joinUs.partner.title') }}
            </PageTitle>
            <div class="join-us-content-content">
              {{ t('joinUs.partner.description') }}
            </div>
          </div>
          <div class="join-us-content-image">
            <img src="../../assets/PartnerJoinUs.png" class="image"/>
          </div>
        </div>
        <MainButton type="dimmed">{{ t('joinUs.partner.bottom') }}</MainButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.join-us {
  background-color: $clight-gray;
  position: relative;
  right: 11.5%;

  bottom: 30rem;
  height: fit-content;
  width: 102.5vw;
  margin: 0;
  align-items: center;

  .join-us-wrapper {
    display: flex;
    gap: 23px;
    justify-content: center;
    margin: 0 9.7%;
    padding: 5% 0;

    .join-us-content {
      background-color: $cwhite;
      border-radius: 30px;
      padding: 34px;
      height: fit-content;


      .join-us-content-infos {
        display: flex;
        align-items: center;
        .join-us-content-infos-content{
          padding-right: 23px;
        }
        .page-title {
          .title {
            font-size: 30px !important;
          }

        }

        .join-us-content-content {
          font-size: 20px;

        }
      }
      .join-us-content-image{
        .image {
          width: 13vw;
        }
      }

      .MainButton {
        width: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px auto 0;
        font-weight: bold;
        font-family: $Roboto;
        font-size: 20px;
      }
    }

  }
}
</style>