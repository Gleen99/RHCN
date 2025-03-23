<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApi } from '@/composition/api';
import { Routes } from '@/enums';
import PasswordInput from "@/components/forms/PasswordInput.vue";

const { acceptInvitation } = useApi();
const route = useRoute();
const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(false);

const handleAcceptInvitation = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs.';
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    await acceptInvitation({
      token: route.query.token,
      email: email.value,
      password: password.value,
    });

    successMessage.value = "Compte créé avec succès. Redirection...";
    setTimeout(() => {
      router.push({ name: Routes.login });
    }, 1500);
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || "Erreur lors de la création du compte.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="acceptedInvitation-container">
  <div>
    <p class="welcome-message">
      Back Office RHCN
      <br/>
      Connectez-vous pour accéder à
      <br/>
      votre espace personnel.
    </p>
    <div class="acceptedInvitation">
      <h1>Validation de votre compte</h1>
      <div class="acceptedInvitation__logo">
        <img src="../../../../assets/Logo.jpeg" class="Logoimg" />
      </div>

      <form @submit.prevent="handleAcceptInvitation" class="acceptedInvitation-form">

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Votre email" />
        </div>

        <div class="form-group">
          <PasswordInput
              v-model:value="password"
              v-model:showPassword="showPassword"
          />
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <button type="submit" :disabled="loading" class="btn-submit">
          {{ loading ? 'Création en cours...' : 'Créer mon compte' }}
        </button>
      </form>
    </div>
  </div>
  </div>
</template>

<style scoped lang="scss">
.acceptedInvitation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6fb1fc 0%, #4364f7 100%);
  padding: 2rem;
  .welcome-message{
    max-width: 400px;
    display: flex;
  text-align: center;
    width: 100%;
    color: #f7f7f7;
    font-size: 2rem;
    font-weight: 600;
    padding: 1rem 0;
    margin-bottom: 1rem;
  }


.acceptedInvitation {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  background: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;

  h1 {
    margin-bottom: 2rem;
    color: #2c3e50;
    font-size: 2rem;
    font-weight: 600;
  }

  .Logoimg {
    width: 30%;
  }

  .acceptedInvitation-form {
    display: flex;
    flex-direction: column;

    .form-group {
      margin-bottom: 15px;
      text-align: left;

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
        transition: all 0.3s ease;
        font-family: $Arial;
        &:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
        }
      }
    }

    .error-message,
    .success-message {
      margin-bottom: 15px;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
    }

    .error-message {
      background-color: #ffe6e6;
      color: #d9534f;
      border: 1px solid #f5c6cb;
    }

    .success-message {
      background-color: #e6ffed;
      color: #28a745;
      border: 1px solid #c3e6cb;
    }

    .btn-submit {
      padding: 10px 15px;
      background-color: #3498db;
      border: none;
      border-radius: 4px;
      color: white;
      font-size: 16px;
      cursor: pointer;
      width: fit-content;
      margin: 0 auto ;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);

      &:hover {
        background-color: #2980b9;
        transform: scale(1.02);
      }

      &:disabled {
        background-color: #95a5a6;
        cursor: not-allowed;
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }
  }
}
</style>