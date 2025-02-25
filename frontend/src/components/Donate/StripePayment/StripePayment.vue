<script setup lang="ts">
import {ref, onMounted, watch, computed} from "vue";
import {
  loadStripe,
  StripeElements,
  StripeCardNumberElement,
  Stripe,
  StripeCardExpiryElement,
  StripeCardCvcElement
} from "@stripe/stripe-js";
import {useApi} from "@/composition/api";
import FormPlus from "@/components/forms/FormPlus.vue";
import FieldInput from "@/components/forms/FieldInput.vue";
import {useI18n} from "vue-i18n";

const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX");

const stripe = ref<Stripe | null>(null);
const elements = ref<StripeElements | null>(null);
const cardNumberElement = ref<StripeCardNumberElement | null>(null);
const cardExpiryElement = ref<StripeCardExpiryElement | null>(null);
const cardCvcElement = ref<StripeCardCvcElement | null>(null);
const clientSecret = ref<string | null>(null);
const message = ref("");
const amount = ref<number | null>(null);
const {createPayments} = useApi();
const {t} = useI18n();
const amountString = computed({
  get: () => (amount.value !== null ? amount.value.toString() : ""),
  set: (val: string) => {
    const num = parseFloat(val);
    amount.value = isNaN(num) ? null : num;
  }
});

onMounted(async () => {
  stripe.value = await stripePromise;
  if (stripe.value) {
    elements.value = stripe.value.elements();

    cardNumberElement.value = elements.value.create("cardNumber");
    cardNumberElement.value.mount("#card-number");

    cardExpiryElement.value = elements.value.create("cardExpiry");
    cardExpiryElement.value.mount("#card-expiry");

    cardCvcElement.value = elements.value.create("cardCvc");
    cardCvcElement.value.mount("#card-cvc");
  }
});

const createPaymentIntent = async () => {
  if (amount.value === null || amount.value <= 0) return;
  try {
    const response = await createPayments(amount.value);
    console.log("PaymentIntent Created:", response);
    clientSecret.value = response.secret;
  } catch (error) {
    console.error("❌ Erreur lors de la création du PaymentIntent:", error);
  }
};

const handlePayment = async () => {
  if (!stripe.value || !elements.value || !clientSecret.value) return;

  const {paymentIntent, error} = await stripe.value.confirmCardPayment(clientSecret.value, {
    payment_method: {
      card: cardNumberElement.value!
    }
  });

  if (error) {
    message.value = `❌ Erreur : ${error.message}`;
  } else if (paymentIntent?.status === "succeeded") {
    message.value = "🎉 Paiement réussi ! Merci pour votre don !";
  }
};

watch(amount, async () => {
  if (amount.value !== null && amount.value > 0) {
    await createPaymentIntent();
  }
});
</script>

<template>
  <div class="payment-container">
    <FormPlus error-prefix="contact" class="FormPlus">
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

      <!-- Champs Stripe Elements (Montés dans `onMounted`) -->
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
    </FormPlus>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<style lang="scss">
.payment-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  align-content: center;
  margin-bottom: 15px;
  .label {
    padding-bottom: 12px;
  }
}

.form-row-card-number {
  .label {
    padding-bottom: 12px;
  }
}

.half {
  width: 100%;

}

.stripe-input {
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

</style>