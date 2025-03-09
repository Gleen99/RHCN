<script setup lang="ts">
import {useI18n} from "vue-i18n";
import MainButton from "@/components/ui/MainButton.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import JoinUsContent from "@/components/Home/JoinUsContent.vue";

const {t} = useI18n()
</script>

<template>
  <div class="join-us">
   <div class="join-us-BG">
     <div class="join-us-wrapper">
       <PageTitle type="underline" class="title">
         {{ t('aboutUs.title') }}
       </PageTitle>
     </div>
   </div>
    <JoinUsContent/>
  </div>
</template>

<style lang="scss">
.join-us {
  .join-us-BG {
    text-align: center;
    background-color: $clight-gray;

  .join-us-wrapper {
    width: fit-content;
    margin: 0 auto;

    .PageTitle{}
    .title {
      display: flex;
      width: fit-content;
      text-align: center;
      padding: 23px 0 30px 0;
      margin: 0  0 15.8rem 0;
      @include mobile {
        display: block;
        margin: 0 auto;
      }

    }
  }
}

}


</style>