<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
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

// Modal state
const showModal = ref(false);
const invitationToDelete = ref<string | null>(null);

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
    errorMessage.value = '';
    resetForm();
    await fetchInvitations();
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de l\'envoi de l\'invitation.';
    successMessage.value = '';
  }
};

// Popin-triggered deletion
const confirmDeleteInvitation = (id: string) => {
  invitationToDelete.value = id;
  showModal.value = true;
};

const cancelDelete = () => {
  showModal.value = false;
  invitationToDelete.value = null;
};

const handleConfirmedDelete = async () => {
  if (!invitationToDelete.value) return;

  try {
    await deleteInvitation(invitationToDelete.value);
    successMessage.value = 'Invitation supprimée avec succès.';
    errorMessage.value = '';
    await fetchInvitations();
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la suppression de l\'invitation.';
    successMessage.value = '';
  } finally {
    showModal.value = false;
    invitationToDelete.value = null;
  }
};

const resetForm = () => {
  email.value = '';
  firstname.value = '';
  lastname.value = '';
  role.value = 'user';
};

// Auto-clear messages
watch([errorMessage, successMessage], () => {
  if (errorMessage.value || successMessage.value) {
    setTimeout(() => {
      errorMessage.value = '';
      successMessage.value = '';
    }, 4000);
  }
});
const translateRole = (role: string) => {
  switch (role) {
    case 'editor':
      return 'Éditeur';
    case 'contributor':
      return 'Contributeur';
    case 'admin':
      return 'Administrateur';
    default:
      return role;
  }
};
onMounted(fetchInvitations);
</script>

<template>
  <div class="invitations">
    <h1>Invitations</h1>

    <div class="invitations-header">
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>

      <div class="form">
        <input v-model="firstname" placeholder="Prénom" />
        <input v-model="lastname" placeholder="Nom de famille" />
        <input v-model="email" placeholder="Email" type="email" />
        <select v-model="role">
          <option value="editor">Éditeur</option>
          <option value="contributor">Contributeur</option>
          <option value="admin">Administrateur</option>
        </select>
        <button @click="handleCreateInvitation" class="handleCreateInvitation">Envoyer</button>
      </div>
    </div>

    <div class="invitations-content">
      <ul v-if="invitations.length > 0" class="invitation-list">
        <li v-for="invitation in invitations" :key="invitation._id">
  <span class="invitation-list-item">
    {{ invitation.firstname }} {{ invitation.lastname }}
    <em> {{ invitation.email }} </em>
 <em class="role"> {{ translateRole(invitation.role) }} </em>
    <span :class="['badge', invitation.status]">{{ invitation.status }}</span>
  </span>

          <!-- ✅ Ne s'affiche que si le statut n'est pas "accepted" -->
          <button
              v-if="invitation.status !== 'accepted'"
              @click="confirmDeleteInvitation(invitation._id)"
          >
            Supprimer
          </button>
        </li>
      </ul>

      <div v-else class="no-invitations">Aucune invitation trouvée.</div>
    </div>

    <!-- Confirmation Modal -->
    <teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h3>Confirmer la suppression</h3>
          <p>Es-tu sûr de vouloir supprimer cette invitation ?</p>
          <div class="modal-actions">
            <button @click="handleConfirmedDelete" class="confirm">Oui, supprimer</button>
            <button @click="cancelDelete" class="cancel">Annuler</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style lang="scss">
.invitations {
  padding: 20px;


  .invitations-header,
  .invitations-content {
    padding: 30px;
    margin: 12px;
    box-shadow: 0 2px 5px white;
    border-radius: 16px;
  }

  .form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 30px;

    input,
    select {
      font-family: $Arial;
      padding: 12px 16px;
      font-size: 15px;
      border: 1px solid #ccc;
      border-radius: 10px;
      transition: all 0.3s ease;
      background-color: #fdfdfd;

      &:focus {
        border-color: #3498db;
        box-shadow: 0 0 6px rgba(52, 152, 219, 0.4);
        outline: none;
      }
    }

    select {
      background-color: white;
    }

    button {
      grid-column: span 2;
      padding: 12px;
      background-color: #2c3e50;
      margin: 0 auto;
      color: white;
      font-weight: 600;
      font-size: 16px;
      font-family: $Arial;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: background-color 0.3s ease;

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
      background: #f8f9fa;
      padding: 12px 20px;
      margin-bottom: 12px;
      border-radius: 10px;
      border: 1px solid #e1e1e1;

      span {
     display: flex;
        justify-content: space-between;
        gap:23px;
        .role{
          color:$cyellow;
          font-weight: bold;
          text-transform: uppercase;
        }

        .badge {
          display: inline-block;
          padding: 4px 8px;
          margin-left: 10px;
          font-size: 12px;
          font-weight: bold;
          border-radius: 12px;
          color: white;
          width: fit-content;
          text-transform: uppercase;
          &.pending {
            background-color: #f39c12;
          }
          &.accepted {
            background-color: #2ecc71;
          }
          &.rejected {
            background-color: #e74c3c;
          }
          &.cancelled {
            background-color: #2c3e50;
          }
        }
      }

      button {
        padding: 6px 12px;
        background-color: #e74c3c;
        color: white;
        font-size: 14px;
        font-family: $Arial;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #c0392b;
        }
      }
    }
  }

  .error,
  .success {
    text-align: center;
    font-weight: bold;
    margin-bottom: 20px;
    font-size: 16px;
    padding: 10px;
    border-radius: 8px;
  }

  .error {
    color: #c0392b;
    background-color: #fdecea;
  }

  .success {
    color: #27ae60;
    background-color: #e8f8f5;
  }

  .no-invitations {
    text-align: center;
    font-size: 16px;
    color: #7f8c8d;
    margin-top: 20px;
  }
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .modal {
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 400px;
    text-align: center;

    h3 {
      margin-bottom: 15px;
      font-size: 20px;
    }

    p {
      margin-bottom: 20px;
      font-size: 16px;
      color: #333;
    }

    .modal-actions {
      display: flex;
      justify-content: space-between;

      button {
        padding: 10px 20px;
        font-weight: bold;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 14px;

        &.confirm {
          background-color: #e74c3c;
          color: white;

          &:hover {
            background-color: #c0392b;
          }
        }

        &.cancel {
          background-color: #bdc3c7;
          color: #2c3e50;

          &:hover {
            background-color: #95a5a6;
          }
        }
      }
    }
  }
}
</style>