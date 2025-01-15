<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useApi} from "@/composition/api";
import {useAnalytics} from "@/composition/analytics";
import {useRoute, useRouter} from "vue-router";
import {useAuth} from "@/composition/snark-auth";

// const props = defineProps<{
//     
// }>();
// const emit = defineEmits<{
//     (e: 'click', value: any): void
// }>();

const router = useRouter();
const currentRoute = useRoute();
const {t} = useI18n();
const {sendEventAnalytics} = useAnalytics();
const {currentUser, isAuth} = useAuth();
const {} = useApi();


</script>

<template>
	<div class="PrivateApp">
		<router-view/>
	</div>
</template>

<style lang="scss">
.PrivateApp {

}
</style>