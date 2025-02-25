<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '@/composition/api';
import { Routes } from '@/enums';
import { useAuthStore } from '@/composition/authStore';

const { login } = useApi();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

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
  router.push({ name: Routes.ChangeProfile }); // Remplacez par votre route d'inscription
};
</script>

<template>
  <div class="login-container">
    <div class="login">
      <h1>Connexion</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email :</label>
          <input id="email" v-model="email" type="email" placeholder="Votre email" />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe :</label>
          <input id="password" v-model="password" type="password" placeholder="Votre mot de passe" />
        </div>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <button type="submit" :disabled="loading">
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
  background-color: #f5f5f5;
}

.login {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;

  h1 {
    margin-bottom: 20px;
    color: #2c3e50;
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
      }
    }

    .error {
      color: red;
      margin-bottom: 15px;
      font-size: 14px;
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
