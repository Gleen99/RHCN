<script setup lang="ts">
import {computed, inject} from "vue";
import {useI18n} from "vue-i18n";

const props = defineProps<{
    name: string
    label?: string
	labelSlug?: string
    mandatory?: boolean
    extra?: any
}>();

const {t} = useI18n();

const {errors, errorPrefix} = inject<any>("errors");

const mandatory = computed((): boolean => {
    // noinspection PointlessBooleanExpressionJS
	return props.mandatory === true;
});

const error = computed((): string|null => {
    return (errors && errors.value && errors.value[props.name])? t("errors." + (errorPrefix? (errorPrefix + "."):"") + props.name + "." + errors.value[props.name].id):null;
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
</script>

<template>
    <div class="FieldLayout">
        <label v-if="theLabel" :for="props.name">{{theLabel}}<span v-if="mandatory" class="mandatory">*</span></label>
        <div class="input">
            <slot/>
        </div>
		<slot name="bottom"/>
        <div v-if="error" class="error" v-html="error"/>
        <div v-if="extra" class="extra" v-html="extra"/>
    </div>
</template>

<style lang="scss">
.FieldLayout {
    label {
        display: block;
        font-size: $fsregular;
        line-height: 1.3em;
        color: $cformLabel;
        margin-bottom: 4px;
        font-family: $Arial;

        &.mandatory {
            font-variant: super;
            color: $cformMandatory;
        }
    }

    .error {
        margin-top: 10px;
        font-size: $fsregular;
        font-weight: $fmedium;
        color: $cerror;
        line-height: 1.3em;
        margin-bottom: 10px;
		padding: 0;
		background-color: transparent;
    }
    .extra {
        margin-top: 10px;
        font-size: $fssmall;
        font-weight: $flight;
        line-height: 1.3em;
        color: $cformExtra;
    }
}
</style>