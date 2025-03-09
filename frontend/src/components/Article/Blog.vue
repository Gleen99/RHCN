<script setup lang="ts">
import PublicTemplate from "@/components/layout/PublicTemplate.vue";

const props = defineProps<{}>();
const emit = defineEmits<{
	// (e: 'click', value: any): void
}>();

</script>

<template>
	<div class="Blog">
    <public-template >
      <router-view/>
    </public-template>
	</div>
</template>

<style lang="scss">
.Blog {

}
</style>