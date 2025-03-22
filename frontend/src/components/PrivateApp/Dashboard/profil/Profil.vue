<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useAuthStore} from '@/composition/authStore';
import {useApi} from '@/composition/api';
import {IUserDB} from '@shared/crudTypes';
import router from '@/router';
import {Routes} from '@/enums';
import PasswordInput from "@/components/forms/PasswordInput.vue";

const {GetUser, PutUser, DeleteUser, logout} = useApi();
const authStore = useAuthStore();
const user = ref<IUserDB | null>(null);
const loading = ref(false);
const error = ref('');
const editMode = ref(false);
const changePasswordMode = ref(false);
const modalMessage = ref('');
const showModal = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const changedPassword = ref<string>('');
const showPasswordnewPassword = ref(false);
const showPasswordconfirmPassword = ref(false);

const fetchUser = async () => {
  try {
    loading.value = true;
    if (authStore.user) {
      const response = await GetUser(authStore.user.email);
      user.value = response;
    } else {
      error.value = 'Aucun utilisateur connecté.';
    }
  } catch (err) {
    error.value = 'Impossible de charger les informations utilisateur.';
  } finally {
    loading.value = false;
  }
};

const showModalWithMessage = (message: string) => {
  modalMessage.value = message;
  showModal.value = true;
};

const updateUser = async () => {
  if (!user.value) return;

  try {
    loading.value = true;
    const updatedData = await PutUser(user.value, user.value._id);
    authStore.updateUserData(updatedData)
    user.value = {...user.value, ...updatedData};
    editMode.value = false;
    showModalWithMessage('Profil mis à jour avec succès.');
  } catch {
    error.value = 'Impossible de mettre à jour les informations.';
  } finally {
    loading.value = false;
  }
};

const changePassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    showModalWithMessage('Tous les champs sont requis.');
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    showModalWithMessage('Les mots de passe ne correspondent pas.');
    return;
  }
  if (!user.value) return;

  try {
    loading.value = true;
    await PutUser({password: newPassword.value}, user.value._id);
    changedPassword.value = newPassword.value;
    showModalWithMessage(`Mot de passe modifié avec succès : ${changedPassword.value}`);
    newPassword.value = '';
    confirmPassword.value = '';
    changePasswordMode.value = false;
  } catch (err) {
    showModalWithMessage('Le mot de passe actuel est incorrect.');
  } finally {
    loading.value = false;
  }
};

const deleteUser = async () => {
  if (!user.value) return;

  try {
    if (confirm('Voulez-vous vraiment supprimer votre compte ?')) {
      await DeleteUser(user.value._id);
      await router.push({name: Routes.ChangeProfile})
      authStore.deleteUser();
      showModalWithMessage('Votre compte a été supprimé avec succès.');
      logout();
    }
  } catch {
    error.value = 'Impossible de supprimer le compte.';
  }
};

const logoutUser = async () => {
  authStore.logout();
  await router.push({name: Routes.login});
  showModalWithMessage('Déconnexion réussie.');
};
onMounted(fetchUser);
</script>

<template>
  <div class="profil-container">
    <h1>Mon Profil</h1>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="!loading && user">
      <div class="profil-section">
        <div v-if="!editMode" class="profil-info">
          <img
              class="article-image"
              src="../../../../assets/undraw_farming_u62j.png"
              alt="Event Image"
          />
          <h1 class="profil-name">{{ user.firstname }} {{ user.lastname }}</h1>
          <div class="profil-role"><strong>Rôle :</strong> {{ user.role }}</div>
          <div class="profil-actions">
            <button @click="deleteUser" class="btn-delete">Supprimer mon compte</button>
            <button @click="logoutUser" class="btn-logout">Se déconnecter</button>
          </div>
        </div>

        <div class="profil-edit-form">
          <h1>Modifier votre profil</h1>
          <label>Nom :</label>
          <input v-model="user.firstname" placeholder="Nom" />
          <label>Prénom :</label>
          <input v-model="user.lastname" placeholder="Prénom" />
          <label>Email :</label>
          <input v-model="user.email" placeholder="Email" />
          <div class="profil-actions">
            <button @click="updateUser" class="btn-save">Enregistrer</button>
            <button @click="editMode = false" class="btn-cancel">Annuler</button>
          </div>
        </div>
      </div>

      <div class="profil-section">
        <div class="profil-password-form">
          <h1>Modifier le mot de passe</h1>
          <div class="form-group">
            <PasswordInput
                v-model:value="newPassword"
                v-model:showPassword="showPasswordnewPassword"
                label="Nouveau mot de passe"
            />
          </div>
          <div class="form-group">
            <PasswordInput
                v-model:value="confirmPassword"
                v-model:showPassword="showPasswordconfirmPassword"
                label="Confirmez votre nouveau mot de passe"
            />
          </div>
          <div class="profil-actions">
            <button @click="changePassword" class="btn-save">Changer</button>
            <button @click="changePasswordMode = false" class="btn-cancel">Annuler</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="loading">Chargement...</div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <button @click="showModal = false" class="btn-modal-close">Fermer</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.profil-container {
  padding: 20px;
  box-shadow: 0 2px 5px white;
  .profil-section {
    display: flex;
    justify-content: space-between;
    gap: 23px;
    margin: 20px 0;
    align-items: center;
  }

  .profil-edit-form
  {
    flex: 3;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    max-height: 34vw;
  }
  .profil-password-form {
    flex: 0.5;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    max-height: 34vw;
    margin: 0 auto;

  }
  .profil-info{
    flex: 2;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    .article-image{
      width: 41.65%;
      border-radius: 20%;
      margin: 0 auto;
    }
    .profil-name {
      padding-top: 20px;
      font-size: 22px;
      color: #2c3e50;
      margin: 0 auto;
    }
    .profil-role {
      color: #7f8c8d;
      margin: 0 auto;
    }
  }

  .profil-actions {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 10px;

    button {
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;

      &.btn-delete {
        background-color: $cyellow;
      }

      &.btn-logout {
        background-color: #34495e;
      }

      &.btn-save {
        background-color: $cyellow;
      }

      &.btn-cancel {
        background-color: #e74c3c;
      }

      &:hover {
        opacity: 0.9;
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;

    .modal-content {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      text-align: center;

      .btn-modal-close {
        margin-top: 10px;
        padding: 10px 15px;
        border: none;
        background-color: #e74c3c;
        color: white;
        cursor: pointer;
        border-radius: 4px;
      }
    }
  }

  .error-message {
    color: red;
    font-size: 16px;
    margin-bottom: 20px;
  }

  .loading {
    color: #2c3e50;
    font-size: 18px;
  }

  input {
    margin: 10px 0;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-weight: 600;
  }
}
</style>
