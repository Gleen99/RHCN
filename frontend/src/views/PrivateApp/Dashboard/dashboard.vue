<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/composition/authStore";
import Profil from "@/components/PrivateApp/Dashboard/profil/Profil.vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();

const userFirstname = computed(() => authStore.user?.firstname || "");
const userLastname = computed(() => authStore.user?.lastname || "");
const userRole = computed(() => authStore.user?.role || "guest");

const router = useRouter();
const today = new Date().toLocaleDateString("fr-FR", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

function goHome() {
  router.push("/");
}
</script>

<template>
  <div class="dashboard">
    <div class="header">
      <h1 class="dashboard-title">Dashboard de RHCN</h1>
      <div class="dashboard-header">
        <div @click="goHome">🌐 Allez sur le Site web</div>
        <span class="date">{{ today }}</span>
      </div>
    </div>
    <Profil/>
    <router-view />
  </div>
</template>

<style lang="scss">
.dashboard {
  .dashboard-title {
    font-size: 24px;
    font-weight: bold;
    margin: 20px;
  }
  .dashboard-header{
    display: flex;
    gap:23px
  }

  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }

  .header {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      margin-right: 20px;
      padding: 10px 15px;
      cursor: pointer;
    }

    .date {
      font-weight: bold;
    }
  }
}
</style>