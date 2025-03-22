<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '@/composition/api';
import { Routes } from '@/enums';
import { useAuthStore } from '@/composition/authStore';
import PasswordInput from "@/components/forms/PasswordInput.vue";

const { login } = useApi();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);
const showPassword = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez entrer votre email et mot de passe.';
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';

    const response = await login({ email: email.value, password: password.value });
    const user = response;

    authStore.setUser({
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    });
    authStore.setToken(user.token as string);

    await router.push({ name: Routes.dashboard });
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la connexion.';
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = () => {
  router.push({ name: Routes.forgotPassword }); // Remplacez par votre route de récupération de mot de passe
};

const handleRegister = () => {
  router.push({ name: Routes.register }); // Remplacez par votre route d'inscription
};
</script>

<template>
  <div class="login-container">
    <div class="login">
      <h1>Connexion</h1>
      <div class="header__logo">
        <img src="../../../../assets/Logo.jpeg" class="Logoimg" />
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email :</label>
          <input id="email" v-model="email" type="email" placeholder="Votre email" />
        </div>


        <div class="form-group">
          <PasswordInput
              v-model:value="password"
              v-model:showPassword="showPassword"
          />
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <button type="submit" :disabled="loading" class="btn-submit">
          {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>
      </form>
      <div class="extra-actions">
        <button class="btn-link" @click="handleForgotPassword">Mot de passe oublié ?</button>
        <button class="btn-link" @click="handleRegister">Pas de compte ? Inscrivez-vous</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6fb1fc 0%, #4364f7 100%);
  backdrop-filter: blur(10px);
  padding: 2rem;
}

.login {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  background: #F7F7F7;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;

  h1 {
    margin-bottom: 2rem;
    color: #2c3e50;
    font-size: 2rem;
    font-weight: 600;
  }
  .Logoimg{
    width: 30%;
  }

  .login-form {
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
        font-size: 16px;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
        }
      }
    }

    .error-message {
      margin-bottom: 15px;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      background-color: #ffe6e6;
      color: #d9534f;
      border: 1px solid #f5c6cb;
    }

    button.btn-submit {
      padding: 10px 15px;
      background-color: #3498db;
      border: none;
      border-radius: 4px;
      color: white;
      font-size: 16px;
      cursor: pointer;
      width: 100%;
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

  .extra-actions {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    .btn-link {
      background: none;
      border: none;
      color: #3498db;
      cursor: pointer;
      text-decoration: underline;
      font-size: 14px;
      margin-top: 10px;
      padding: 0;

      &:hover {
        color: #2980b9;
      }
    }
  }
}
</style>
