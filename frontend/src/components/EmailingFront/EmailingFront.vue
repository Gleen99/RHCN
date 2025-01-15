<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const{t} = useI18n();

</script>

<template>
<div class="EmailingFront">
  <div class="EmailFront">
    <div >
      <img src="../../assets/BGEmailFront.png" class="BGEmailFront" />
    </div>
    <div class="EmailFrontText">
      <div class="title">{{t('emailingFront.title')}}
      </div>
      <div class="text">
        {{t('emailingFront.text')}}
      </div>
      <div class="EmailSender">
        <input
            type="text"
            class="text"
            :placeholder="t('global.buttons.email')"
        />

        <div class="sender">{{t('global.buttons.register')}}
        </div>
      </div>
    </div>

  </div>

</div>
</template>

<style lang="scss">
.EmailingFront {
  padding: 45px 0;

  .EmailFront {
    display: flex;
    justify-content: center; /* Centre horizontalement */
    align-items: center; /* Centre verticalement */
    position: relative;
    height: 100%; /* S'assurer que le parent prend tout l'espace disponible */

    .BGEmailFront {
      //width: 52%;
    }

    .EmailFrontText {
      backdrop-filter: blur(15px) brightness(100%);
      -webkit-backdrop-filter: blur(15px) brightness(50%);
      background-color: rgba(255, 255, 255, 0.2);
      position: relative;
      right: 18%;
      height: fit-content;
      padding: 70px;
      border-radius: 25px;

      .title {
        color: $cyellow;
        font-size: 40px;
        font-weight: bold;


      }
      .text{
        width: 39vw;
        font-size: 16px;
        line-height: 23px;
      }
    }
    .EmailSender{
      margin: 25px 0;
      display: flex;
      padding: 0 0 0 15px;
     justify-content: space-between;
      background-color: white;
      border-radius: 25px;
      border: 1px solid $cteal-dark;
      cursor: pointer;
      font-family: $Roboto ;
      .text {
        display: flex;
        align-items: center;
        flex: 1 1 0;
        appearance: none;
        border: white 3px solid;
        border-radius: 10px 0px 0px 10px;
        background-color: transparent;
        font-size: 17px;
        color: $cteal-dark;
        font-weight: 600;
        padding: 10px 18px;


        &:focus {
          outline: none; /* Supprime le contour par défaut */
        }
        &::placeholder{
          color: $cteal-dark;
        }
      }
      .sender{
        background-color:  $cteal-dark;
        border-radius: 25px;
        color: #00525D;
        font-size: 18px;
        font-weight: 700;
        padding: 15px;
        display: flex;
        color: white;
        width: 26%;
        align-items: center;
        justify-content: center;

      }
    }

  }
}
</style>