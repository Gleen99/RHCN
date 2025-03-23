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

</script>

<template>
  <div class="dashboard">

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


  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }


}
</style>