<script setup lang="ts">

const props = defineProps<{
    text: string
}>();

</script>

<template>
    <div class="LegalParagraph" v-html="props.text"/>
</template>

<style lang="scss">
.LegalParagraph {
    font-size: 15px;
    font-weight: $fregular;
    line-height: 1.3em;
    color: $cmainColor;

    p {
        margin-top: 15px;
    }

    b, strong {
        font-weight: $fbold;
    }

    i, em {
        font-style: italic;
    }

    ul {
        margin-left: 30px;
        li {
            list-style: outside disc;

            p {
                margin-top: 0;
            }
        }
    }
}
</style>