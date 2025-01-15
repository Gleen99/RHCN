<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApi } from '@/composition/api';
import { IInvitationDB } from '@shared/crudTypes';

const { createInvitation, listInvitations, deleteInvitation } = useApi();

const email = ref('');
const firstname = ref('');
const lastname = ref('');
const role = ref('user');
const invitations = ref<IInvitationDB[]>([]);
const errorMessage = ref('');
const successMessage = ref('');

const fetchInvitations = async () => {
  try {
    const response = await listInvitations();
    if (response && typeof response === 'object') {
      invitations.value = Object.values(response);
    } else {
      throw new Error('Réponse inattendue de l\'API.');
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la récupération des invitations.';
  }
};

const handleCreateInvitation = async () => {
  if (!email.value || !firstname.value || !lastname.value) {
    errorMessage.value = 'Tous les champs sont requis.';
    return;
  }

  try {
    await createInvitation({
      email: email.value,
      role: role.value,
      firstname: firstname.value,
      lastname: lastname.value,
    });
    successMessage.value = 'Invitation envoyée avec succès.';
    resetForm();
    await fetchInvitations();
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de l\'envoi de l\'invitation.';
  }
};

const handleDeleteInvitation = async (id: string) => {
  try {
    await deleteInvitation(id);
    successMessage.value = 'Invitation supprimée avec succès.';
    await fetchInvitations();
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la suppression de l\'invitation.';
  }
};

const resetForm = () => {
  email.value = '';
  firstname.value = '';
  lastname.value = '';
  role.value = 'user';
};

onMounted(fetchInvitations);
</script>

<template>
  <div class="invitations">
    <h1>Invitations</h1>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success">{{ successMessage }}</div>

    <div class="form">
      <input v-model="firstname" placeholder="Prénom" />
      <input v-model="lastname" placeholder="Nom de famille" />
      <input v-model="email" placeholder="Email" type="email" />
      <select v-model="role">
        <option value="user">Utilisateur</option>
        <option value="admin">Admin</option>
      </select>
      <button @click="handleCreateInvitation">Envoyer</button>
    </div>

    <ul v-if="invitations.length > 0" class="invitation-list">
      <li v-for="invitation in invitations" :key="invitation._id">
        <span>
          {{ invitation.firstname }} {{ invitation.lastname }} - 
          {{ invitation.email }} - {{ invitation.role }} -  {{ invitation.status }}
        </span>
        <button @click="handleDeleteInvitation(invitation._id)">Supprimer</button>
      </li>
    </ul>

    <div v-else class="no-invitations">Aucune invitation trouvée.</div>
  </div>
</template>

<style lang="scss">
.invitations {
  max-width: 600px;
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

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;

    input,
    select {
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      padding: 10px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #2980b9;
      }
    }
  }

  .invitation-list {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;

      span {
        flex-grow: 1;
      }

      button {
        padding: 5px 10px;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #c0392b;
        }
      }
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

  .no-invitations {
    text-align: center;
    font-size: 16px;
    color: #7f8c8d;
  }
}
</style>
