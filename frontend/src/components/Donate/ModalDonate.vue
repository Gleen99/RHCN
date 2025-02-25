<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import FieldNumber from "@/components/forms/FieldNumber.vue";
import FieldInput from "@/components/forms/FieldInput.vue";
import FormPlus from "@/components/forms/FormPlus.vue";
import Modal from "@/components/ui/Modal.vue";
import { ref } from "vue";
import MainButton from "@/components/ui/MainButton.vue";
import FieldSelect from "@/components/forms/FieldSelect.vue";
import StripePayment from "@/components/Donate/StripePayment/StripePayment.vue";

const { t } = useI18n();
const props = defineProps({
  show: Boolean
});
const emit = defineEmits(['close']);

const contact = ref({
  lastname: '',
  firstname: '',
  email: '',
  number: '',
  street: '',
  city: '',
  postalCode: '',
  country: '',
  domaine: ''
});

// Liste des options pour le champ "Domaine"
const domaineOptions = ref([
  { label: t('user.fields.domain.education'), value: 'education' },
  { label: t('user.fields.domain.sport'), value: 'sport' },
  { label: t('user.fields.domain.science'), value: 'science' }
]);

function submitForm() {
  console.log("Formulaire soumis :", contact.value);
  emit('close');
}
</script>
<template>
  <Modal
      :show="props.show"
      :title="t('modal.modalDonate.modalTitle')"
      :closeButton="true"
      @close="emit('close')"
      class="ModalDonateModal"
  >
    <template #default="{ close }">
      <div class="ModalDonateContent">
        <FormPlus error-prefix="contact" class="FormPlus">
          <!-- Champs prénom et nom -->
          <div class="name-fields">
            <FieldInput
                class="input-style"
                name="lastname"
                :label="t('user.fields.lastName.label')"
                v-model="contact.lastname"
                :placeholder="t('user.fields.lastName.placeholder')"
                mandatory
            />
            <FieldInput
                class="input-style"
                name="firstname"
                :label="t('user.fields.firstName.label')"
                v-model="contact.firstname"
                :placeholder="t('user.fields.firstName.placeholder')"
                mandatory
            />
          </div>

          <!-- Champs Rue et Ville -->
          <div class="name-fields">
            <FieldInput
                class="input-style"
                name="street"
                :label="t('user.fields.street.label')"
                v-model="contact.street"
                :placeholder="t('user.fields.street.placeholder')"
                mandatory
            />
            <FieldInput
                class="input-style"
                name="city"
                :label="t('user.fields.city.label')"
                v-model="contact.city"
                :placeholder="t('user.fields.city.placeholder')"
                mandatory
            />
          </div>

          <!-- Champs Code Postal et Pays -->
          <div class="name-fields">
            <FieldInput
                class="input-style"
                name="postalCode"
                :label="t('user.fields.postalCode.label')"
                v-model="contact.postalCode"
                :placeholder="t('user.fields.postalCode.placeholder')"
                mandatory
            />
            <FieldInput
                class="input-style"
                name="country"
                :label="t('user.fields.country.label')"
                v-model="contact.country"
                :placeholder="t('user.fields.country.placeholder')"
                mandatory
            />
          </div>

          <!-- Champs email et numéro -->
          <div class="name-fields">
            <FieldInput
                class="input-style"
                name="email"
                :label="t('user.fields.email.label')"
                v-model="contact.email"
                :placeholder="t('user.fields.email.placeholder')"
                mandatory
            />
            <FieldNumber
                class="input-style"
                name="number"
                :label="t('user.fields.number.label')"
                v-model="contact.number"
                :placeholder="'+1 123 456 7890'"
                mandatory
            />
          </div>

          <!-- Champ Domaine -->
          <div class="name-fields-Select">
            <FieldSelect
                class="input-style"
                name="domaine"
                :options="domaineOptions"
                v-model="contact.domaine"
                :label="t('user.fields.domain.label')"
                mandatory
            />
          </div>
          <div>
            <div class="infos-wrapper">
              <span v-html="t('modal.modalDonate.moreInfosSendDonate.infos1').replace(/\n/g, '<br/>')"></span>
              <span class="bold">don@rhcn.ca</span>
            </div>
          </div>
        </FormPlus>
        <div class="payment">
          <stripe-payment/>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <MainButton type="standard" @click="close">{{ t("modal.modalDonate.cancel") }}</MainButton>
      <MainButton type="dimmed" @click="submitForm">{{ t("modal.modalDonate.confirm") }}</MainButton>
    </template>
  </Modal>
</template>

<style scoped lang="scss">
.ModalDonateModal {
  .ModalDonateContent {
    display: flex;
    justify-content: center;
    gap: 20px;
    .FormPlus {
      flex:1;
      display: flex;
      flex-direction: column;
      gap: 3px;
      .name-fields {
        display: flex;
        gap: 30px;
      }
      .infos-wrapper{
        .bold{
          font-weight: bold;
        }
      }
    }
    .payment{
      flex:1;
    }
  }

}
</style>