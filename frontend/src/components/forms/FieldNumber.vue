<script setup lang="ts">
import { computed, ref } from "vue";
import FieldLayout from "./FieldLayout.vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  name: string;
  label?: string;
  labelSlug?: string;
  extra?: string;
  mandatory?: boolean;
  placeholder?: string;
  placeholderSlug?: string;
  disabled?: boolean;
  modelValue: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const { t } = useI18n();

const value = computed({
  get(): string {
    return props.modelValue;
  },
  set(newValue: string) {
    emit("update:modelValue", newValue);
  },
});

const thePlaceholder = computed<string | undefined>(() => {
  if (props.placeholder) {
    return props.placeholder;
  } else if (props.placeholderSlug) {
    return t(props.placeholderSlug);
  } else {
    return undefined;
  }
});

const isValid = ref(true);

// Only allow numeric input
const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9\s+]/g, "");
  emit("update:modelValue", input.value);
};

</script>

<template>
  <field-layout
    class="FieldNumber"
    :name="name"
    :mandatory="mandatory"
    :extra="extra"
    :label="label"
    :label-slug="labelSlug"
  >
    <div class="input-container">
      <input
        type="tel"
        :id="name"
        :name="name"
        :placeholder="thePlaceholder"
        v-model="value"
        :disabled="disabled"
        @input="handleInput"
      />
      <div v-if="!isValid" class="error-message">
        {{ t("form.invalidPhoneNumber") }}
      </div>
    </div>
  </field-layout>
</template>

<style lang="scss">
.FieldNumber {
  .input-container {
    position: relative;

    input {
      display: block;
      appearance: none;
      border: 1px solid $cDark-steel-Blue;
      border-radius: 20px;
      padding: 18px 26px;
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

    .error-message {
      color: $cerror;
      font-size: 0.9em;
      margin-top: 5px;
    }
  }
}
</style>
