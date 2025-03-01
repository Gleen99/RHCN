<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/composition/authStore";

const authStore = useAuthStore();

const userFirstname = computed(() => authStore.user?.firstname || "");
const userLastname = computed(() => authStore.user?.lastname || "");
const userRole = computed(() => authStore.user?.role || "guest"); // Récupérer le rôle
</script>

<template>
  <div class="dashboard">
    <div class="header">
      <h1>{{ userFirstname }} {{ userLastname }}</h1>
      <h2>Tableau de bord</h2>
      <p>Rôle: <strong>{{ userRole }}</strong></p>
    </div>

    <router-view />
  </div>
</template>

<style lang="scss">
.dashboard {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  background-color: #ecf0f1;
  padding: 20px;
  overflow-y: auto;
}

.header {
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
}

.header p {
  color: #7f8c8d;
}
</style>