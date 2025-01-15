<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/composition/authStore';
import { useApi } from '@/composition/api';
import { IUserDB } from '@shared/crudTypes';
import router from '@/router';
import { Routes } from '@/enums';

const { GetUser, PutUser, DeleteUser, logout } = useApi();
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
        user.value = { ...user.value, ...updatedData };
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
       
        // Envoyer uniquement le mot de passe mis à jour
        await PutUser({ password: newPassword.value }, user.value._id);

        changedPassword.value = newPassword.value; // Stocker temporairement le mot de passe modifié
        showModalWithMessage(`Mot de passe modifié avec succès : ${changedPassword.value}`); // Afficher le mot de passe
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
    await router.push({ name: Routes.login });
    showModalWithMessage('Déconnexion réussie.');
};
onMounted(fetchUser);
</script>

<template>
    <div class="profil">
        <h1>Mon Profil</h1>
        <div v-if="error" class="error">{{ error }}</div>

        <div v-if="!loading && user">
            <div class="user-info-content">
                <div v-if="!editMode">
                    <div class="user-info"><strong>Nom :</strong> {{ user.firstname }}</div>
                    <div class="user-info"><strong>Prénom :</strong> {{ user.lastname }}</div>
                    <div class="user-info"><strong>Email :</strong> {{ user.email }}</div>
                    <div class="user-info"><strong>Rôle :</strong> {{ user.role }}</div>
                    <div class="actions">
                        <button @click="editMode = true" class="btn-edit">Modifier</button>
                        <button @click="deleteUser" class="btn-delete">Supprimer mon compte</button>
                        <button @click="logoutUser" class="btn-logout">Se déconnecter</button>
                        <button @click="changePasswordMode = true" class="btn-password">Modifier le mot de passe</button>
                    </div>
                </div>

                <div v-else class="edit-mode">
                    <h2>Modifier votre profil</h2>
                    <label>Nom :</label>
                    <input v-model="user.firstname" placeholder="Nom" />
                    <label>Prénom :</label>
                    <input v-model="user.lastname" placeholder="Prénom" />
                    <label>Email :</label>
                    <input v-model="user.email" placeholder="Email" />
                    <div class="actions">
                        <button @click="updateUser" class="btn-save">Enregistrer</button>
                        <button @click="editMode = false" class="btn-cancel">Annuler</button>
                    </div>
                </div>
            </div>

            <div v-if="changePasswordMode" class="password-change">
                <h2>Modifier le mot de passe</h2>
                <label>Nouveau mot de passe :</label>
                <input type="password" v-model="newPassword" placeholder="Nouveau mot de passe" />
                <label>Confirmer le mot de passe :</label>
                <input type="password" v-model="confirmPassword" placeholder="Confirmer le mot de passe" />
                <div class="actions">
                    <button @click="changePassword" class="btn-save">Changer</button>
                    <button @click="changePasswordMode = false" class="btn-cancel">Annuler</button>
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
.profil {
    padding: 20px;

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

    h1 {
        color: #2c3e50;
        font-size: 24px;
        margin-bottom: 20px;
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

    .user-info-content,
    .edit-mode-content,
    .password-change {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;

        .user-info,
        .edit-mode {
            margin: 15px;
            font-weight: 600;
            h2 {
            color: #2c3e50;
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: 600;
        }
        }

    }

    .password-change {
        h2 {
            color: #2c3e50;
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: 600;
        }
        label{
            font-weight: 600;
        }
    }




    .edit-mode input,
    .password-change input {
        margin: 15px;
        font-weight: 600;
        display: block;
        width: 100%;
        margin: 10px 0;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    .actions {
        display: flex;
        gap: 10px;

        button {
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;

            &.btn-edit {
                background: #3498db;
            }

            &.btn-delete {
                background: #e74c3c;
            }

            &.btn-logout {
                background: #34495e;
            }

            &.btn-password {
                background: #f39c12;
            }

            &.btn-save {
                background: #27ae60;
            }

            &.btn-cancel {
                background: #e74c3c;
            }

            &:hover {
                opacity: 0.9;
            }
        }
    }
}
</style>
