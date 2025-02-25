<script setup lang="ts">
import {useI18n} from "vue-i18n";
import IDonate from "@/components/images/IDonate.vue";
import IPartner from "@/components/images/IPartner.vue";
import IMember from "@/components/images/IMember.vue";

const{t}= useI18n();

</script>

<template>
<div class="home-header">
  <div class="home-header__wrapper">
    <div class="home-header__infos">
      <div class="title-wrapper" v-html="t('home.header').replace(/\n/g, '<br/>')"></div>
      <div class="infos-wrapper" v-html="t('home.infos1').replace(/\n/g, '<br/>')"></div>
      <div class="infos-wrapper2" v-html="t('home.infos2').replace(/\n/g, '<br/>')"></div>
      <div class="ql-icon-picker">
        <div class="ql-icon">
          <IDonate/>
          <div>
            {{t('home.links1')}}
          </div>
        </div>
        <div class="ql-icon">
          <IPartner/>
          <div>
            {{t('home.links2')}}
          </div>
        </div>
        <div class="ql-icon">
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
</div>
</template>

<style scoped lang="scss">
.home-header {
  background-color: $cdark-blue-gray;
  position: relative;
  right: 11.5%;
  bottom: 30rem;
  height: fit-content;
  width: 102.5vw;
  margin: 0;
  align-items: center;
  .home-header__wrapper{
    display: flex;
    padding-top: 9%;
    .home-header__infos {
      width: 69%;
      padding: 10% 10% 8.2% 13%;

      .title-wrapper {
        font-family: $Arial;
        font-size: 50px;
        font-weight: bold;
        color: $cwhite;
        padding-bottom: 34px;
        width: 100%;
        line-height: 5.5Vh;
      }

      .infos-wrapper {
        color: $cwhite;
        font-family: $Arial;
        font-size: 18px;
        line-height: 3Vh;
      }

      infos-wrapper {
        width: 40%;
      }

      .infos-wrapper2 {
        line-height: 3Vh;
        color: $cwhite;
        font-family: $Arial;
        font-size: 18px;
        width: 60%;
        padding: 20px 0 34px 0;
      }

      .ql-icon-picker {
        display: flex;
        gap: 45px;
        color: $cwhite;

        .ql-icon {
          display: flex;
          align-items: center;
          gap: 13px;
          font-family: $Arial;
          font-size: 18px;
          font-weight: bold;
        }
      }


    }

    .header-logo {
      position: absolute;
      bottom: 0;
      right: 0;
      width: auto;
      height: auto;
    }
  }

}
</style>