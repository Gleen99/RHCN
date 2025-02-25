<script setup lang="ts">
import { ref, computed } from "vue";
import IDocumenLoader from "@/components/images/IDocumenLoader.vue";
import FieldLayout from "@/components/forms/FieldLayout.vue";

const props = defineProps<{
  value?: { name?: string; mimetype?: string } | null;
  name: string;
  maxFileSize?: number;
  placeholder: string;
  label?: string;
  mandatory?: boolean;
  extra?: string;
}>();

const emit = defineEmits<{
  (event: "onChange", fileData: { name: string; content: string; mimetype: string, uploaderName: string }): void;
  (event: "onError", error: string, uploaderName: string): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const errorMessage = ref<string | null>(null);

const acceptedFormats = ref<string>("image/*,application/pdf");

const selectedFileName = ref<string | null>(null);

const fileName = computed(() => selectedFileName.value || props.value?.name || null);

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];

    // Vérifier le type de fichier
    if (!acceptedFormats.value.split(",").some((format) => file.type.includes(format.replace("*", "")))) {
      errorMessage.value = `Type de fichier invalide. Formats acceptés: ${acceptedFormats.value.replace(/,/g, ", ")}`;
      emit("onError", errorMessage.value, props.name);
      return;
    }

    // Vérifier la taille du fichier
    const maxSize = props.maxFileSize || 5 * 1024 * 1024; // Par défaut, 5 Mo
    if (file.size > maxSize) {
      errorMessage.value = `La taille du fichier dépasse ${(maxSize / (1024 * 1024)).toFixed(2)} Mo.`;
      emit("onError", errorMessage.value, props.name);
      return;
    }

    // Effacer les erreurs précédentes
    errorMessage.value = null;

    // Mettre à jour le nom du fichier sélectionné
    selectedFileName.value = file.name;

    // Lire le contenu du fichier
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = {
        name: file.name,
        content: reader.result as string,
        mimetype: file.type,
        uploaderName: props.name, // Ajout de l'identifiant de l'instance
      };
      emit("onChange", fileData);
    };
    reader.readAsDataURL(file);
  }
}

</script>

<template>
  <FieldLayout
      class="DocumentUploader"
      :name="props.name"
      :mandatory="props.mandatory"
      :label="props.label"
      :extra="props.extra"
  >
    <div class="document-uploader">
      <label :for="'file-upload-' + props.name" class="file-label">
        <input
            :id="'file-upload-' + props.name"
            type="file"
            ref="fileInput"
            :accept="acceptedFormats"
            @change="handleFileChange"
        />
        <!-- Affiche le nom du fichier s'il existe, sinon affiche le placeholder -->
        <span v-if="fileName" class="file-name">{{ fileName }}</span>
        <span v-else class="placeholder-text">{{ props.placeholder }}</span>
      </label>

      <IDocumenLoader class="icon-document"></IDocumenLoader>

      <!-- Message d'erreur -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </FieldLayout>
</template>

<style lang="scss">
.document-uploader {
  position: relative;
  display: flex;
  align-items: center;

  input {
    display: none;
  }

  .file-label {
    display: block;
    appearance: none;
    border: $cDark-steel-Blue solid 1px;
    border-radius: 20px;
    padding: 16px 26px;
    font-family: $Arial;
    font-size: $fsform;
    color: $cformText;
    background-color: transparent;
    outline: none;
    width: 100%;
    line-height: 1.3em;
  }

  .placeholder-text {
    font-style: italic;
    color: #aaa;
  }

  .icon-document {
    position: absolute;
    right: 16px;
    pointer-events: none;
    color: $cDark-steel-Blue;
    font-size: 18px;
    width: 23px;

    &:hover {
      color: $cmainColor;
    }
  }

  .error-message {
    margin-top: 8px;
    color: red;
    font-size: 12px;
  }

  .file-name {
    font-weight: bold;
    color: #333;
  }
}
</style>