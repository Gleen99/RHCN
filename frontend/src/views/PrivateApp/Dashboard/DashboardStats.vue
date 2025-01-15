<script setup lang="ts">
import { ref } from 'vue';

// Données des statistiques
const userStats = ref({
  totalUsers: 1000,
  activeUsers: 850,
  newUsers: 120,
  revenue: 20000,
});
</script>

<template>
  <!-- Statistiques -->
  <div class="stats">
    <div class="card">
      <h3>Utilisateurs Totaux</h3>
      <p>{{ userStats.totalUsers }}</p>
    </div>
    <div class="card">
      <h3>Utilisateurs Actifs</h3>
      <p>{{ userStats.activeUsers }}</p>
    </div>
    <div class="card">
      <h3>Nouveaux Utilisateurs</h3>
      <p>{{ userStats.newUsers }}</p>
    </div>
    <div class="card">
      <h3>Revenu</h3>
      <p>${{ userStats.revenue }}</p>
    </div>
  </div>
</template>

<style lang="scss">
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.card p {
  font-size: 22px;
  color: #2c3e50;
  margin: 0;
}
</style>
