<script setup lang="ts">


const props = defineProps<{
	label: string
}>();
const emit = defineEmits<{
	(e: 'click'): void
}>();

</script>

<template>
	<div class="SeeMoreButton" @click="emit('click')">
		
		<div class="label">{{label}}</div>
	</div>
</template>

<style lang="scss">
.SeeMoreButton {
	display: flex;
	gap: 11px;
	align-items: center;
	padding: 3px;
	border-bottom: $cyellow solid 1px;
	color: $cyellow;
	cursor: pointer;

	.icon {
		height: 13px;
	}

	.label {
		font-size: 20px;
		font-weight: $fbold;
		white-space: nowrap;
	}

	&:hover {
		color: $cyellowHover;
		border-bottom-color: $cyellowHover;
	}
	&:active {
		color: $corange;
		border-bottom-color: $corange;
	}
}
</style>