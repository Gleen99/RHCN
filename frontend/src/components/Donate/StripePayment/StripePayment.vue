<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import {
  loadStripe,
  StripeElements,
  StripeCardNumberElement,
  Stripe,
  StripeCardExpiryElement,
  StripeCardCvcElement
} from "@stripe/stripe-js";
import { useApi } from "@/composition/api";
import FormPlus from "@/components/forms/FormPlus.vue";
import FieldInput from "@/components/forms/FieldInput.vue";
import { useI18n } from "vue-i18n";


// Références pour Stripe et les éléments du formulaire
const stripe = ref<Stripe | null>(null);
const elements = ref<StripeElements | null>(null);
const cardNumberElement = ref<StripeCardNumberElement | null>(null);
const cardExpiryElement = ref<StripeCardExpiryElement | null>(null);
const cardCvcElement = ref<StripeCardCvcElement | null>(null);

// Variables réactives
const clientSecret = ref<string | null>(null);
const message = ref("");
const amount = ref<number | null>(null);
const isLoading = ref(false);
const formIsValid = ref(false);

// API et traduction
const { createPayments } = useApi();
const { t } = useI18n();

// Calculateur réactif pour convertir le montant en chaîne de caractères
const amountString = computed({
  get: () => (amount.value !== null ? amount.value.toString() : ""),
  set: (val: string) => {
    const num = parseFloat(val);
    amount.value = isNaN(num) ? null : num;
  }
});

// Initialisation des éléments Stripe au montage du composant
onMounted(async () => {
  // stripe.value = await;
  if (stripe.value) {
    elements.value = stripe.value.elements();

    // Création et montage des éléments Stripe
    cardNumberElement.value = elements.value.create("cardNumber");
    cardNumberElement.value.mount("#card-number");

    cardExpiryElement.value = elements.value.create("cardExpiry");
    cardExpiryElement.value.mount("#card-expiry");

    cardCvcElement.value = elements.value.create("cardCvc");
    cardCvcElement.value.mount("#card-cvc");
  }
});

// Création d'une intention de paiement via l'API
const createPaymentIntent = async () => {
  if (amount.value === null || amount.value <= 0) return;
  try {
    isLoading.value = true;
    const response = await createPayments(amount.value);
    console.log("PaymentIntent Created:", response);
    clientSecret.value = response.secret;
    message.value = ""; // Réinitialiser le message en cas de succès
  } catch (error) {
    console.error("❌ Erreur lors de la création du PaymentIntent:", error);
    message.value = "❌ Une erreur est survenue lors de la création du paiement.";
  } finally {
    isLoading.value = false;
  }
};

// Validation du formulaire
const validateForm = () => {
  formIsValid.value =
      amount.value !== null &&
      amount.value > 0 &&
      !!cardNumberElement.value &&
      !!cardExpiryElement.value &&
      !!cardCvcElement.value;
};
watch(amount, validateForm);

// Gestion du paiement
const handlePayment = async () => {
  if (!stripe.value || !elements.value || !clientSecret.value) {
    message.value = "❌ Une erreur est survenue. Veuillez réessayer.";
    return;
  }

  try {
    isLoading.value = true;

    const { paymentIntent, error } = await stripe.value.confirmCardPayment(clientSecret.value, {
      payment_method: {
        card: cardNumberElement.value!
      }
    });

    if (error) {
      console.error("❌ Erreur lors du paiement:", error);
      message.value = `❌ Erreur : ${error.message}`;
    } else if (paymentIntent?.status === "succeeded") {
      message.value = "🎉 Paiement réussi ! Merci pour votre don !";
      // Réinitialiser le formulaire après un succès
      amount.value = null;
      clientSecret.value = null;
      formIsValid.value = false;
      elements.value?.getElement("cardNumber")?.clear();
      elements.value?.getElement("cardExpiry")?.clear();
      elements.value?.getElement("cardCvc")?.clear();
    }
  } catch (error) {
    console.error("❌ Erreur inattendue :", error);
    message.value = "❌ Une erreur inattendue est survenue.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="payment-container">
    <FormPlus @submit.prevent="handlePayment" error-prefix="contact" class="FormPlus">
      <!-- Champ de saisie du montant -->
      <div class="name-fields">
        <FieldInput
            class="input-style"
            name="amount"
            :label="t('modal.modalDonate.paymentInfos.amountofDonate')"
            v-model="amountString"
            :placeholder="t('modal.modalDonate.paymentInfos.amount')"
            mandatory
        />
      </div>

      <!-- Champs Stripe Elements -->
      <div class="form-row-card-number">
        <label>{{ t('modal.modalDonate.paymentInfos.cardNumber') }}</label>
        <div id="card-number" class="stripe-input"></div>
      </div>

      <div class="form-row">
        <div class="half">
          <label>{{ t('modal.modalDonate.paymentInfos.cardExpiry') }}</label>
          <div id="card-expiry" class="stripe-input"></div>
        </div>
        <div class="half">
          <label>{{ t('modal.modalDonate.paymentInfos.cardCvc') }}</label>
          <div id="card-cvc" class="stripe-input"></div>
        </div>
      </div>

      <!-- Bouton de paiement -->
      <button :disabled="!formIsValid || isLoading" @click.prevent="handlePayment">
        {{ isLoading ? t('modal.modalDonate.paymentInfos.processing') : t('modal.modalDonate.paymentInfos.pay') }}
      </button>

      <!-- Message d'erreur ou succès -->
      <p v-if="message" :class="{ 'error': message.includes('❌'), 'success': message.includes('🎉') }">
        {{ message }}
      </p>
    </FormPlus>
  </div>
</template>

<style lang="scss">
.payment-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.half {
  width: calc(50% - .5rem);
}

.stripe-input {
  border: solid 1px #ccc;
  border-radius: 5px;
  padding: .75rem;
}

button[disabled] {
  background-color: #ccc;
}
</style>
