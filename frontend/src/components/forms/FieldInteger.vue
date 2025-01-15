<script setup lang="ts">
import {computed} from "vue";
import FieldLayout from "./FieldLayout.vue";
import type {InputMode} from "./form-enums";

const props = defineProps<{
    name: string
    label?: string
	labelSlug?: string
    extra?: string
    mandatory?: boolean
    placeholder?: string
    disabled?: boolean
    modelValue: number|null
    mode?: InputMode
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: number|null): void
}>();

const value = computed({
    get(): string {
		if(props.modelValue !== null) {
			const int = parseInt(props.modelValue.toString());
			if (isNaN(int)) {
				return "";
			} else {
				return int.toString();
			}
		}
		else {
			return "";
		}
    },
    set(newValue: string) {
		if(newValue && newValue.trim().length > 0) {
			const int = parseInt(newValue);
			if (!isNaN(int)) {
				emit("update:modelValue", int);
				return;
			}
		}
		emit("update:modelValue", null);
    }
});

const type = computed<string>(() => {
    return props.mode? props.mode:"text";
});

</script>

<template>
    <field-layout class="FieldInteger" :name="name" :mandatory="mandatory" :extra="extra" :label="label" :label-slug="labelSlug">
        <input :type="type" :id="name" :name="name" :placeholder="placeholder" v-model="value" :disabled="disabled"/>
    </field-layout>
</template>

<style lang="scss">
.FieldInteger {
	input {
		display: block;
		appearance: none;
		border: $cborder solid 2px;
		padding: 10px 16px;
		font-family: $fontMain;
		font-size: $fsform;
		font-weight: $fbold;
		color: $cformText;
		background-color: transparent;
		outline: none;
		width: 100%;

		&::placeholder {
			color: $cformPlaceholder;
			font-weight: $fregular;
		}
	}
}
</style>