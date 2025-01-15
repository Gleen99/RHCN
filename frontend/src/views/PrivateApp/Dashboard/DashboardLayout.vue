<script setup lang="ts">
import { Routes } from "@/enums";
</script>

<template>
    <div class="dashboard">
      <div class="sidebar">
        <div class="sidebar-link-content">
          <router-link :to="{ name: Routes.dashboard }" class="link">Accueil</router-link>
          <router-link :to="{ name: Routes.collaborateurs }" class="link">Collaborateurs</router-link>
          <router-link :to="{ name: Routes.invitation }" class="link">Invitation</router-link>
          <router-link :to="{ name: Routes.profil }" class="link">Profil</router-link>
          <router-link :to="{ name: Routes.faq }" class="link">FAQ</router-link>
          <router-link :to="{ name: Routes.members }" class="link">Members</router-link>
          <router-link :to="{ name: Routes.articles }" class="link">Articles</router-link>
          <router-link :to="{ name: Routes.category }" class="link">Catégories</router-link>
          <router-link :to="{ name: Routes.images }" class="link">Images</router-link>
          <router-link :to="{ name: Routes.eventsdashboard }" class="link">Evènements</router-link>
        </div>
      </div>
  
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </template>
  

  
  <style lang="scss">
  .dashboard {
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

  
  
  .link {
    display: block;
    margin: 20px 0;
    cursor: pointer;
    color: white;
    padding: 10px;
    font-family: $Roboto;
  }
  
  .link:hover {
    background-color: #34495e;
    padding-left: 10px;
  }
}
  .main-content {
    flex: 1;
    background-color: #ecf0f1;
    padding: 20px;
    overflow-y: auto;
  }
  </style>
  