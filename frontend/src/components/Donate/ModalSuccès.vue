<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MainButton from '../ui/MainButton.vue';
import Modal from "@/components/ui/Modal.vue";

// Traductions
const { t } = useI18n();

// Props et événements
const props = defineProps({ show: Boolean });
const emit = defineEmits(["close", "update:showSuccessModal"]);

// Variable réactive pour gérer l'affichage du modal
const showSuccessModal = ref(props.show);

// Fonction pour fermer le modal
const closeModal = () => {
  showSuccessModal.value = false;
  emit("update:showSuccessModal", false);
  emit("close");
};
</script>

<template>
  <!-- Modal de succès -->
  <Modal
      :show="showSuccessModal"
      :title="t('modal.modalSuccess.successTitle')"
      :closeButton="true"
      @close="closeModal"
  >
    <template #footer>
      <MainButton type="dimmed" @click="closeModal">
        {{ t("modal.modalSuccess.cancel") }}
      </MainButton>
    </template>
  </Modal>
</template>

<style lang="scss">

</style>