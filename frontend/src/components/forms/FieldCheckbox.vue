<script setup lang="ts">
// props
import {computed} from "vue";
import FieldLayout from "@/components/forms/FieldLayout.vue";
import SwitchButton from "@/components/forms/SwitchButton.vue";
import {useI18n} from "vue-i18n";

const props = defineProps<{
    name: string
    label?: string
	  labelSlug?: string
    extra?: string
    mandatory?: boolean
    placeholder?: string
    disabled?: boolean
    modelValue: boolean
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

const {t} = useI18n();

// data
const value = computed({
    // getter
    get(): boolean {
        return props.modelValue;
    },
    // setter
    set(newValue: boolean) {
        emit("update:modelValue", newValue);
    }
});

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

function toggle() {
	value.value = !value.value;
}
</script>

<template>
    <field-layout class="FieldCheckbox" :name="props.name" :mandatory="props.mandatory" :extra="props.extra">
		<label v-if="theLabel" @click="toggle">{{theLabel}}</label>
		<switch-button v-model="value" :disabled="disabled"/>
    </field-layout>
</template>

<style lang="scss">
.FieldCheckbox {
	label {
		margin-bottom: 0;
		margin-right: $gap2;
	}

	.SwitchButton {
		flex-shrink: 0;
	}

	.input {
		display: flex;
		align-items: center;
	}
}
</style>