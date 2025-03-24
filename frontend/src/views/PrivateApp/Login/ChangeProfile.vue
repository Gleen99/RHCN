<script setup lang="ts">
import {ref} from 'vue';
import {useApi} from '@/composition/api';
import {IUser} from '@shared/crudTypes';
import PasswordInput from '@/components/forms/PasswordInput.vue';
import {useRoute, useRouter} from 'vue-router';
import {Routes} from '@/enums';
import {AuthRegisterData, useAuth} from '@/composition/snark-auth';
import {useAuthStore} from '@/composition/authStore';

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  showPassword: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'Mot de Passe'
  }
});

const data = ref<AuthRegisterData>({
  email: "",
  password: "",
  firstname: "",
  role: "admin",
  lastname: "",
});

const errorMessage = ref('');
const successMessage = ref('');
const {register} = useAuth();
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
    router.push({name: Routes.dashboard});
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
    <div class="ChangeProfile__content">
      <h1>Créer votre profil</h1>
      <div class="header__logo">
        <img src="../../../assets/Logo.jpeg" class="Logoimg"/>
      </div>
      <!-- Afficher les messages d'erreur et de succès -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <form @submit.prevent="handleSubmit" class="profile-form">
        <div class="form-group">
          <label for="firstname">Nom</label>
          <input type="text" id="firstname" v-model="data.firstname" placeholder="Entrez votre nom" required/>
        </div>

        <div class="form-group">
          <label for="lastname">Prénom</label>
          <input type="text" id="lastname" v-model="data.lastname" placeholder="Entrez votre prénom" required/>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="data.email" placeholder="Entrez votre email" required/>
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
          <label for="password">{{ props.label }}</label>
          <PasswordInput
              v-model:value="data.password"
              v-model:showPassword="showPassword"
          />
        </div>

        <button type="submit" class="btn-submit">Créer le profil</button>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
.ChangeProfile {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #6fb1fc 0%, #4364f7 100%);
  backdrop-filter: blur(10px);
  padding: 2rem;

}
.ChangeProfile__content {
  max-width: 420px;
  width: 100%;
  padding: 2rem;
  background: #F7F7F7;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
}
h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
}

.Logoimg {
  width: 30%;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  text-align: left;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #2c3e50;
  }

  input,
  select {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    color: #333;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
    }
  }
}

.btn-submit {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);

  &:hover {
    background-color: #0056b3;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
}

.error-message,
.success-message {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.error-message {
  background-color: #ffe6e6;
  color: #d9534f;
  border: 1px solid #f5c6cb;
}

.success-message {
  background-color: #e6ffea;
  color: #28a745;
  border: 1px solid #c3e6cb;
}
</style>
