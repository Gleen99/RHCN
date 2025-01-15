<script setup lang="ts">
import type {DataSet, IError} from "@shared/types";
import {useI18n} from "vue-i18n";

const props = defineProps<{
	errors: DataSet<IError|IError[]>|null
}>();

const {t} = useI18n();

</script>

<template>
	<div v-if="errors && errors._global" class="GlobalError">
		<template v-if="Array.isArray(errors._global)">
			<div v-for="error in errors._global" class="err">{{t('errors.' + error.id)}}</div>
		</template>
		<div v-else class="err">{{t('errors.' + (errors._global as IError).id)}}</div>
	</div>
</template>

<style lang="scss">
.GlobalError {
	margin: $gap2 0;

	.err {
		color: $cerror;
		font-size: $fsregular;
		font-weight: $fmedium;
		line-height: 1.3em;
		margin-top: 5px;
	}

	&:first-child {
		margin-top: 0;
	}
}
</style>