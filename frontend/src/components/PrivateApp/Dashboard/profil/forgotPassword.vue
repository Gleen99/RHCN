<script setup lang="ts">
import { ref } from 'vue';
import { useApi } from '@/composition/api';

const { forgotPassword } = useApi();

const email = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const loading = ref(false);

const handleForgotPassword = async () => {
  if (!email.value) {
    errorMessage.value = "Veuillez entrer une adresse e-mail.";
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    await forgotPassword({ email: email.value });

    successMessage.value =
      "Un e-mail contenant les instructions de réinitialisation du mot de passe vous a été envoyé.";
    email.value = '';
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Erreur lors de l'envoi de l'e-mail.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="forgot-password">
<div class="forgot-password-wrapper">
  <h1>Mot de passe oublié</h1>
  <div class="header__logo">
    <img src="../../../../assets/Logo.jpeg" class="Logoimg"/>
  </div>
  <form @submit.prevent="handleForgotPassword" class="forgot-password-form">
    <div class="form-group">
      <label for="email">Email :</label>
      <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Votre adresse e-mail"
      />
    </div>
    <div v-if="successMessage" class="success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <button type="submit" :disabled="loading">
      {{ loading ? "Envoi en cours..." : "Envoyer" }}
    </button>
  </form>
</div>
  </div>
</template>

<style lang="scss">
.forgot-password {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #6fb1fc 0%, #4364f7 100%);
  backdrop-filter: blur(10px);
  padding: 2rem;

.forgot-password-wrapper{
  max-width: 400px;
  width: 100%;
  padding: 20px;
  background: #F7F7F7;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #2c3e50;
  }
  .Logoimg {
    width: 30%;
    margin-bottom: 1rem;
  }
  .forgot-password-form {
    display: flex;
    flex-direction: column;

    .form-group {
      margin-bottom: 15px;

      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #2c3e50;
      }

      input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
      }
    }

    .error {
      color: red;
      margin-bottom: 15px;
      text-align: center;
    }

    .success {
      color: green;
      margin-bottom: 15px;
      text-align: center;
    }

    button {
      padding: 10px 15px;
      background-color: #3498db;
      border: none;
      border-radius: 4px;
      color: white;
      font-size: 16px;
      cursor: pointer;

      &:disabled {
        background-color: #95a5a6;
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        background-color: #2980b9;
      }
    }
  }
}
</style>
