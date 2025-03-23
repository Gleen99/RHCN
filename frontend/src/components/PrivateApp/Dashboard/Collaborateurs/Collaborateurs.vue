<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useApi } from '@/composition/api';
import { IUserDB } from '@shared/crudTypes';
import { useAuthStore } from '@/composition/authStore';

const { GetAllUsers, PutUser, DeleteUser } = useApi();
const authStore = useAuthStore();

const users = ref<IUserDB[]>([]);
const loading = ref(true);
const error = ref('');
const editingUserId = ref<string | null>(null);
const updatedRole = ref<string>('');
const successMessage = ref('');
const searchQuery = ref('');

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
      await DeleteUser(userId); // Appel API
      users.value = users.value.filter(user => user._id !== userId);
      successMessage.value = 'Utilisateur supprimé avec succès.';
      setTimeout(() => (successMessage.value = ''), 3000);
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
    authStore.updateUserData(response);
    const userIndex = users.value.findIndex(user => user._id === editingUserId.value);
    if (userIndex !== -1) {
      users.value[userIndex].role = updatedRole.value;
    }
    successMessage.value = 'Rôle mis à jour avec succès !';
    setTimeout(() => (successMessage.value = ''), 3000);
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

const isCurrentUser = (userId: string) => authStore.user?.email === userId;

const userCount = computed(() => users.value.filter(u => u.role === 'user').length);
const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length);
const editorCount = computed(() => users.value.filter(u => u.role === 'editor').length);

const filteredUsers = computed(() =>
    users.value.filter(user =>
        `${user.firstname} ${user.lastname} ${user.email}`.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

onMounted(fetchUsers);
</script>

<template>
  <div class="collaborateurs">
 <div class="collaborateurs-wrapper">
   <h1>Liste des membres</h1>
   <input v-model="searchQuery" placeholder="Rechercher un utilisateur par son nom" class="search-input" />
 </div>
    <div class="stats">
      <span>🛡️ Admins : {{ adminCount }} </span>
      <span>👥 Utilisateurs : {{ userCount }}</span>
      <span>🤝 Collaborateurs : {{ editorCount }}</span>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="loading">Chargement...</div>

    <div v-if="!loading && filteredUsers.length > 0">
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
        <tr v-for="user in filteredUsers" :key="user._id">
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
              <button
                  v-if="!isCurrentUser(user._id)"
                  @click="editUserRole(user._id, user.role)"
                  class="btn-edit"
              >
                Modifier
              </button>
              <button
                  v-if="!isCurrentUser(user._id)"
                  @click="deleteUser(user._id)"
                  class="btn-delete"
              >
                Supprimer
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!loading && filteredUsers.length === 0">
      <p>Aucun membre trouvé.</p>
    </div>

    <div v-if="successMessage" class="success">{{ successMessage }}</div>
  </div>
</template>

<style lang="scss">
.collaborateurs {

.collaborateurs-wrapper{
  display: flex;
  justify-content: space-between;
  margin: 30px;
  align-items: center;
  h1 {
    color: #2c3e50;
    font-size: 24px;
    margin-bottom: 20px;
  }
  .search-input {
    width: 100%;
    max-width: 400px;
    padding: 12px 40px 12px 16px;
    font-size: 16px;
    border: 2px solid $cyellow;
    border-radius: 50px;
    background-color: #fff;
    background-image: url('data:image/svg+xml;utf8,<svg fill="%23888" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16a6.471 6.471 0 004.23-1.57l.27.28v.79l5 5L20.49 19l-5-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z"/></svg>');
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 20px 20px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease-in-out;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
    }
    &::placeholder{
      font-size: 12px;
      font-weight: $Arial;
    }
  }
}


  .stats {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 15px 25px;
    border-radius: 12px;
    border: 2px solid $cyellow;
    background-color: #2c3e50;
    gap: 40px;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;

    span {
      display: flex;
      align-items: center;
      gap: 8px;
      color: whitesmoke;
    }
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

  .success {
    color: #27ae60;
    font-weight: bold;
    margin-top: 15px;
    text-align: center;
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

    .btn-cancel,
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