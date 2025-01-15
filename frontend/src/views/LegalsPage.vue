<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import PublicTemplate from "@/components/layout/PublicTemplate.vue";
import {computed} from "vue";
import {LegalType} from "@shared/enums";
import LegalsLayout from "@/components/legals/LegalsLayout.vue";

// const props = defineProps<{
//     
// }>();
// const emit = defineEmits<{
//     (e: 'click', value: any): void
// }>();

const currentRoute = useRoute();

const legalType = computed<LegalType>(() => {
	return currentRoute.meta.type as LegalType;
})
</script>

<template>
	<public-template class="LegalsPage">
		<LegalsLayout :type="legalType"/>
	</public-template>
</template>

<style lang="scss">
.LegalsPage {

}
</style>