<script setup lang="ts">
import {useI18n} from "vue-i18n";
import MainButton from "@/components/ui/MainButton.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import router from "@/router";
import {Routes} from "@/enums";

const {t} = useI18n()
function goToPartner() {
  router.push({ name: Routes.partners });
}
function goToMember() {
  router.push({ name: Routes.partners, query: { info: "membersInfos" } });
}
</script>

<template>
  <div class="join-us">
    <div class="join-us-infos-content">
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
        <MainButton type="dimmed"  @click="goToMember()">{{ t('joinUs.partner.bottom') }}</MainButton>
      </div>
      <div class="join-us-content">
        <div class="join-us-content-infos">
          <div class="join-us-content-infos-content">
            <PageTitle class="page-title">
              {{ t('joinUs.partner.title') }}
            </PageTitle>
            <div class="join-us-content-content">
              {{ t('joinUs.partner.description') }}
<!--              <br>-->
<!--              <br>-->
<!--              {{ t('joinUs.partner.description2') }}-->
            </div>
          </div>
          <div class="join-us-content-image">
            <img src="../../assets/PartnerJoinUs.png" class="image"/>
          </div>
        </div>
        <MainButton type="dimmed" @click="goToPartner()">{{ t('joinUs.member.bottom') }}</MainButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.join-us {
  @include mobile {
    background-color: $clight-gray;

  }

  .join-us-infos-content {
    display: flex;
    gap: 23px;
    justify-content: center;
    margin: -32rem 8.8rem 0 8.8rem;

    @include desktopMax {
      margin: -32rem 13.8rem 0 13.8rem;
    }

    @include mobile {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin: 23px;
    }

    .join-us-content {
      background-color: $cwhite;
      border-radius: 30px;
      padding: 34px;
      height: fit-content;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      flex:1;

      @include mobile {
        margin-bottom: 23px;
        width: 90%;
        padding: 20px;
      }

      .join-us-content-infos {
        display: flex;
        align-items: center;

        @include mobile {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          text-align: center;
        }

        .join-us-content-infos-content {
          padding-right: 23px;

          @include mobile {
            padding-right: 0;
          }
        }

        .page-title {
          @include mobile {
            margin-bottom: 13px;
          }
          .title {
            @include mobile {
              padding-top: 13px;
              display: flex;
              justify-content: center;
            }
          }
        }

        .join-us-content-content {
          font-size: 20px;
          @include mobile {
            font-size: 15px !important;
          }
        }
      }

      .join-us-content-image {
        display: flex;
        justify-content: center;

        .image {
          width: 13vw;

          @include mobile {
            width: 60vw;
          }
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

      }
    }
  }
}
</style>