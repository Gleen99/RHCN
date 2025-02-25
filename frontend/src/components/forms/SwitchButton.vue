<script setup lang="ts">

const props = defineProps<{
	modelValue: boolean
	disabled?: boolean
}>();
const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>();

function toggle() {
	emit("update:modelValue", !props.modelValue);
}

</script>

<template>
	<div :class="'SwitchButton ' + (modelValue ? 'true':'false') + (disabled ? ' disabled':'')" @click="toggle">
		<div class="button"/>
	</div>
</template>

<style lang="scss">
.SwitchButton {
	position: relative;
	width: 39px;
	height: 20px;
	border-radius: 20px;
	border: $cborder solid 1px;
	background-color: $cwhite;
	cursor: pointer;

	.button {
		position: absolute;
		width: 16px;
		height: 16px;
		top: 50%;
		transform: translate(0, -50%);
		transition: all ease-out 0.2s;
		border-radius: 20px;
	}

	&.false {
		border-color: $cborder;

		.button {
			background-color: $cborder;
			left: 3px;
		}
	}

	&.true {
		border-color: $cDark-steel-Blue;

		.button {
			background-color: $cyellow;
			right: 3px;
		}
	}

	&.disabled {
		opacity: 0.4;
		border-color: $cDark-steel-Blue;

		.button {
			background-color: $cborder;
		}
	}
}
</style>