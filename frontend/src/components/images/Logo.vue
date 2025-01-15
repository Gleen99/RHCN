<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
	color?: "white"|"black"
}>();

const logoColor = computed<string>(() => {
	return props.color ? props.color : "black";
});
</script>

<template>
	<div class="Logo">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 436 436" xml:space="preserve" :fill="logoColor">
			<path d="M-134.2,254.9L-134.2,254.9L-134.2,254.9z"/>
			<path d="M-82.8,158.2L-82.8,158.2L-82.8,158.2z"/>
			<path d="M-134.2,158.2L-134.2,158.2L-134.2,158.2z"/>
			<path d="M218,218L218,218L218,218z"/>
			<path d="M408.5,281.5C408.5,176.5,323,91,218,91S27.5,176.5,27.5,281.5 M218,345c-35,0-63.5-28.5-63.5-63.5S183,218,218,218 s63.5,28.5,63.5,63.5S253,345,218,345z"/>
		</svg>
	</div>
</template>

<style lang="scss">
.Logo {
	height: 80px;
	width: 80px;

	svg {
        width: 100%;
		height: 100%;
	}
}
</style>