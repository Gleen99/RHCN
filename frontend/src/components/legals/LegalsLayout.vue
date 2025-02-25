<script setup lang="ts">
import {LegalType} from "@shared/enums";
import LoadingContext from "@/components/ui/LoadingContext.vue";
import {computed, ref} from "vue";
import type {ILegalsDB} from "@shared/crudTypes";
import LegalBlock from "@/components/legals/LegalBlock.vue";
import {useI18n} from "vue-i18n";

const props = defineProps<{
    type: LegalType
}>();

// const {loadLegals} = useApi();
const {t} = useI18n();

const legals = ref<ILegalsDB|null>(null);

async function loadContent() {
    // legals.value = await loadLegals(props.type);
}

const title = computed<string>(() => {
	return t('legals.' + props.type + ".title");
});
</script>

<template>
    <div class="LegalsLayout">
        <h1>{{ title }}</h1>
        <loading-context :loader="loadContent">
            <div class="legal-content">
                <LegalBlock v-for="(block, idx) in legals!.blocks" :key="'block-' + idx" :block="block"/>
            </div>
        </loading-context>
    </div>
</template>

<style lang="scss">
.LegalsLayout {
    .legal-content {
		max-width: 768px;
		margin: $gap auto;
        color: $cmainColor;
    }
}
</style>
