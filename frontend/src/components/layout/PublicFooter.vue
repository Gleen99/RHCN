<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useApi} from "@/composition/api";
import MainButton from "@/components/ui/MainButton.vue";
import IFacebookYellow from "@/components/images/IFacebookYellow.vue";
import IXYellow from "@/components/images/IXYellow.vue";
import ILinkedlnYellow from "@/components/images/ILinkedlnYellow.vue";
import IInstagramYellow from "@/components/images/IInstagramYellow.vue";

const {t} = useI18n();
const {} = useApi();


</script>

<template>
	<div class="PublicFooter">
		<div class="section logo">
      <img src="../../assets/Footer.png" class="footer-logo" alt="logo" />
		</div>
		<div class="section navigation">
			<h3>{{t('footer.socialNetwork.title')}}</h3>
      <MainButton type="standard" class="buttons-footer">
        {{ t('footer.contact') }}
      </MainButton>
      <div class="Footer-icon">
        <IFacebookYellow class="footer-icon" />
        <IXYellow class="footer-icon" />
        <ILinkedlnYellow class="footer-icon" />
        <IInstagramYellow class="footer-icon" />
      </div>
			<!-- <router-link :to="{name: Routes.termsOfUse}">{{t('routes.termsOfUse')}}</router-link> -->
<!--			<router-link :to="{name: Routes.cookies}">{{t('routes.cookies')}}</router-link>-->
		</div>
		<div class="section rs">
      <div class="infosPrivacyPolic">{{t('footer.LegalMentions')}}</div>
      <div class="infosPrivacyPolic">{{t('footer.CGV')}}</div>
      <div class="infosPrivacyPolic">{{t('footer.PrivacyPolic')}}</div>
		</div>
    <div class="footer-buttons-infos">
      <MainButton type="standard" class="buttons-footer">
        {{ t('global.buttons.donate') }}
      </MainButton>
      <MainButton type="standard" class="buttons-footer">
        {{ t('global.buttons.joinUs') }}
      </MainButton>
      <MainButton type="standard" class="buttons-footer">
        {{ t('global.buttons.becomeMember') }}
      </MainButton>
    </div>
	</div>
</template>

<style lang="scss">
.PublicFooter {
  background-color: $cdark-gray;
  color: $cmainBackground;
  padding: $gap;
  display: flex;
  gap: 30px;

  > * {
    flex: 1 1 0;
  }

  .footer-logo {
    width: 10vw;
  }

  .section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .navigation {
    display: inline-flex;
    gap: 13px;
    font-family: $Arial;
    font-size: 24px;

    .Footer-icon {
      width: 13vw;
      display: inline-flex;
      gap: 23px;
    }
  }

  .rs {
    display: inline-flex;
    gap: 23px;
    font-family: $Arial;
    font-size: 24px;
  }

  .footer-buttons-infos {
    display: grid;
    gap: 23px;
  }

  @include mobile {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;

    .footer-logo {
      width: 30vw;
    }

    .navigation {
      flex-direction: column;
      align-items: center;
      gap: 10px;
      font-size: 20px;

      .Footer-icon {
        width: auto;
        gap: 15px;
      }
    }

    .rs {
      flex-direction: column;
      align-items: center;
      gap: 10px;
      font-size: 18px;
    }

    .footer-buttons-infos {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      width: 100%;
    }
  }
}
</style>