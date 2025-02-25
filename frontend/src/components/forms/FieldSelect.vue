<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import FieldLayout from "@/components/forms/FieldLayout.vue";
import IAgenda from "@/components/images/IAgenda.vue";
import IllusIconOpen from "@/components/images/IllusIconOpen.vue";

const props = defineProps<{
  name: string;
  label?: string;
  extra?: string;
  mandatory?: boolean;
  placeholder?: string;
  disabled?: boolean;
  modelValue: any;
  options:
      | Array<string | { label: string; value: any }>
      | (() => Array<string | { label: string; value: any }>)
      | (() => Promise<Array<string | { label: string; value: any }>>);
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

// Data: Computed property for `value`
const value = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});

// Define options
const options = ref<Array<{ label: string; value: any }>>([]);

watchEffect(async () => {
  let result: Array<string | { label: string; value: any }>;

  if (Array.isArray(props.options)) {
    result = props.options;
  } else {
    const ret = props.options();
    result = Array.isArray(ret) ? ret : await ret;
  }

  options.value = result.map((entry) =>
      typeof entry === "object" ? entry : { label: entry, value: entry }
  );
});
</script>

<template>
  <field-layout
      class="FieldSelect"
      :name="props.name"
      :mandatory="props.mandatory"
      :label="props.label"
      :extra="props.extra"
  >
    <div class="select-container">
      <select
          :id="props.name"
          :name="props.name"
          v-model="value"
          :disabled="props.disabled"
      >
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <IllusIconOpen class="icon-open" />
    </div>
  </field-layout>
</template>


<style lang="scss">
.FieldSelect {
  .select-container {
    position: relative;
    display: flex;
    align-items: center;

    select {
      display: block;
      appearance: none;
      border: $cDark-steel-Blue solid 1px;
      border-radius: 20px;
      padding: 16px 26px;
      font-family: $Arial;
      font-size: $fsform;
      color: $cformText;
      background-color: transparent;
      outline: none;
      width: 100%;
      line-height: 1.3em;

      &::placeholder {
        color: $cformText;
        color: #aaa;
      }
    }

    .icon-open {
      position: absolute;
      right: 16px;
      pointer-events: none;
      color: $cDark-steel-Blue;
      font-size: 18px;
      width: 23px;

      &:hover {
        color: $cmainColor;
      }
    }
  }
}

</style>
