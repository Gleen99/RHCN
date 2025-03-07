<script setup lang="ts">
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
	height: fit-content;
  margin-top: 50px ;
	.aboutUsInfosContent {

		padding: 5% 0;
		display: flex;
		justify-content: space-between;
		text-align: center;
		gap: 13px;
    margin-left: 5.8rem;
    margin-right: 6rem;
    @include desktopMax {
      margin-left: 9.8rem;
      margin-right: 11.4rem;
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