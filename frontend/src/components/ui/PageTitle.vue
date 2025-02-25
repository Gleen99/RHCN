<script setup lang="ts">
import {type Slots, useSlots} from "vue";

const props = defineProps<{
  type?: "icon" | "underline" | "default" | "underlineBleu";
}>();

const slots: Slots = useSlots();
</script>

<template>
  <div class="PageTitle" :class="type">
    <!-- Titre avec icône -->
    <div v-if="type === 'icon'" class="title with-icon">
      <div class="icon" v-if="slots.icon">
        <slot name="icon" />
      </div>
      <slot />
    </div>

    <!-- Titre souligné -->
    <div v-else-if="type === 'underline'" class="title underline">
      <slot />
    </div>
    
    <!-- Titre souligné bleu -->
    <div v-else-if="type === 'underlineBleu'" class="title underlineBleu">
      <slot />
    </div>
    
    <!-- Titre par défaut -->
    <div v-else class="title">
      <slot />
    </div>

    <!-- Sous-titre (optionnel) -->
    <div v-if="slots.subtitle" class="subtitle">
      <slot name="subtitle" />
    </div>
  </div>
</template>

<style lang="scss">
.PageTitle {
  color: $cyellow;
  margin-bottom: $gap;

  .title {
    font-size: $fsbig;
    font-family: $Arial;
    font-weight: $fbold;
  

    &.with-icon {
      display: flex;
      align-items: center;
      gap: 10px;

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &.underline {
      border-bottom: 3px solid $cyellow;
      padding-bottom: 5px;
      width: fit-content;
    
    } 

    &.underlineBleu {
      padding-bottom: 5px;
      color: $cdark-blue-gray;
      border-bottom: 3px solid $cdark-blue-gray;
      width: fit-content;
      font-weight: 500;
    }
  }

  .subtitle {
    margin-top: 5px;
    font-size: $fsmedium;
    font-weight: $fregular;
  }
}
</style>
