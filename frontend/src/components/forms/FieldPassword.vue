<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import FieldLayout from "@/components/forms/FieldLayout.vue";
import {useI18n} from "vue-i18n";
import type {PasswordValidatorObject} from "@/components/forms/form-types";

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
    validator?: PasswordValidatorObject
    autocomplete?: string
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

let validation = ref({
    min: false,
    uppercase: false,
    lowercase: false,
    digits: false
});

watchEffect(() => {
    if(props.validator) {
        const list = props.validator.validate(props.modelValue, {list: true});
        // console.log("validation list: ", list);
        validation.value.min = !list.includes("min");
        validation.value.uppercase = !list.includes("uppercase");
        validation.value.lowercase = !list.includes("lowercase");
        validation.value.digits = !list.includes("digits");
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
    <field-layout class="FieldPassword" :name="props.name" :mandatory="props.mandatory" :label="props.label" :labelSlug="props.labelSlug" :extra="props.extra">
        <input type="password" :id="props.name" :name="props.name" :placeholder="thePlaceholder" v-model="value" :disabled="props.disabled" autocomplete="autocomplete"/>
        <ul v-if="validator" class="validators">
            <li :class="validation.min? 'ok':'missing'">{{t("form.password.min")}}</li>
            <li :class="validation.digits? 'ok':'missing'">{{t("form.password.digits")}}</li>
            <li :class="validation.uppercase? 'ok':'missing'">{{t("form.password.uppercase")}}</li>
            <li :class="validation.lowercase? 'ok':'missing'">{{t("form.password.lowercase")}}</li>
        </ul>
    </field-layout>
</template>

<style lang="scss">
.FieldPassword {
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

    .validators {
        margin-top: 8px;
        margin-left: $gap2;

        li {
            margin-top: 4px;
            font-size: $fssmall;

            &.ok {
                font-weight: $fmedium;

                &::before {
                    content: "✔︎ ";
                    color: $csuccess;
                }
            }

            &.missing {
				color: $cdimColor;
                &::before {
                    content: "-︎ ";
                    opacity: 0.6;
					font-weight: $fbold;
                    color: $cdimColor;
                }
            }
        }
    }
}
</style>