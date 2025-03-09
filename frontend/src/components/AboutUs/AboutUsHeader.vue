<script setup lang="ts">
import { useI18n } from "vue-i18n";
import PageTitle from "../ui/PageTitle.vue";

const { t } = useI18n();

</script>

<template>
    <div class="AboutUsHeader">
        <div class="AboutUsHeaderContent">
            <div class="AboutUsHeaderTitle">
              <img src="../../assets/BGAboutUs.png" class="BGAboutUs" />
                <div class="ContentInfos">
                    <PageTitle type="underlineBleu" class="title">
                        {{ t('aboutUs.title') }}
                    </PageTitle>
                    <div class="ContentInfosText">
                        <div class="textContent">
                            <div class="text">  {{ t('aboutUs.text1') }}</div>
                            <div class="text">  {{ t('aboutUs.text2') }}</div>
                        </div>
                        <div class="TextBottom">  {{ t('aboutUs.textBottom') }}</div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.AboutUsHeader {
  position: relative;
  height: 115vh;
  margin: 0;
  align-items: center;

  @include desktopMax {
    height: 100vh;
  }

  @include mobile {
    height: auto;
    padding: 36% 0 6% 0;
  }

  .AboutUsHeaderContent {
    background-color: $cdark-blue-gray;
    height: 96vh;
    padding-top: 15%;

    @include desktopMax {
      height: 80vh;
    }

    @include mobile {
      height: auto;
      padding-top: 10%;
    }

    .BGAboutUs {
      max-width: 100%;
      height: auto;
      display: block;
    }

    .ContentInfos {
      position: relative;
      bottom: 295px;

      @include mobile {
        bottom: 34px;
        text-align: center;
      }

      .title {
        display: flex;
        justify-content: center;
        position: relative;
        bottom: 30px;
        font-size: 60px;

        @include desktopMax {
          bottom: 100px;
        }

        @include mobile {
          font-size: 30px;
          bottom: 40px;
          display: block;
          margin: 0 auto;


        }
      }
    }

    .ContentInfosText {
      background-color: #FFFFFF;
      border-radius: 50px;
      padding: 5% 5%;
      font-size: 18px;
      line-height: 1.5;
      box-shadow: $box-shadow;
      margin: 0 5.8rem;

      @include desktopMax {
        margin-top: -9.5%;
        margin-left: 10rem;
        margin-right: 10rem;
      }

      @include mobile {
        margin: 5% 2%;
        padding: 8% 5%;
        font-size: 16px;
        border-radius: 20px;
      }

      .textContent {
        display: flex;
        gap: 15px;

        @include mobile {
          flex-direction: column;
          gap: 10px;
        }
      }

      .TextBottom {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        padding-top: 5%;
      }

      .text {
        flex: 1;
      }
    }
  }
}

</style>