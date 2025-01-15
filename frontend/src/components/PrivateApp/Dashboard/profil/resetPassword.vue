<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApi } from '@/composition/api';
import { Routes } from '@/enums';

const { resetPassword } = useApi();
const route = useRoute();
const router = useRouter();

const newPassword = ref('');
const confirmPassword = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const loading = ref(false);

const handleResetPassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    errorMessage.value = "Tous les champs sont requis.";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "Les mots de passe ne correspondent pas.";
    return;
  }

  const token = route.query.token as string;

  if (!token) {
    errorMessage.value = "Token de réinitialisation manquant.";
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';

    await resetPassword({ token, newPassword: newPassword.value });

    successMessage.value = "Mot de passe réinitialisé avec succès.";
    await router.push({name: Routes.login});
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || "Erreur lors de la réinitialisation.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="reset-password">
    <h1>Réinitialiser le mot de passe</h1>
    <form @submit.prevent="handleResetPassword" class="reset-password-form">
      <div class="form-group">
        <label for="new-password">Nouveau mot de passe :</label>
        <input
          id="new-password"
          v-model="newPassword"
          type="password"
          placeholder="Entrez un nouveau mot de passe"
        />
      </div>
      <div class="form-group">
        <label for="confirm-password">Confirmer le mot de passe :</label>
        <input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          placeholder="Confirmez votre nouveau mot de passe"
        />
      </div>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <button type="submit" :disabled="loading">
        {{ loading ? "Réinitialisation en cours..." : "Réinitialiser" }}
      </button>
    </form>
  </div>
</template>

<style lang="scss">
.reset-password {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #2c3e50;
  }

  .reset-password-form {
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

    .success {
      color: green;
      margin-bottom: 15px;
      text-align: center;
    }

    .error {
      color: red;
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
