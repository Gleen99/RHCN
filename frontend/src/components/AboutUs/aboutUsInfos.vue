<script setup lang="ts">
import PublicTemplate from "@/components/layout/PublicTemplate.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<template>
	<div class="aboutUsInfos">
		<div class="aboutUsInfosContent">
			<div class="ContentText">
				<div class="title">{{ t('aboutUs.infos.title1') }}</div>
				<div class="text">{{ t('aboutUs.infos.text1') }}</div>
			</div>
			<div class="ContentText">
				<div class="title">{{ t('aboutUs.infos.title2') }}</div>
				<div class="text">{{ t('aboutUs.infos.text2') }}</div>
			</div>
			<div class="ContentText">
				<div class="title">{{ t('aboutUs.infos.title3') }}</div>
				<div class="text">{{ t('aboutUs.infos.text3') }}</div>
			</div>
		</div>

	</div>
</template>

<style lang="scss">
.aboutUsInfos {
	background-color: $clight-gray;
	position: relative;
	right: 9%;
	height: fit-content;
  width: 99.2vw;
	margin: 0;
  @include desktopMax {
    width: 100.36vw;
  }

	.aboutUsInfosContent {
		margin:  0 116px;
		padding: 5% 0;
		display: flex;
		justify-content: space-between;
		text-align: center;
		gap: 13px;

		@include desktopMax {
			margin: 127px;
		}

		.ContentText {
			background-color: #FFFFFF;
			border-radius: 50px;
			padding: 5% 5%;
			font-size: 16px;
			line-height: 1.5;
			box-shadow: $box-shadow;

			.title {
				color: $cyellow;
				font-weight: bold;
			}
		}

	}

}
</style>