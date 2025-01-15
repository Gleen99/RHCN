<script setup lang="ts">
import {computed, provide} from "vue";

// props
const props = defineProps<{
    errors?: any,
    errorPrefix?: string
}>();

const errors = computed(() => {
    return props.errors? props.errors:null;
});

provide("errors", {errors, errorPrefix: props.errorPrefix});
</script>

<template>
    <form class="FormPlus" @submit.prevent="() => {}">
        <slot/>
    </form>
</template>

<style lang="scss">
.FormPlus {
	display: flex;
	flex-direction: column;
    gap: $gap;
}
</style>