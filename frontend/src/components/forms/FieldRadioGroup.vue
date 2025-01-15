<script setup lang="ts">
// props
import {computed} from "vue";
import FieldLayout from "@/components/forms/FieldLayout.vue";
import type {SelectOption} from "@/front-types";
import {useI18n} from "vue-i18n";

const props = defineProps<{
    name: string
    label?: string
	labelSlug?: string
    extra?: string
    mandatory?: boolean
    disabled?: boolean
    modelValue: any
	options: SelectOption<any>[]
}>();

const {t} = useI18n();

// events
const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void
}>();

// data
const value = computed({
    // getter
    get(): any {
        return props.modelValue;
    },
    // setter
    set(newValue: any) {
        emit("update:modelValue", newValue);
    }
});

function select(val: any) {
	value.value = val;
}

const theLabel = computed<string|null>(() => {
	if(props.label) {
		return props.label;
	}
	else if(props.labelSlug) {
		return t(props.labelSlug);
	}
	else {
		return null;
	}
});
</script>

<template>
    <field-layout class="FieldRadioGroup" :name="props.name" :mandatory="props.mandatory" :extra="props.extra">
		<label v-if="theLabel">{{theLabel}}<span v-if="mandatory" class="mandatory">*</span></label>
		<div class="switcher">
			<div v-for="option in options" :key="option.value" :class="'option' + (option.value === modelValue ? ' active':'')" @click="select(option.value)">{{option.label}}</div>
		</div>
    </field-layout>
</template>

<style lang="scss">
.FieldRadioGroup {
	label {
		margin-bottom: 0;
		margin-right: 15px;
	}

	.input {
		display: flex;
		align-items: center;
	}

	.switcher {
		position: relative;
		border-radius: 100px;
		border: $cblack solid 1px;
		background-color: $cwhite;
		display: flex;
		align-items: center;
		padding: 2px 3px;

		.option {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 4px 10px;
			color: $cborder;
			background-color: $cwhite;
			border-radius: 20px;
			cursor: pointer;
			font-size: 12px;
			font-weight: $fmedium;

			&:hover {
				background-color: $cgray5;
			}

			&.active {
				color: $cwhite;
				background-color: $cblack;
			}
		}
	}
}
</style>