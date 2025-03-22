<script setup lang="ts">
import { computed } from "vue";
import { Routes } from "@/enums";
import { useAuthStore } from "@/composition/authStore";

// Récupérer le store d'authentification
const authStore = useAuthStore();
const userRole = computed(() => authStore.user?.role || "guest");

// Définition des routes avec les rôles associés
const sidebarLinks = computed(() => {
  const links = [
    { name: Routes.profil, label: "Accueil", roles: ["admin", "editor", "contributor"] },
    { name: Routes.collaborateurs, label: "Collaborateurs", roles: ["admin"] },
    { name: Routes.invitation, label: "Invitation", roles: ["admin"] },
    { name: Routes.faq, label: "FAQ", roles: ["admin", "editor", "contributor"] },
    { name: Routes.members, label: "Members", roles: ["admin"] },
    { name: Routes.articles, label: "Articles", roles: ["admin", "editor", "contributor"] },
    { name: Routes.category, label: "Catégories", roles: ["admin", "editor"] },
    { name: Routes.images, label: "Images", roles: ["admin", "editor"] },
    { name: Routes.eventsdashboard, label: "Évènements", roles: ["admin", "editor"] },
    { name: Routes.partenairesIcons, label: "Partenaires-Icons", roles: ["admin", "editor"] },
  ];

  // Filtrer les liens en fonction du rôle de l'utilisateur
  return links.filter(link => link.roles.includes(userRole.value));
});
</script>

<template>
  <div class="dashboardLayout">
    <div class="sidebar">

      <div class="sidebar-link-content">
        <div class="header__logo">
          <img src="../../../assets/Footer.png" class="Logoimg"/>
        </div>
        <router-link
            v-for="link in sidebarLinks"
            :key="link.name"
            :to="{ name: link.name }"
            class="link"
        >
          {{ link.label }}
        </router-link>
      </div>
    </div>

    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
.dashboardLayout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-link-content {
  .Logoimg {
    width: 100%;
    margin-bottom: 1rem;
  }
  .link {
    display: block;
    margin: 20px 0;
    cursor: pointer;
    color: white;
    padding: 10px;
  }

  .link:hover {
    background-color: #34495e;
    padding-left: 10px;
    border-radius: 4px;
    color: #f1c40f;
    transition: all 0.3s ease;
  }
}

.main-content {
  flex: 1;
  background-color: #ecf0f1;
  padding: 20px;
  overflow-y: auto;
}
</style>