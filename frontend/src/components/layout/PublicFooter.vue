<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useApi} from "@/composition/api";
import {useAnalytics} from "@/composition/analytics";

import {useRoute, useRouter} from "vue-router";
import {useAuth} from "@/composition/snark-auth";
import { Routes } from "@/enums";

const router = useRouter();
const currentRoute = useRoute();
const {t} = useI18n();
const {sendEventAnalytics} = useAnalytics();
const {currentUser, isAuth} = useAuth();
const {} = useApi();


</script>

<template>
	<div class="PublicFooter">
		<div class="section navigation">
			<h3>{{t('footer.navigation.title')}}</h3>
		</div>
		<div class="section legals">
			<h3>{{t('footer.legals.title')}}</h3>
			<!-- <router-link :to="{name: Routes.termsOfUse}">{{t('routes.termsOfUse')}}</router-link> -->
			<router-link :to="{name: Routes.cookies}">{{t('routes.cookies')}}</router-link>
		</div>
		<div class="section rs">
			todo réseaux sociaux...
		</div>
	</div>
</template>

<style lang="scss">
.PublicFooter {
	background-color: $cmainColor;
	color: $cmainBackground;
	padding: $gap;

	display: flex;
	align-items: flex-start;
	gap: 30px;

	> * {
		flex: 1 1 0;
	}

	.section {
		display: flex;
		flex-direction: column;

		h3 {
			font-weight: $fbold;
			margin-bottom: $gap2;
			font-size: $fsmedium;
		}

		a {
			color: $cwhite;
			margin-bottom: 10px;

			&:hover {
				text-decoration: underline;
			}
		}
	}
}
</style>