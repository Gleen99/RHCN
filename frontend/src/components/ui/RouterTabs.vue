<script setup lang="ts">

import {computed} from "vue";
import {type RouteRecordRaw, useRoute, useRouter} from "vue-router";
import TabsBar from "@/components/ui/TabsBar.vue";
import type {Tab} from "@/front-types";
import {useI18n} from "vue-i18n";

export type TabFilterFunction = (route: RouteRecordRaw) => boolean

const props = defineProps<{
	parent: string
	filter?: TabFilterFunction
}>();
// const emit = defineEmits<{
// 	// (e: 'click', value: any): void
// }>();

const currentRoute = useRoute();
const router = useRouter();
const {t} = useI18n();

const parentRouteIndex = computed<number>(() => {
	for(let i = currentRoute.matched.length - 1; i >= 0; --i) {
		if(currentRoute.matched[i].name === props.parent) {
			return i;
		}
	}
	return -1;
});

const routeName = computed<string>({
	get(): string {
		if(parentRouteIndex.value >= 0 && currentRoute.matched.length > parentRouteIndex.value + 1) {
			return currentRoute.matched[parentRouteIndex.value + 1].name as string;
		}
		else {
			return "";
		}
	},
	set(name: string) {
		router.push({name});
	}
});

const tabs = computed<Tab[]>(() => {
	if(parentRouteIndex.value >= 0) {
		let routes = currentRoute.matched[parentRouteIndex.value].children;
		if(props.filter) {
			routes = routes.filter(props.filter);
		}
		return routes.map(route => {
			return {label: t("route." + (route.name! as string)), value: (route.name! as string)};
		});
	}
	else {
		return [];
	}
});

</script>

<template>
	<tabs-bar class="RouterTabs" :tabs="tabs" v-model="routeName"/>
</template>

<style lang="scss">
.RouterTabs {

}
</style>