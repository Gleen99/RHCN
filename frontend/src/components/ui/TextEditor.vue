<script setup lang="ts">
import { ref, watch } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

// Props pour gérer le contenu
const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

// État local pour le contenu
const content = ref(props.modelValue || "");

// Configuration étendue pour l'éditeur
const editorOptions = {
  placeholder: "Ajoutez du contenu ici...",
  theme: "snow",
  modules: {
    toolbar: [
      // Style de texte
      ["bold", "italic", "underline", "strike"],

      // En-têtes
      [{ header: 1 }, { header: 2 }],

      // Alignement
      [{ align: [] }],

      // Listes
      [{ list: "ordered" }, { list: "bullet" }],

      // Indentations
      [{ indent: "-1" }, { indent: "+1" }],

      // Sous/sur-indices
      [{ script: "sub" }, { script: "super" }],

      // Couleurs de texte et de fond
      [{ color: [] }, { background: [] }],

      // Liens et images
      ["link", "image"],

      // Nettoyer la mise en forme
      ["clean"],
    ],
  },
};

// Synchronisation entre le parent et l'état local
watch(
    () => props.modelValue,
    (newValue) => {
      if (content.value !== newValue) {
        content.value = newValue || "";
      }
    }
);

watch(content, (newValue) => {
  if (props.modelValue !== newValue) {
    emit("update:modelValue", newValue);
  }
});
</script>

<template>
  <div>
    <!-- Éditeur de texte enrichi -->
    <QuillEditor
        v-model="content"
        :options="editorOptions"
    />
  </div>
</template>

<style>
/* Import des styles Quill */
@import "@vueup/vue-quill/dist/vue-quill.snow.css";
</style>
