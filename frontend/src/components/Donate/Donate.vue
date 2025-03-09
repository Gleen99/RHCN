<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '../ui/PageTitle.vue';
import MainButton from '../ui/MainButton.vue';
import ModalDonate from "@/components/Donate/ModalDonate.vue";


const { t } = useI18n();
const isModalVisible = ref(false);

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};
</script>

<template>
  <div class="Donate">
    <div class="Donate-content">
      <img src="../../assets/BGDonate.png" class="BGDonate" />
    </div>

    <div class="DonateContent">
      <div class="MainDonate">
        <div class="IAvatarDonate">
          <img src="../../assets/IAvatarDonate.png" class="IAvatarDonate" />
        </div>
        <div class="DonateContentInfos">
          <div class="title">
            <PageTitle class="Title">
              {{ t('donate.title') }}
            </PageTitle>
          </div>
          <div class="text">
            <div class="text1">
              {{ t('donate.text1') }}
            </div>
            <div class="text2">
              {{ t('donate.text2') }}
            </div>
            <div class="text3">
              {{ t('donate.text3') }}
            </div>
            <div class="text4">
              {{ t('donate.text4') }}
            </div>
            <div class="text5">
              {{ t('donate.text5') }}
            </div>
            <div>
              <MainButton type="cancel" class="DonateSubmit" @click="openModal">
                {{ t('donate.submit') }}
              </MainButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ModalDonate Component -->
    <ModalDonate v-if="isModalVisible" @close="closeModal" />
  </div>
</template>

<style lang="scss">
.Donate {
  position: relative;
  overflow: hidden;
  margin-top: 23px;

  .Donate-content {
    .BGDonate {
      position: relative;
      left: -2%;
      height: fit-content;
      width: 100.8vw;

      @include mobile {
        display: none;
        width: 100%;
        left: 0;
      }
    }
  }

  .IAvatarDonate {
    display: flex;
    align-items: center;
    padding: 0;

    @include mobile {
      justify-content: center;
    }
  }

  .DonateContent {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    background-color: $cdark-gray;
    color: #FFFFFF;
    padding: 22px;
    border-radius: 150px;
    width: 85%;
    display: flex;
    justify-content: center;
    align-items: center;

    @include mobile {
      position: relative;
      top: 0;
      left: 50%;
      transform: translate(-50%, 0);
      flex-direction: column;
      width: 90%;
      border-radius: 20px;
      padding: 15px;
    }

    .MainDonate {
      font-size: 16px;
      display: flex;
      gap: 30px;
      font-family: $Arial;
      font-style: italic;

      @include mobile {
        flex-direction: column;
        text-align: center;
        gap: 15px;
      }

      .Title {
        margin-bottom: 10px !important;
        font-style: normal;

        .title {
          font-size: 40px !important;

          @include desktopMax {
            font-size: 60px !important;
          }

          @include mobile {
            display: block;
            font-size: 24px !important;
          }
        }
      }

      .text {
        line-height: 20px;
        font-size: 18px;
        font-weight: normal;

        @include desktopMax {
          line-height: 25px;
        }

        @include mobile {
          font-size: 14px;
          line-height: 18px;
        }

        .text1 {
          margin-bottom: 5px;
        }

        .text3 {
          margin-bottom: 10px;
        }

        .text5 {
          margin-bottom: 15px;
        }

        @include desktopMax {
          .text3 {
            margin-bottom: 20px;
          }

          .text5 {
            margin-bottom: 20px;
          }
        }
      }

      .DonateSubmit {
        font-family: $Roboto;
        width: max-content;
        font-style: normal;
        padding: 10px 65px;
        color: $cdark-gray;
        font-size: 18px;
        font-weight: bold;

        @include mobile {
          width: 100%;
          padding: 10px 30px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
