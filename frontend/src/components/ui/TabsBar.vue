<script setup lang="ts">

import type {Tab} from "@/front-types";

const props = defineProps<{
	tabs: Tab[]
	modelValue: string
}>();
const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void
}>();

function selectTab(tab: Tab) {
	emit('update:modelValue', tab.value);
}
</script>

<template>
	<div class="TabsBar">
		<template v-for="tab in tabs" :key="tab.value">
			<div :class="'tab ' + tab.value + (modelValue === tab.value ? ' active':'')" @click="selectTab(tab)">{{tab.label}}</div>
			<hr/>
		</template>
	</div>
</template>

<style lang="scss">
.TabsBar {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: $gap;

	.tab {
		font-size: $fsmedium;
		font-weight: $fbold;
		color: $cdimColor;

		&:hover {
			cursor:pointer;
			color: white;
		}

		&.active {
			color: $cmainColor;
			cursor: default;
			text-decoration: underline;
		}
	}

	hr {
		height: 20px;
		width: 1px;
		border: none;
		background-color: $cborder;
		margin: 0;
		padding: 0;

		&:last-child {
			display: none;
		}
	}

}
</style>