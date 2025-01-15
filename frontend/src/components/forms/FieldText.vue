<script setup lang="ts">
// props
import {computed} from "vue";
import FieldLayout from "@/components/forms/FieldLayout.vue";
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
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();

const {t} = useI18n();

const value = computed({
    // getter
    get(): string {
        return props.modelValue;
    },
    // setter
    set(newValue: string) {
        emit("update:modelValue", newValue);
    }
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
    <field-layout class="FieldText" :name="props.name" :mandatory="props.mandatory" :label="props.label" :label-slug="props.labelSlug" :extra="props.extra">
        <textarea :id="props.name" :name="props.name" :placeholder="thePlaceholder" v-model="value" :disabled="props.disabled"/>
    </field-layout>
</template>

<style lang="scss">
.FieldText {
	textarea {
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
		height: 150px;

		&::placeholder {
			color: $cformPlaceholder;
			font-weight: $fregular;
		}
		&::label {
			color: red;
			font-weight: $fregular;
		}
	}
}
</style>