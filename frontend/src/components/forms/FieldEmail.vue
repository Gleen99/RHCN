<script setup lang="ts">
import FieldInput from "@/components/forms/FieldInput.vue";
import { ref } from "vue";


const contact = ref({
  email: "",
});

const emailError = ref<string | null>(null);

// function validateEmail(email: string): boolean {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// const validateForm = (): boolean => {
//   let isValid = true;
//
//   if (!contact.value.email?.trim()) {
//     emailError.value = t("errors.field.required");
//     isValid = false;
//   } else if (!validateEmail(contact.value.email)) {
//     emailError.value = t("errors.field.invalidEmail");
//     isValid = false;
//   } else {
//     emailError.value = null;
//   }
//
//   return isValid;
// };

</script>

<template>
  <div>
    <FieldInput
      name="email"
      label="Email"
      placeholder="Email"
      v-model="contact.email"
      mandatory
    />
    <div v-if="emailError" class="error-message">{{ emailError }}</div>
  </div>
</template>

<style scoped>
.error-message {
  color: red;
  margin-top: 5px;
  font-size: 14px;
}
</style>
