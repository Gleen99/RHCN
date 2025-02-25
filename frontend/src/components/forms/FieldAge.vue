<script setup lang="ts">
// props
import { computed, ref } from "vue";
import FieldLayout from "@/components/forms/FieldLayout.vue";

const props = defineProps<{
  name: string;
  label?: string;
  extra?: string;
  mandatory?: boolean;
  placeholder?: string;
  disabled?: boolean;
  modelValue: number | null;
  minAge?: number;
  maxAge?: number;
}>();

// events
const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
}>();

// Data
const age = computed<number | null>({
  get: () => props.modelValue,
  set: (value) => {
    const minAge = props.minAge || 0;
    const maxAge = props.maxAge || 120;
    if (value === null || (value >= minAge && value <= maxAge)) {
      emit("update:modelValue", value);
    }
  },
});

const placeholder = computed(() => props.placeholder || "Entrez votre âge");

</script>

<template>
  <field-layout
      :class="'FieldAge'"
      :name="props.name"
      :mandatory="props.mandatory"
      :label="props.label"
      :extra="props.extra"
  >
    <input
        type="number"
        :name="props.name"
        :disabled="props.disabled"
        :placeholder="placeholder"
        v-model="age"
        class="age-input"
        min="0"
        :max="props.maxAge || 120"
    />
  </field-layout>
</template>

<style lang="scss">
.FieldAge {
  input {
    display: block;
    appearance: none;
    border: $cDark-steel-Blue solid 1px;
    border-radius: 20px;
    padding: 16px 26px;
    font-family: $Arial;
    font-size: $fsform;
    font-weight: $fbold;
    color: $cformText;
    background-color: transparent;
    outline: none;
    width: 100%;
    line-height: 1.3em;

    &::placeholder {
      color: #aaa;
      font-weight: $fregular;
    }
  }
}
</style>