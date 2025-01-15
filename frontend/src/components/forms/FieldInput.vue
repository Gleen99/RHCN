<script setup lang="ts">
import {computed} from "vue";
import FieldLayout from "./FieldLayout.vue";
import type {InputMode} from "./form-enums";
import {useI18n} from "vue-i18n";

const props = defineProps<{
    name: string
    label?: string
	labelSlug?: string
    extra?: string
    mandatory?: boolean
    placeholder?: string
	placeholderSlug?: string
    disabled?: boolean
    modelValue: string
    mode?: InputMode
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();

const {t} = useI18n();

const value = computed({
    get(): string {
        return props.modelValue;
    },
    set(newValue: string) {
        emit("update:modelValue", newValue);
    }
});

const type = computed<string>(() => {
    return props.mode? props.mode:"text";
});

const thePlaceholder = computed<string|undefined>(() => {
	if(props.placeholder) {
		return props.placeholder;
	}
	else if(props.placeholderSlug) {
		return t(props.placeholderSlug);
	}
	else {
		return undefined;
	}
});

</script>

<template>
    <field-layout class="FieldInput" :name="name" :mandatory="mandatory" :extra="extra" :label="label" :label-slug="labelSlug">
        <input :type="type" :id="name" :name="name" :placeholder="thePlaceholder" v-model="value" :disabled="disabled"/>
    </field-layout>
</template>

<style lang="scss">
.FieldInput {
	input {
		display: block;
		appearance: none;
		border: $cDark-steel-Blue solid 1px;
		border-radius: 20px;
		padding: 16px 26px;
		font-family: $Arial;
		font-size: $fsform;
		font-weight: $fbold;
		color: $cformText;
		background-color: transparent;
		outline: none;
		width: 100%;
		line-height: 1.3em;

		&::placeholder {
			color: $cblack;
			font-weight: $fregular;
		}
	}


}

</style>