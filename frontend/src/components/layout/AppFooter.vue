<script setup lang="ts">
import moment from "moment-timezone";
import {useApi} from "@/composition/api";


// const props = defineProps<{
//     
// }>();
// const emit = defineEmits<{
//     (e: 'click', value: any): void
// }>();

const {} = useApi();


</script>

<template>
	<div class="AppFooter">
    <div class="copyright">© copyright {{ moment().year() }}</div>
	</div>
</template>

<style lang="scss">
.AppFooter {
	background-color: $cmainColor;
	color: $cmainBackground;
	padding: $gap2 $gap;

	display: flex;
	align-items: flex-start;
	gap: 30px;

	> * {
		flex: 1 1 0;
	}

	.section {
		display: flex;
		flex-direction: column;

		h3 {
			font-weight: $fbold;
			margin-bottom: $gap2;
			font-size: $fsmedium;
		}

		a {
			color: $cwhite;
			margin-bottom: 10px;

			&:hover {
				text-decoration: underline;
			}
		}
	}
}
</style>