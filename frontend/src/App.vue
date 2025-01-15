<script setup lang="ts">
import { RouterView } from 'vue-router'
import {onMounted, provide, ref} from "vue";
import {useAuth} from "@/composition/snark-auth";
import WaitingScreen from "@/components/ui/WaitingScreen.vue";
import type {GlobalController} from "@/front-types";
import { toast } from 'vue3-toastify';
import {useI18n} from "vue-i18n";

const {initAuth} = useAuth();
const {t} = useI18n();



const waitingText = ref<string|null>(null);
function showWaitingScreen(text?: string|null) {
	waitingText.value = text? text : null;
}
function hideWaitingScreen() {
	waitingText.value = null;
}

function showError(text?: string|null) {
	if(text) {
		toast.error(text, {toastClassName: "ToastError"});
	}
}
function showSuccess(text?: string|null) {
	if(text) {
		toast.success(text, {toastClassName: "ToastSuccess"});
	}
}

provide<GlobalController>("globalController", {
	showWaitingScreen,
	hideWaitingScreen,
	showError,
	showSuccess
});

const cookiesPreferences = [
	{
		items: [
			{ label: t("cookies.acceptAll"), value: 'ga', isEnable: true },
		],
	},
];

function acceptAllCookies(){
	localStorage.setItem('allLivecookCookiesAccepted', 'true');
}

function acceplimitedCookies(){
	if(localStorage.getItem('cookie-comply') === '["ga"]') {
		localStorage.setItem('allLivecookCookiesAccepted', 'true')
	} else {
		localStorage.setItem('allLivecookCookiesAccepted', 'false');
	}
}


</script>

<template>
	<router-view v-slot="{Component}" >
		<transition name="fade">
			<component v-if="!waitingText" :is="Component" />
		</transition>
        <transition name="fade">
			<waiting-screen v-if="waitingText" :text="waitingText"/>
        </transition>
	</router-view>
	<vue-cookie-comply
		:headerTitle="t('cookies.title')"
		:headerDescription="t('cookies.description')"
		:acceptAllLabel="t('cookies.acceptAll')"
		:preferences="cookiesPreferences"
		@on-accept-all-cookies="acceptAllCookies"
		@on-save-cookie-preferences="acceplimitedCookies"
	/>
	<div id="modal-target"/>
</template>

<style lang="scss">
    @use "@/scss/main" as main;

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 1s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}

	#modal-target {
		position: relative;
	}
</style>
