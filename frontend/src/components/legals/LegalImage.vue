<script setup lang="ts">

import {LegalImage} from "@shared/crudTypes";
import {computed} from "vue";
import {useApi} from "@/composition/api";

const props = defineProps<{
    image: LegalImage
}>();

const {buildStaticUrl} = useApi();

const imageUrl = computed<string>(() => {
    return buildStaticUrl(props.image.path);
});

const imageStyle = computed<any>(() => {
    if(props.image.size) {
        return {
            height: Math.max(0, Math.round(props.image.size)) + "px"
        };
    }
    else {
        return null;
    }
})

</script>

<template>
    <div class="LegalImage">
        <img :src="imageUrl" alt="image" crossorigin="anonymous" :style="imageStyle"/>
    </div>
</template>

<style lang="scss">
.LegalImage {
    max-height: 600px;
    width: 100%;
    padding: 30px 0 0 0;

    img {
        width: 100%;
        object-fit: cover;
    }
}
</style>