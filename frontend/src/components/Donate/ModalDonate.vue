<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { loadStripe, StripeElements, PaymentIntentResult } from "@stripe/stripe-js";
import { useApi } from "@/composition/api";
import { useI18n } from "vue-i18n";
import MainButton from "@/components/ui/MainButton.vue";
import Modal from "@/components/ui/Modal.vue";
import FieldInput from "@/components/forms/FieldInput.vue";
import FormPlus from "@/components/forms/FormPlus.vue";
import FieldSelect from "@/components/forms/FieldSelect.vue";
import { Stripe } from "@stripe/stripe-js";
import { StripePaymentElement } from "@stripe/stripe-js";

// API et traduction
const { createPayments, getStripePublicKey, SaveDonation } = useApi();
const { t } = useI18n();

// Props et événements
const props = defineProps({ show: Boolean });
const emit = defineEmits(["close", "paymentSuccess"]);

// États
const message = ref<string | null>(null);
const clientSecret = ref<string | null>(null);
const paymentElement = ref<StripePaymentElement | null>(null);
const elements = ref<StripeElements | null>(null);
const stripe = ref<Stripe | null>(null);
const isLoading = ref(false);
const stripeLoading = ref(true);

// Formulaire du donateur
const contact = ref({
  lastname: "",
  firstname: "",
  email: "",
  number: "",
  street: "",
  city: "",
  postalCode: "",
  country: "",
  domaine: "",
});
// Liste des options pour le champ "Domaine"
const domaineOptions = ref([
  { label: t('user.fields.domain.education'), value: 'education' },
  { label: t('user.fields.domain.sport'), value: 'sport' },
  { label: t('user.fields.domain.science'), value: 'science' }
]);
// Montant du don
const amount = ref<number | null>(null);
const amountString = computed({
  get: () => (amount.value !== null ? amount.value.toString() : ""),
  set: (val) => {
    const num = parseFloat(val);
    amount.value = isNaN(num) ? null : num;
  },
});

// Initialisation de Stripe
onMounted(async () => {
  try {
    const response = await getStripePublicKey();
    const parsedResponse = typeof response === "string" ? JSON.parse(response) : response;
    if (!parsedResponse?.publicKey) throw new Error("Clé publique Stripe non trouvée.");
    stripe.value = await loadStripe(parsedResponse.publicKey);
    if (!stripe.value) throw new Error("Impossible de charger Stripe.");
  } catch (error) {
    console.error("❌ Erreur Stripe:", error);
  } finally {
    stripeLoading.value = false;
  }
});

// Création du PaymentIntent
const createPaymentIntent = async () => {
  if (!amount.value || amount.value <= 0 || !contact.value.email) {
    message.value = t('modal.modalDonate.errors.invalidData');
    return;
  }

  try {
    isLoading.value = true;
    message.value = null;

    if (!stripe.value) {
      message.value = t('modal.modalDonate.errors.stripeNotInitialized');
      return;
    }

    const response = await createPayments({
      amount: amount.value * 100,
      donorEmail: contact.value.email,
      contact: contact.value,
    });
    await SaveDonation({
      amount: amount.value,
      donorEmail: contact.value.email,
      contact: contact.value
    });
    if (!response?.clientSecret) {
      message.value = t('modal.modalDonate.errors.clientSecretMissing');
      return;
    }

    clientSecret.value = response.clientSecret;

    await nextTick();
    elements.value = stripe.value.elements({ clientSecret: clientSecret.value });

    if (paymentElement.value) {
      paymentElement.value.destroy();
    }

    paymentElement.value = elements.value.create("payment");
    paymentElement.value.mount("#payment-element");

  } catch (error) {
    message.value = t('modal.modalDonate.errors.paymentIntentCreationError');
  } finally {
    isLoading.value = false;
  }
};

// Confirmation du paiement
const handlePayment = async () => {
  if (!stripe.value || !elements.value || !clientSecret.value) return;

  try {
    isLoading.value = true;

    const result = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: { return_url: window.location.href },
    });

    if (result.error) {
      message.value = `❌ ${result.error.message}`;
      return;
    }


    emit("paymentSuccess");
  } catch (error) {
    message.value = "❌ Une erreur inattendue est survenue.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Modal
      :show="props.show"
      :title="t('modal.modalDonate.modalTitle')"
      :closeButton="true"
      @close="emit('close')"
      class="ModalDonateModal"
  >
    <template v-slot:default>
      <div class="ModalDonateContent">
        <FormPlus @submit.prevent="createPaymentIntent" class="FormPlus">
          <div class="form-row">
            <FieldInput
                name="lastname"
                v-model="contact.lastname"
                :label="t('user.fields.lastName.label')"
                mandatory
            />
            <FieldInput
                name="firstname"
                v-model="contact.firstname"
                :label="t('user.fields.firstName.label')"
                mandatory
            />
          </div>

          <div class="form-row">
            <FieldInput
                name="email"
                v-model="contact.email"
                :label="t('user.fields.email.label')"
                mandatory
            />
            <FieldInput
                name="number"
                v-model="contact.number"
                :label="t('user.fields.number.label')"
            />
          </div>

          <div class="form-row">
            <FieldInput
                name="street"
                v-model="contact.street"
                :label="t('user.fields.street.label')"
                mandatory
            />
            <FieldInput
                name="city"
                v-model="contact.city"
                :label="t('user.fields.city.label')"
                mandatory
            />
          </div>


          <!-- Champ Domaine -->

          <div>
            <div class="infos-wrapper">
              <span v-html="t('modal.modalDonate.moreInfosSendDonate.infos1').replace(/\n/g, '<br/>')"></span>
              <span class="bold">don@rhcn.ca</span>
            </div>
          </div>

        </FormPlus>

        <!-- Stripe Payment Element -->
        <div class="stripe-input">
          <div class="form-row">
            <FieldInput
                name="postalCode"
                v-model="contact.postalCode"
                :label="t('user.fields.postalCode.label')"
                mandatory
            />
            <FieldInput
                name="country"
                v-model="contact.country"
                :label="t('user.fields.country.label')"
                mandatory
            />
          </div>
          <div class="form-row">
            <div class="name-fields-Select">
              <FieldSelect
                  class="input-style"
                  name="domaine"
                  :options="domaineOptions"
                  v-model="contact.domaine"
                  :label="t('user.fields.domain.label')"
                  mandatory
              />
              <FieldInput
                  class="input-style"
                  name="amount"
                  :label="t('modal.modalDonate.paymentInfos.amountofDonate')"
                  v-model="amountString"
                  :placeholder="t('modal.modalDonate.paymentInfos.amount')"
                  mandatory
              />
            </div>
            <MainButton type="main" :disabled="isLoading || stripeLoading" @click="createPaymentIntent">
              {{ t("modal.modalDonate.paymentInfos.pay") }}
            </MainButton>

            <p
                v-if="message"
                :class="{
            error: message.includes('❌'),
            success: message.includes('🎉'),
          }"
            >
              {{ message }}
            </p>
          </div>
          <div v-if="clientSecret">
            <div id="payment-element" class="stripe-input"></div>
            <MainButton type="dimmed" :disabled="isLoading" @click="handlePayment">
              {{ t('modal.modalDonate.paymentInfos.valid') }}
            </MainButton>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <MainButton type="dimmed"   @click="emit('close')">
        {{ t("modal.modalSuccess.cancel") }}
      </MainButton>
    </template>
  </Modal>

</template>

<style scoped lang="scss">
.ModalDonateModal {
  .ModalDonateContent {
    display: flex;
    justify-content: center;
    gap: 20px;

    @include mobile {
      flex-direction: column;
      align-items: center;
      gap: 10px;

    }

    .FormPlus, .stripe-input {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .form-row {

        @include mobile {
          flex-direction: column;
          gap: 15px;
        }
      }
      .name-fields-Select{
        flex: 1;
      }
    }
  }

  .stripe-input {
    @include mobile {
      width: 100%;
      text-align: center;
    }
  }
}

.MainButton {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  width: fit-content;

  @include mobile {
    padding: 10px;
    text-align: center;
  }
}

</style>



