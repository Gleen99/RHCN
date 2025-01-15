<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useApi} from "@/composition/api";
import {useAnalytics} from "@/composition/analytics";
import {useRoute, useRouter} from "vue-router";
import {useAuth} from "@/composition/snark-auth";
import {computed} from "vue";

const props = defineProps<{
	type?: "light"|"strong"|"secondary"
}>();
// const emit = defineEmits<{
//     (e: 'click', value: any): void
// }>();

const router = useRouter();
const currentRoute = useRoute();
const {t} = useI18n();
const {sendEventAnalytics} = useAnalytics();
const {currentUser, isAuth} = useAuth();
const {} = useApi();

const iconType = computed<string>(() => {
	return props.type ? props.type : "light";
});
</script>

<template>
	<div :class="'IconSquare ' + iconType">
		<slot/>
	</div>
</template>

<style lang="scss">
.IconSquare {
	border-radius: $radius;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 12px;

	.icon {
		width: 18px;
		height: 18px;
	}


	&.light {
		background-color: $cwhite;
		box-shadow: $shadow;
		color: $cwhite;
	}

	&.secondary {
		background-color: $cdimColor;
		color: $cwhite;
	}

	&.strong {
		background-color: $cblack;
		color: $cwhite;
	}
}
</style>