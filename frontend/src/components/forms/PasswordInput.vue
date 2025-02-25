<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Props pour gérer l'état du mot de passe
const props = defineProps({
  value: {
    type: String,
    required: true
  },
  showPassword: {
    type: Boolean,
    default: false
  }
});

// Événements pour émettre les changements
const emit = defineEmits(['update:value', 'update:showPassword']);

const togglePasswordVisibility = () => {
  emit('update:showPassword', !props.showPassword);
};

const handleInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit('update:value', input.value);
};
</script>

<template>
    <div>
        <div>
            <label for="password">Mot de Passe</label>
        </div>
        <div class="password-input">
    <input
      :type="props.showPassword ? 'text' : 'password'"
      :value="props.value"
      @input="handleInputChange"
      placeholder="Entrez votre mot de passe"
    />
    <div class="toggle-password" @click="togglePasswordVisibility">
      <img 
        v-if="props.showPassword"
        src="../../assets/oeil.png"
        alt="Masquer le mot de passe" 
        crossorigin="anonymous"
      />
      <img 
        v-else 
        src="../../assets/oeilClose.png"
        alt="Afficher le mot de passe" 
        crossorigin="anonymous"
      />
    </div>
  </div>
    </div>
 
</template>

<style lang="scss">
.password-input {
    margin-top: 0.5rem;
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
}

.toggle-password {
  position: absolute;
  right: 10px;
  cursor: pointer;
}

.toggle-password img {
  width: 25px;
}
</style>
