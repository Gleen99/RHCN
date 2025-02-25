<script setup lang="ts">

import type {RouteLocationRaw} from "vue-router";
import {useRouter} from "vue-router";
import {AnalyticsType} from "@/enums";
import {useAnalytics} from "@/composition/analytics";
import {useI18n} from "vue-i18n";
import {computed, ref} from "vue";
import Loader from "@/components/ui/Loader.vue";

const props = defineProps<{
	label?: string
	labelSlug?: string
	to?: RouteLocationRaw
	analyticsLocation?: string
	analyticsEvent?: string
	size?: "normal" | "big" | "small"
	waitingClick?: () => Promise<any>
	type?: "standard" | "main" | "dimmed" | "danger" | "success" |"cancel"
}>();
const emit = defineEmits<{
	(e: 'click'): void
}>();

const router = useRouter();
const {sendAnalytics} = useAnalytics();
const {t} = useI18n();

const loading = ref<Boolean>(false);

const labelText = computed<string | null>(() => {
	if (props.label) {
		return props.label;
	}
	else if (props.labelSlug) {
		return t(props.labelSlug);
	}
	else {
		return null;
	}
});

const buttonType = computed<string>(() => {
	return props.type ? props.type : "main";
});

async function click() {
	if (!loading.value) {
		if (props.analyticsLocation) {
			let data: any | undefined = undefined;
			if (props.analyticsEvent) {
				data = {event: props.analyticsEvent};
			}
			sendAnalytics(AnalyticsType.action, props.analyticsLocation, "Click", data);
		}
		if (props.to) {
			router.push(props.to);
		}
		else if (props.waitingClick) {
			loading.value = true;
			await props.waitingClick();
			loading.value = false;
		}
		else {
			emit("click");
		}
	}
}

</script>

<template>
	<div :class="'MainButton ' + (size ? size : 'normal') + ' ' + buttonType + (loading? ' but-loading':'')"
		 @click="click">
		<slot/>
		<loader v-if="loading"/>
		<div v-else-if="labelText" class="label">{{ labelText }}</div>
	</div>
</template>

<style lang="scss">
.MainButton {
	position: relative;
	display: flex;
	padding: 9px 30px;
	justify-content: center;
	align-items: center;
	border-radius: $radius;
	gap: $gap2;

	font-size: 15px;
	line-height: 1.2em;
	text-align: center;
	font-weight: $fmedium;
	transition: background-color, color ease-out 0.2s;
	cursor: pointer;

	&.but-loading .Loader {
		// width: 30px;
		height: 19px;

		svg {
			fill: $cwhite;
		}
	}

	&:active, .active {
		background-color: $cmainButtonHoverBackground;
		color: $cmainButtonHoverText;
	}

	&.big {
		font-size: 16px;
		padding: 14px 25px 12px 14px;

		&::before {
			height: 3px;
		}

		.icon {
			margin-right: 16px;
		}
	}

	&.small {
		font-size: 16px;
		padding: 12px 12px 10px;
	}



	&.danger {
		background-color: $cerror;
		color: $cwhite;

		&:hover, &.but-loading {
			background-color: rgba($cerror, 0.4);
		}
	}

	&.success {
		background-color: $csuccess;
		color: $cwhite;

		&:hover, &.but-loading {
			background-color: rgba($csuccess, 0.4);
		}
	}
	&.cancel {
		background-color: $cwhite;
		color: $cteal-dark;
		border-color: $cteal-dark;

		&:hover, &.but-loading {
			background-color: $cwhite;
		color: $cteal-dark;
		border-color: $cteal-dark;
        opacity: 0.9; 
		}
	}

	&.main {
    background-color: $cyellow;
    color: $cmainButtonText;

    &:hover, &.but-loading {
        background-color: $cyellow; 
        opacity: 0.9; 
        color: $cmainButtonHoverText;
    }
}
	&.dimmed{
		background-color: $cteal-dark;
    color: $cwhite;

    &:hover, &.but-loading {
        background-color: $cteal-dark; 
        opacity: 0.9; 
        color: $cwhite;
    }
	
	}
	&.standard{
		background-color: $cwhite;
    color: $cdark-blue-gray;
    border:$cdark-blue-gray solid 1px;
    border-radius: 20px;

    &:hover, &.but-loading {
        background-color: $cdark-blue-gray;
        opacity: 0.9; 
        color:white;
    }
	}


}
</style>