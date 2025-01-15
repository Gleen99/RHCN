<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApi } from '@/composition/api';
import { IUserDB } from '@shared/crudTypes';
import { useAuthStore } from '@/composition/authStore';
const { GetAllUsers, DeleteUser, PutUser } = useApi();

const users = ref<IUserDB[]>([]);
const loading = ref(true);
const error = ref('');
const editingUserId = ref<string | null>(null);
const updatedRole = ref<string>('');
  const authStore = useAuthStore();
const fetchUsers = async () => {
  try {
    loading.value = true;
    error.value = '';
    const response = await GetAllUsers();
    if (Array.isArray(response)) {
      users.value = response;
    } else {
      throw new Error('Réponse inattendue de l\'API');
    }
  } catch (err) {
    error.value = 'Erreur lors de la récupération des utilisateurs.';
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (userId: string) => {
  try {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      const response = await DeleteUser(userId);
      authStore.deleteUser()
      users.value = users.value.filter(user => user._id !== userId);
    }
  } catch {
    alert('Erreur lors de la suppression de l\'utilisateur.');
  }
};

const editUserRole = (userId: string, currentRole: string) => {
  editingUserId.value = userId;
  updatedRole.value = currentRole;
};

const saveUserRole = async () => {
  if (!editingUserId.value) return;
  try {
    const response = await PutUser({ role: updatedRole.value }, editingUserId.value);
    authStore.updateUserData(response)
    const userIndex = users.value.findIndex(user => user._id === editingUserId.value);
    if (userIndex !== -1) {
      users.value[userIndex].role = updatedRole.value;
    }
    editingUserId.value = null;
    updatedRole.value = '';
  } catch {
    alert('Erreur lors de la mise à jour du rôle.');
  }
};

const cancelEdit = () => {
  editingUserId.value = null;
  updatedRole.value = '';
};

onMounted(fetchUsers);
</script>

<template>
  <div class="collaborateurs">
    <h1>Liste des membres</h1>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-if="!loading && users.length > 0">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.firstname }} {{ user.lastname }}</td>
            <td>{{ user.email }}</td>
            <td>
              <div v-if="editingUserId === user._id">
                <select v-model="updatedRole">
                  <option value="admin">Admin</option>
                  <option value="editor">Éditeur</option>
                  <option value="user">Utilisateur</option>
                </select>
              </div>
              <div v-else>
                {{ user.role }}
              </div>
            </td>
            <td>
              <div class="btnContent" v-if="editingUserId === user._id">
                <button @click="saveUserRole" class="btn-save">Sauvegarder</button>
                <button @click="cancelEdit" class="btn-cancel">Annuler</button>
              </div>
              <div class="btnContent" v-else>
                <button @click="editUserRole(user._id, user.role)" class="btn-edit">Modifier</button>
                <button @click="deleteUser(user._id)" class="btn-delete">Supprimer</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading && users.length === 0">
      <p>Aucun membre trouvé.</p>
    </div>
  </div>
</template>

<style lang="scss">
.collaborateurs {
  padding: 20px;

  h1 {
    color: #2c3e50;
    font-size: 24px;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    thead {
      background-color: #2c3e50;
      color: white;
    }

    th,
    td {
      padding: 10px;
      text-align: left;
      border: 1px solid #ddd;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
  }

  .loading {
    color: #2c3e50;
    font-size: 18px;
  }

  .error {
    color: red;
    font-size: 16px;
    margin-bottom: 20px;
  }

  .btnContent {
    display: flex;
    gap: 20px;

    .btn-save,
    .btn-cancel,
    .btn-delete,
    .btn-edit {
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 4px;
      font-size: 14px;
      color: white;
      transition: background-color 0.3s ease;
    }

    .btn-save {
      background-color: #27ae60;

      &:hover {
        background-color: #229954;
      }
    }

    .btn-cancel {
      background-color: #e74c3c;

      &:hover {
        background-color: #c0392b;
      }
    }

    .btn-delete {
      background-color: #e74c3c;

      &:hover {
        background-color: #c0392b;
      }
    }

    .btn-edit {
      background-color: #3498db;

      &:hover {
        background-color: #2980b9;
      }
    }
  }
}
</style>
