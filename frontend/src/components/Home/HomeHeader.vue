<script setup lang="ts">
import {useI18n} from "vue-i18n";
import IDonate from "@/components/images/IDonate.vue";
import IPartner from "@/components/images/IPartner.vue";
import IMember from "@/components/images/IMember.vue";
import MainButton from "@/components/ui/MainButton.vue";
import {ref} from "vue";
import ModalDonate from "@/components/Donate/ModalDonate.vue";
import {Routes} from "@/enums";
import router from "@/router";

const{t}= useI18n();
const isModalVisible = ref(false);

const openModal = () => {
  isModalVisible.value = true;
};
const closeModal = () => {
  isModalVisible.value = false;
};
function goToPartner() {
  router.push({ name: Routes.partners });
}
function goToMember() {
  router.push({ name: Routes.partners, query: { info: "membersInfos" } });
}
</script>

<template>
<div class="home-header">
  <div class="home-header__wrapper">
    <div class="home-header__infos">
      <div class="title-wrapper" v-html="t('home.header').replace(/\n/g, '<br/>')"></div>
      <div class="infos-wrapper" v-html="t('home.infos1').replace(/\n/g, '<br/>')"></div>
      <div class="infos-wrapper2" v-html="t('home.infos2').replace(/\n/g, '<br/>')"></div>
      <div class="ql-icon-picker">
        <div class="ql-iconMainButton">
          <MainButton type="main" @click="openModal">{{ t('global.buttons.donate') }}</MainButton>
        </div>
        <div class="ql-icon" @click="openModal">
          <IDonate/>
          <div>
            {{t('home.links1')}}
          </div>
        </div>
        <div class="ql-icon"  @click="goToPartner()">
          <IPartner/>
          <div>
            {{t('home.links2')}}
          </div>
        </div>
        <div class="ql-icon"  @click="goToMember()">
          <IMember/>
          <div>
            {{t('home.links3')}}
          </div>
        </div>
      </div>
    </div>
    <div class="home-header__logo">
      <img src="../../assets/Header.png" class="header-logo" />
    </div>
  </div>
  <!-- ModalDonate Component -->
  <ModalDonate v-if="isModalVisible" @close="closeModal" />
</div>
</template>

<style scoped lang="scss">
.home-header {
  background-color: $cdark-blue-gray;
  position: relative;
  height: fit-content;
  margin: 0;
  align-items: center;
  overflow: hidden;

  @include mobile {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('../../assets/Header.png') no-repeat center center;
      background-size: cover;
      filter: blur(10px);
      opacity: 0.3;
      z-index: 0;
    }
  }

  .home-header__wrapper {
    display: flex;
    padding-top: 9%;
    position: relative;
    z-index: 1;

    @include desktopMax {
      padding-top: 2%;
    }

    @include mobile {
      flex-direction: column;
      align-items: center;
      padding-top: 5%;
    }

    .home-header__infos {
      width: 69%;
      padding: 10% 10% 8.2% 6%;

      @include desktopMax {
        width: 69%;
        padding: 10% 10% 8.2% 13%;
      }

      @include mobile {
        width: 90%;
        padding: 5% 5%;
        margin-top: 12rem;
      }

      .title-wrapper {
        font-family: $Arial;
        font-size: 50px;
        font-weight: bold;
        color: $cwhite;
        padding-bottom: 34px;
        width: 100%;
        line-height: 5.5Vh;

        @include mobile {
          font-size: 28px;
          line-height: 4vh;
          padding-bottom: 20px;
        }
      }

      .infos-wrapper {
        color: $cwhite;
        font-family: $Arial;
        font-size: 18px;
        line-height: 3Vh;

        @include mobile {
          font-size: 16px;
          line-height: 2.5vh;
        }
      }

      .infos-wrapper2 {
        line-height: 3Vh;
        color: $cwhite;
        font-family: $Arial;
        font-size: 18px;
        width: 60%;
        padding: 20px 0 34px 0;

        @include mobile {
          width: 100%;
          font-size: 16px;
          padding: 15px 0;
        }
      }

      .ql-icon-picker {
        display: flex;
        gap: 45px;
        color: $cwhite;

        @include mobile {
          gap: 20px;
          align-items: center;
        }

        .ql-icon {
          display: flex;
          align-items: center;
          gap: 13px;
          font-family: $Arial;
          font-size: 18px;
          font-weight: bold;

          @include mobile {
            font-size: 16px;
          }
        }
        @include desktopMax {
          .ql-iconMainButton{
            display: none;
          }
        }
        @include desktop {
          .ql-iconMainButton{
            display: none;
          }
        }
        @include tablet {
          .ql-icon:nth-child(n+2) {
            display: none;
          }
        }

        @include mobile {
          .ql-icon:nth-child(n+2) {
            display: none;
          }
        }
      }
    }

    .header-logo {
      position: absolute;
      bottom: 0;
      right: 0;
      width: auto;
      height: auto;

      @include mobile {
        display: none;
      }
    }
  }
}
</style>