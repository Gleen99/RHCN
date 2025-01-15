<script setup lang="ts">

import Icross from "@/components/images/Icross.vue";
import {computed} from "vue";

const props = defineProps<{
    modelValue: string
    editable?: boolean
    stringlist?: boolean
}>();

const emit = defineEmits<{
    (e: 'click'): void
    (e: 'delete'): void;
    (e: 'update:modelValue', value: string): void
}>();

const value = computed({
    get(): string {
        return props.modelValue;
    },
    set(newValue: string) {
        console.log("set value")
        emit("update:modelValue", newValue);
    }
});

</script>

<template>
    <div :class="'Tag button light' + (stringlist ? ' stringlist':'') + (editable ? ' editable':'')"
         @click="emit('click')">
        <input v-if="editable" v-model="value">
        <div v-else class="value">{{ value }}</div>
        <div class="delete" @click="emit('delete')">
            <icross/>
        </div>
    </div>
</template>

<style lang="scss">
.Tag {
    display: flex;
    gap: 10px;
    align-items: center;
    background-color: white;
    border-radius: 10px;
    border: $cborder solid 1px;
    color: $cborder;
    overflow: hidden;

    &.button {
        white-space: normal;
    }

    input {
        background: transparent;
        color: $cmainColor;
        font-size: $fsregular;
        font-weight: $fmedium;
    }

    .value {
        // height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 13px;
        font-size: $fsregular;
        font-weight: $fmedium;
    }

    .delete {
        display: none;
        width: 0;
        height: 28px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        overflow: hidden;
        transition: width linear 0.2s;

        .icon {
            width: 12px;
            height: 12px;
        }

        &:hover {
            svg {
                opacity: 0.5;
            }
        }
    }

    &.editable {
        .value {
            padding-right: 4px;
        }

        .delete {
            display: flex;
            width: 38px;
        }

        &:hover {
            .delete {
                width: 38px;
            }
        }
    }

    &.stringlist {
        border-color: $cborder;

        .value {
            flex: 1 1 0;
            // height: 35px;
            justify-content: flex-start;
        }
    }
}
</style>