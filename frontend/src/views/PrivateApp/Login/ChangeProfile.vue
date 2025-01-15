<script setup lang="ts">
import { ref } from 'vue';
import { useApi } from '@/composition/api';
import { IUser } from '@shared/crudTypes';
import PasswordInput from '@/components/forms/PasswordInput.vue';
import { useRoute, useRouter } from 'vue-router';
import { Routes } from '@/enums';
import { AuthRegisterData, useAuth } from '@/composition/snark-auth';
import { useAuthStore } from '@/composition/authStore';


const data = ref<AuthRegisterData>({
  email: "",
  password: "",
  firstname: "",
  role: "admin",
  lastname: "",
});

const errorMessage = ref('');
const successMessage = ref('');
const { register } = useAuth();
const showPassword = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const {CreateUser} = useApi();


const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await CreateUser(data.value);
      const user = response; 
    const token = response.token; 

  
    authStore.setUser({
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    });
    authStore.setToken(user.token as string);
  
    successMessage.value = "Inscription réussie ! Vous êtes maintenant connecté.";
    router.push({ name: Routes.dashboard });
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      errorMessage.value = "Cet email est déjà utilisé";
    } else if (error.response && error.response.status === 401) {
      errorMessage.value = "Tous les champs sont requis";
    } else {
      errorMessage.value = "Une erreur s'est produite. Veuillez réessayer.";
    }
    console.error('Erreur de connexion:', error);
  }
};

</script>

<template>
  <div class="ChangeProfile">
    <h1>Créer votre profil</h1>

    <!-- Afficher les messages d'erreur et de succès -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

    <form @submit.prevent="handleSubmit" class="profile-form">
      <div class="form-group">
        <label for="firstname">Nom</label>
        <input type="text" id="firstname" v-model="data.firstname" placeholder="Entrez votre nom" required />
      </div>

      <div class="form-group">
        <label for="lastname">Prénom</label>
        <input type="text" id="lastname" v-model="data.lastname" placeholder="Entrez votre prénom" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="data.email" placeholder="Entrez votre email" required />
      </div>

      <div class="form-group">
        <label for="role">Rôle</label>
        <select id="role" v-model="data.role" required>
          <option value="admin">Admin</option>
          <option value="editor">Éditeur</option>
          <option value="contributor">Contributeur</option>
        </select>
      </div>

      <div class="form-group">
        <PasswordInput 
            v-model:value="data.password" 
            v-model:showPassword="showPassword" 
          />
      </div>

      <button type="submit" class="btn-submit">Créer le profil</button>
    </form>
  </div>
</template>

<style lang="scss">
.ChangeProfile {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-color: #f4f7fc;
  padding: 20px;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
}

.profile-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
  }

  input,
  select {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    color: #333;

    &:focus {
      outline: none;
      border-color: #0056b3;
    }
  }
}

.btn-submit {
  background-color: #0056b3;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #004085;
  }
}

.error-message {
  color: red;
}

.success-message {
  color: green;
}
</style>
