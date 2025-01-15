<script setup lang="ts">

</script>

<template>
    <div class="Controls">
        <slot/>
    </div>
</template>

<style lang="scss">
.Controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $gap;
}
</style>