<script setup lang="ts">
import LegalTitle from "@/components/legals/LegalTitle.vue";
import type {LegalBlock} from "@shared/crudTypes";
import LegalParagraph from "@/components/legals/LegalParagraph.vue";
import LegalImage from "@/components/legals/LegalImage.vue";

const props = defineProps<{
    block: LegalBlock
}>();

</script>

<template>
    <LegalTitle v-if="block.blockName === 'block-title'" :title="block.text!" :level="1"/>
    <LegalTitle v-if="block.blockName === 'block-title2'" :title="block.text!" :level="2"/>
    <LegalParagraph v-else-if="block.blockName === 'block-paragraph'" :text="block.text!"/>
    <LegalImage v-else-if="block.blockName === 'block-image'" :image="block.image!"/>
</template>
