<script setup lang="ts">
import Loader from "@/components/ui/Loader.vue";

const props = defineProps<{
    text: string
}>();
const emit = defineEmits<{
	// (e: 'click', value: any): void
}>();

</script>

<template>
    <div class="WaitingScreen">
        <div class="info">
            <Loader/>
            <div v-if="text" class="text" v-html="text"/>
        </div>
    </div>
</template>

<style lang="scss">
.WaitingScreen {
    background-color: $cmainBackground;
    position: fixed;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .info {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: $cmainColor;

        .Loader {
            width: 80px;
            height: 80px;

            svg {
                width: 100%;
                height: 100%;
            }
        }
        .text {
            margin-top: 24px;
            font-size: $fsregular;
            font-weight: $fbold;
        }
    }
}
</style>