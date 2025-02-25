<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApi } from '@/composition/api';
import { Routes } from '@/enums';

const { acceptInvitation } = useApi();
const route = useRoute();
const router = useRouter();


const email = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const handleAcceptInvitation = async () => {
    try {
        await acceptInvitation({
            token: route.query.token,
            email: email.value,
            password: password.value,
        });
        successMessage.value = "Compte créé avec succès.";
        router.push({name: Routes.login});
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || "Erreur lors de la création du compte.";
    }
};
</script>

<template>
  <div>
    <h1>Créer un mot de passe</h1>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <button @click="handleAcceptInvitation">Créer mon compte</button>
    <div v-if="errorMessage">{{ errorMessage }}</div>
    <div v-if="successMessage">{{ successMessage }}</div>
  </div>
</template>
