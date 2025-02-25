<script setup lang="ts">


import { useSlots, type Slots } from 'vue';


const props = defineProps<{
	title?: string
	light?: boolean
	picture?: string
	pictureAlt?: string
	interactive?: boolean
	hmini?: boolean
}>();
const emit = defineEmits<{
	// (e: 'click', value: any): void
}>();

const slots: Slots = useSlots();

</script>

<template>
	<div :class="'Box' + (interactive? ' interactive':'') + (light? ' light':'') + (hmini? ' hmini':'')">
		<div v-if="picture" class="picture">
			<img :src="picture" :alt="pictureAlt" crossorigin="anonymous"/>
		</div>
		<div v-if="slots.title" class="title">
			<div class="title-container">
				<div class="title-content"><slot name="title"/></div>
			</div>
		</div>
		<div class="content"><slot/></div>
		<div v-if="slots.footer" class="footer"><slot name="footer"/></div>
	</div>
</template>

<style lang="scss">
.Box {
	position: relative;
	background-color: $cboxBackground;
	border-radius: $radius;
	display: flex;
	flex-direction: column;
	border: $cborder solid 1px;
	box-shadow: $shadow;

	.picture {
		width: 100%;
		height: 200px;
		position: relative;
		border-radius: $radius $radius 0 0;
		overflow: hidden;

		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.title {
		padding: $gap $gap 0 $gap;

		.title-container {
			padding-bottom: 30px;
			border-bottom: $cboxBorder solid 1px;

			.title-content {
				border-radius: 10px;
				padding: 12px 15px;
				color: $cboxTitle;
				font-size: $fslarge;
				font-weight: $fbold;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}


	.content {
		padding: $gap;
		flex: 1 1 0;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&.interactive:hover {
		cursor: pointer;
		border: $cboxHover solid 2px;
	}

	&.light {
		background-color: $cboxLightBackground;
	}

	&.hmini {
		flex-direction: row;
	}
}
</style>