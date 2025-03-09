<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Routes } from "@/enums";
import MainButton from "../ui/MainButton.vue";
import { ref } from "vue";

const { t, locale } = useI18n();
const isMenuOpen = ref(false);

const changeLanguage = (lang: string) => {
  locale.value = lang;
};
</script>

<template>
   <div class="PublicMenu" :class="{ 'open': isMenuOpen }">
  <div class="menu-header">
    <img src="../../assets/Logo.jpeg" class="Logo" />
    <div class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
      <span v-if="!isMenuOpen">☰</span>
      <span v-else>✖</span>
    </div>
  </div>
  <div class="menu-links" :class="{ 'open': isMenuOpen }">
    <router-link :to="{ name: Routes.events }" class="link">{{ t('menu.events') }}</router-link>
    <router-link :to="{ name: Routes.article }" class="link">{{ t('menu.articles') }}</router-link>
    <router-link :to="{ name: Routes.partners }" class="link">{{ t('menu.partners') }}</router-link>
    <router-link :to="{ name: Routes.aboutUs }" class="link">{{ t('menu.aboutUs') }}</router-link>
    <router-link :to="{ name: Routes.contact }" class="link">{{ t('menu.contact') }}</router-link>
    <MainButton type="main">{{ t('global.buttons.donate') }}</MainButton>
    <div class="languageSwitcher">
      <div class="languageSwitcher-button" v-if="locale !== 'fr'" @click="changeLanguage('fr')">
        Fr
      </div>
      <div class="languageSwitcher-button" v-if="locale !== 'en'" @click="changeLanguage('en')">
        En
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss">
.PublicMenu {
	max-width: 1305px;
	width: calc(100% - 60px);
	display: flex;
	align-items: center;
	border-radius: 0 0 10px 10px;
	background-color: $clight-gray2;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
	position: fixed;
	left: 50%;
	top: 0;
	transform: translate(-50%, 0);
	z-index: 300;
	padding: 0 40px;
	justify-content: space-between;
	@include desktopMax {
		max-width: 1650px;

	}
	.Logo {
		height: 139px;
		cursor: pointer;
		padding: 5px;
	}

  .menu-toggle {
    display: none;
    font-size: 30px;
    cursor: pointer;
  }

  .menu-links {
    display: flex;
    gap: 15px;
    flex: 1;
    justify-content: space-between;
    padding: 0 7rem;
    align-items: center;

  }

  .link {
    cursor: pointer;
    font-size: 20px;
    font-weight: 600;
    color: black;
    line-height: 1.2em;

    &:hover {
      text-decoration: underline;
    }
  }

  .MainButton {
    font-size: 20px;
  }

	.languageSwitcher {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translate(50%, -50%);
		overflow: hidden;
		cursor: pointer;
		font-size: 20px;
		font-weight: 600;
    @include mobile {
      left: 50%;
      top: 100%;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: center;
      align-items: center;
    }
		.languageSwitcher-button {
			// color: $cyellow;
			padding: 5px 10px;
			cursor: pointer;
			transition: background-color 0.3s, color 0.3s;


      &:hover {
        background-color: #f0f0f0;
      }

      &.active {
        background-color: #3498db;
        color: white;
      }
    }
  }

  @include mobile {
    flex-direction: column;
    padding: 10px;
    width: 100%;
    .menu-header {
      display: flex;
      justify-content: center; // Centre le logo
      position: relative;
      width: 100%;
    }
    .menu-toggle {
      display: block;
      position: absolute;
      top: 15px;
      right: 15px;
      color: $cyellow;
    }
    .menu-links {
      display: none;
      flex-direction: column;
      width: 100%;
      align-items: center;
      position: relative;
      background-color: $clight-gray2;
      padding: 20px;
      &.open {
        display: flex;
      }
    }
  }
}
</style>