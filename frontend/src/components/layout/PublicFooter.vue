<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useApi} from "@/composition/api";
import MainButton from "@/components/ui/MainButton.vue";
import IFacebookYellow from "@/components/images/IFacebookYellow.vue";
import IXYellow from "@/components/images/IXYellow.vue";
import ILinkedlnYellow from "@/components/images/ILinkedlnYellow.vue";
import IInstagramYellow from "@/components/images/IInstagramYellow.vue";
import router from "@/router";
import {Routes} from "@/enums";
import {ref} from "vue";
import ModalDonate from "@/components/Donate/ModalDonate.vue";

const {t} = useI18n();
const {} = useApi();

const isModalVisible = ref(false);

const openModal = () => {
  isModalVisible.value = true;
};
const closeModal = () => {
  isModalVisible.value = false;
};
function goToContact() {
  router.push({ name: Routes.contact });
}
function goToPartner() {
  router.push({ name: Routes.partners });
}
function goToMember() {
  router.push({ name: Routes.partners, query: { info: "membersInfos" } });
}
function goToprivacyPolicy() {
  router.push({ name: Routes.privacyPolicy });
}
const socialNetworks = [
  {key: "facebook", url: t('footer.socialNetwork.facebook'), component: IFacebookYellow},
  {key: "twitter", url: t('footer.socialNetwork.twitter'), component: IXYellow},
  {key: "instagram", url: t('footer.socialNetwork.instagram'), component: ILinkedlnYellow},
  {key: "linkedin", url: t('footer.socialNetwork.linkedin'), component: IInstagramYellow}
];

</script>

<template>
	<div class="PublicFooter">
		<div class="section logo">
      <img src="../../assets/Footer.png" class="footer-logo" alt="logo" />
		</div>
		<div class="section navigation">
			<h3>{{t('footer.socialNetwork.title')}}</h3>
      <MainButton type="standard" class="buttons-footer"  @click="goToContact()">
        {{ t('footer.contact') }}
      </MainButton>
      <div class="Footer-icon">
        <a v-for="network  in socialNetworks" :key="network.key" :href="network.url"><component :is="network.component"/></a>
      </div>
			<!-- <router-link :to="{name: Routes.termsOfUse}">{{t('routes.termsOfUse')}}</router-link> -->
<!--			<router-link :to="{name: Routes.cookies}">{{t('routes.cookies')}}</router-link>-->
		</div>
		<div class="section rs">
      <div class="infosPrivacyPolic">{{t('footer.LegalMentions')}}</div>
      <div class="infosPrivacyPolic">{{t('footer.CGV')}}</div>
      <div class="infosPrivacyPolic" @click="goToprivacyPolicy()">{{t('footer.privacyPolicy.title')}}</div>
		</div>
    <div class="footer-buttons-infos">
      <MainButton type="standard" class="buttons-footer"  @click="openModal()">
        {{ t('global.buttons.donate') }}
      </MainButton>
      <MainButton type="standard" class="buttons-footer"  @click="goToPartner()">
        {{ t('global.buttons.joinUs') }}
      </MainButton>
      <MainButton type="standard" class="buttons-footer"  @click="goToMember()">
        {{ t('global.buttons.becomeMember') }}
      </MainButton>
    </div>
    <!-- ModalDonate Component -->
    <ModalDonate v-if="isModalVisible" @close="closeModal" />
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

      a {


        svg {
          width: 50px;
          height: 30px;
        }
      }
    }
  }

  .rs {
    display: inline-flex;
    gap: 23px;
    font-family: $Arial;
    font-size: 24px;
    .infosPrivacyPolic{
      cursor: pointer;
    }
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