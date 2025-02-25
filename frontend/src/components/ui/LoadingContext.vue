<script setup lang="ts">

import Loader from "@/components/ui/Loader.vue";
import {type ErrorFunction, useLoader} from "@/composition/loader";
import {onMounted, watch} from "vue";

const props = defineProps<{
	id?: string|number
	loader: () => Promise<any>
	ifError?: ErrorFunction|string
}>();


const {loading, error, load} = useLoader();

onMounted(() => {
	load(props.loader, props.ifError);
});

watch(() => props.id, () => {
	load(props.loader);
});

</script>

<template>
	<div v-if="loading" class="loading-context loading"><loader/></div>
	<div v-else-if="error" class="loading-context error">{{error}}</div>
	<slot v-else/>
</template>

<style lang="scss">
.loading-context {
	&.loading {
		margin-top: 30px;
	}

	&.error {
		margin-top: 30px;
		color: $cerror;
		font-size: 15px;
		line-height: 1.3em;
		text-align: center;
	}
}
</style>