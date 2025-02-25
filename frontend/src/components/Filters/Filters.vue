<script setup lang="ts">

import FieldDate from "@/components/forms/FieldDate.vue";
import FormPlus from "@/components/forms/FormPlus.vue";
import FieldSelect from "@/components/forms/FieldSelect.vue";
import { useI18n } from "vue-i18n";


// Props
const props = defineProps<{
  categories: Array<{ label: string; value: string }>;
  selectedCategory: string;
  selectedDate: any;
}>();

// Emits
const emit = defineEmits<{
  (e: "update:selectedCategory", value: string): void;
  (e: "update:selectedDate", value: string | null): void;
}>();

// Internationalization
const { t } = useI18n();

// Methods for handling updates
const onCategoryChange = (value: string) => {
  emit("update:selectedCategory", value);
};

const onDateChange = (value: number | null) => {
  emit("update:selectedDate", value ? value.toString() : null);
};

</script>

<template>
  <div class="filters">
    <FormPlus error-prefix="Filters" class="FormPlus">
     <div class="FormPlusContent">
         <FieldSelect
             name="category"
             :options="props.categories"
             :modelValue="props.selectedCategory"
             @update:modelValue="onCategoryChange"
             :label="t('events.filters.category.label')"
         />
         <FieldDate
             name="date"
             :label="t('events.filters.date.label')"
             :modelValue="selectedDate"
             @update:modelValue="onDateChange"
         />
     </div>
    </FormPlus>
  </div>
</template>


<style lang="scss">
.filters {
  .FormPlus{
    .FormPlusContent {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 180px;
      .label{

      }
      .FieldSelect,
      .FieldDate{
        flex: 1;
      }
    }
  }
  .FieldLayout label  {
    font-size: 18px;
    color: $cteal-dark !important;
  }
}
</style>
