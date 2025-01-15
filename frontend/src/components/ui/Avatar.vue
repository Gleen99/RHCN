<script setup lang="ts">
import IllusAvatar from '../images/IllusAvatar.vue';

const props = defineProps<{
  pictureUrl?: string; // URL de l'image à afficher
}>();

</script>

<template>
  <div class="Avatar">
    <div class="picture-inner">
      <img v-if="pictureUrl" :src="pictureUrl" alt="image" crossorigin="anonymous" />
      <IllusAvatar v-else />
    </div>
  </div>
</template>

<style lang="scss">
.Avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px; /* Taille fixe ou ajustable */
  height: 100px;
  border-radius: 50%; /* Cercle parfait */
  overflow: hidden;

  .picture-inner {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover; /* S'adapte bien au conteneur */
    }
  }
}
</style>
