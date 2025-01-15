<script setup lang="ts">
// props
import { computed, ref } from "vue";
import moment from "moment-timezone";
import Datepicker from "vue3-datepicker";
import FieldLayout from "@/components/forms/FieldLayout.vue";
import type { timestamp } from "@shared/types";
import IAgenda from "@/components/images/IAgenda.vue";

const props = defineProps<{
  name: string;
  label?: string;
  extra?: string;
  mandatory?: boolean;
  placeholder?: string;
  disabled?: boolean;
  modelValue: timestamp | null;
  min?: timestamp;
  max?: timestamp;
  nullable?: boolean;
  format?: string;
}>();

// events
const emit = defineEmits<{
  (e: "update:modelValue", value: timestamp | null): void;
}>();

// Data
const datepickerRef = ref<any>(null); // Reference for the Datepicker component

const value = computed<Date | undefined>({
  get(): Date | undefined {
    return props.modelValue ? moment(props.modelValue).toDate() : undefined;
  },
  set(newValue: Date | undefined) {
    emit("update:modelValue", newValue ? newValue.valueOf() : null);
  },
});

// Limits
const min = computed<Date | undefined>(() =>
    props.min ? moment(props.min).toDate() : undefined
);
const max = computed<Date | undefined>(() =>
    props.max ? moment(props.max).toDate() : undefined
);

const inputFormat = computed<string>(() => props.format || "dd/MM/yyyy");

// Method to show Datepicker
const showCalendar = () => {
  datepickerRef.value?.showCalendar();
};
</script>


<template>
  <field-layout
      :class="'FieldDate' + (nullable ? ' with-null':'')"
      :name="props.name"
      :mandatory="props.mandatory"
      :label="props.label"
      :extra="props.extra"
  >
    <div class="datepicker-container">
      <datepicker
          ref="datepickerRef"
          :id="props.name"
          :name="props.name"
          v-model="value"
          :disabled="!!disabled"
          :inputFormat="inputFormat"
          :placeholder="props.placeholder || 'JJ/DD/AAAA'"
          :upper-limit="max"
          :lower-limit="min"
      />


      <IAgenda
          class="calendar-icon"
          @click="showCalendar"
      />
    </div>
    <div v-if="nullable" class="button-null" @click="value = undefined">
      <IAgenda />
    </div>
  </field-layout>
</template>

<style lang="scss">

.FieldDate {
    .v3dp__datepicker {
		--elem-hover-bg-color: $cdimColor;
		--elem-hover-color: $cwhite;
		--elem-selected-bg-color: $cmainColor;
    }

    .v3dp__popout {
        width: calc(100% - 46px) !important;
        left: 23px;
        border: $cborder solid 1px;
        margin-top: -2px;
    }
  .datepicker-container {
    display: flex;
    align-items: center;
    position: relative;

    .calendar-icon {
      position: absolute;
      right: 16px;
      cursor: pointer;
      color: $cDark-steel-Blue;
      transition: color 0.3s;

      &:hover {
        color: $cmainColor;
      }
    }

    .v3dp__datepicker {
      flex: 1;
    }

    input {
      width: 100%;
      padding-right: 40px;
    }
  }



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
        color: $cteal-dark;
        font-weight: $fregular;
      }
    }
	&.with-null {
		.input {
			display: flex;
			width: 100%;
		}
		.v3dp__datepicker {
			flex: 1 1 0;
			border-right: none;

			input {
				border-right: none;
			}
		}

		.button-null {
			flex: 0 0 30px;
			background-color: white;

			border-left: none;
			color: black;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			&:hover {
        border: $cborder solid 2px;
			}
		}
	}
}
</style>