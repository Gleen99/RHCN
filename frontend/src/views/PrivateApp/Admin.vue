<script setup lang="ts">
import { ref } from 'vue';
import { useApi } from '@/composition/api';
import { AuthLoginData } from '@/composition/snark-auth';
import { Routes } from '@/enums';
import { useRouter } from 'vue-router';
import PasswordInput from '@/components/forms/PasswordInput.vue';

const { BoAuth } = useApi();
const router = useRouter();
const data = ref<AuthLoginData>({
  username: "",
  password: "",
});

const errorMessage = ref('');
const showPassword = ref(false);

async function handleLogin() {
  errorMessage.value = '';
  
  if (data.value.username && data.value.password) {
    try {
      console.log("Connexion réussie");
      await BoAuth(data.value); 
      router.push({ name: Routes.ChangeProfile }); 
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        errorMessage.value = "Mot de passe incorrect ou identifiant inconnu.";
      } else {
        errorMessage.value = "Une erreur s'est produite. Veuillez réessayer.";
      }
      console.error('Erreur de connexion:', error);
    }
  } else {
    errorMessage.value = 'Veuillez remplir tous les champs.';
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Page de Connexion</h1>
      <!-- Afficher le message d'erreur si présent -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      
      <!-- Formulaire de connexion -->
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Identifiant</label>
          <input type="text" id="username" v-model="data.username" placeholder="Entrez votre username" required />
        </div>
        
        <div class="form-group">
          <PasswordInput 
            v-model:value="data.password" 
            v-model:showPassword="showPassword" 
          />
        </div>
        
        <button type="submit" class="btn-login">Se Connecter</button>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: $background-color;

  .login-container {
    background: $container-background;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px $box-shadow-color;
    width: 100%;
    max-width: 400px;
    text-align: center;

    h1 {
      margin-bottom: 1.5rem;
      color: $text-color;
    }

    .form-group {
      margin-bottom: 1.5rem;
      text-align: left;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
        color: $text-secondary-color;
      }

      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid $input-border-color;
        border-radius: 4px;
        font-size: 1rem;
        color: $text-color;

        &:focus {
          outline: none;
          border-color: $input-focus-border-color;
        }
      }
    }

    .btn-login {
      background-color: $button-background;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      width: 100%;

      &:hover {
        background-color: $button-hover-background;
      }
    }
  }
  
  .Ioeil {
    width: 30px; 
    cursor: pointer;
  }

  /* Style pour le message d'erreur */
  .error-message {
    color: red;
    font-size: 1rem;
    margin-bottom: 1rem;
    text-align: left;
  }
}
</style>
