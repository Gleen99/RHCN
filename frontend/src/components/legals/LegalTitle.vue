<script setup lang="ts">

import {computed} from "vue";

const props = defineProps<{
    title: string
    level?: number
}>();

const titleLevel = computed<number>(() => {
    return props.level ? props.level : 1;
});

</script>

<template>
    <div :class="'LegalTitle level' + titleLevel">
        {{title}}
    </div>
</template>

<style lang="scss">
.LegalTitle {
    line-height: 1.3em;
    font-weight: $fbold;

    &.level1 {
        font-size: 23px;
        margin-top: 30px;
        color: $ctitleColor;
    }

    &.level2 {
        font-size: 20px;
        font-weight: $fbold;
        margin-top: 20px;
        color: $cdimColor;
    }

    &:first-child {
        margin-top: 0;
    }
}
</style>