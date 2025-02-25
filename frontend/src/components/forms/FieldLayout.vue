<script setup lang="ts">
import { computed, inject } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  name: string;
  label?: string;
  labelSlug?: string;
  mandatory?: boolean;
  extra?: string;
}>();

const { t } = useI18n();

// Injection avec valeurs par défaut
const injected = inject<any>("errors", { errors: null, errorPrefix: "" });
const errors = injected.errors;
const errorPrefix = injected.errorPrefix;

// Calcul si le champ est obligatoire
const isMandatory = computed(() => props.mandatory === true);

// Calcul de l'erreur associée au champ
const error = computed((): string | null => {
  if (errors?.value && errors.value[props.name]) {
    const errorKey = `errors.${errorPrefix ? `${errorPrefix}.` : ""}${props.name}.${errors.value[props.name].id}`;
    return t(errorKey);
  }
  return null;
});

// Calcul du label (priorité à `label`, sinon `labelSlug`)
const theLabel = computed<string | null>(() => {
  if (props.label) {
    return props.label;
  } else if (props.labelSlug) {
    return t(props.labelSlug);
  }
  return null;
});
</script>

<template>
  <div class="FieldLayout">
    <!-- Label -->
    <label v-if="theLabel" :for="props.name">
      {{ theLabel }}
      <span v-if="isMandatory" class="mandatory">*</span>
    </label>

    <!-- Input slot -->
    <div class="input">
      <slot />
    </div>

    <!-- Slot pour contenu supplémentaire -->
    <slot name="bottom" />

    <!-- Erreur -->
    <div v-if="error" class="error" v-html="error"></div>

    <!-- Informations supplémentaires -->
    <div v-if="props.extra" class="extra" v-html="props.extra"></div>
  </div>
</template>

<style lang="scss">
.FieldLayout {
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 0.5rem;

    .mandatory {
      color: $cDark-steel-Blue;
      font-size: 12px;
      margin-left: 0.25rem;
    }
  }

  .input {
    display: flex;
    flex-direction: column;
  }

  .error {
    margin-top: 0.5rem;
    color: red;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
  }

  .extra {
    margin-top: 0.5rem;
    font-size: 12px;
    color: #666;
    line-height: 1.4;
  }
}
</style>