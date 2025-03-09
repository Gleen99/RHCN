<script setup lang="ts">
import PublicTemplate from "@/components/layout/PublicTemplate.vue";

const props = defineProps<{}>();
const emit = defineEmits<{
	// (e: 'click', value: any): void
}>();

</script>

<template>
	<div class="Blog">
      <router-view/>
	</div>
</template>

<style lang="scss">
.Blog {

}
</style>