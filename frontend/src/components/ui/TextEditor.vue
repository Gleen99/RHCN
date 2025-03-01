<script setup lang="ts">
import { ref, watch, PropType } from "vue";
import { QuillEditor, Delta } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import Quill from "quill";

// 📌 Définir `modelValue` pour supporter `string | Delta`
const props = defineProps({
  modelValue: {
    type: [String, Object] as PropType<string | Delta>,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const content = ref<string | Delta>(props.modelValue || "");

// 📌 Options de l'éditeur Quill
const editorOptions = ref({
  placeholder: "Ajoutez du contenu ici...",
  theme: "snow",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: 1 }, { header: 2 }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
  },
});

// 📌 Convertir Delta en Markdown (pour l'enregistrement)
function deltaToMarkdown(delta: any): string {
  return deltaToMarkdown(delta.ops);
}

// 📌 Convertir Delta en HTML (pour affichage)
function deltaToHtml(delta: any): string {
  const tempDiv = document.createElement("div");
  const tempQuill = new Quill(tempDiv);
  tempQuill.setContents(delta);
  return tempQuill.root.innerHTML;
}

// 📌 Gérer les changements de `modelValue`
watch(
    () => props.modelValue,
    (newValue) => {
      if (!newValue) {
        content.value = "";
        return;
      }

      if (typeof newValue === "object" && "ops" in newValue) {
        content.value = deltaToHtml(newValue); // Convertir Delta en HTML pour affichage
      } else {
        content.value = newValue;
      }
    },
    { deep: true }
);

// 📌 Convertir Delta en Markdown avant de sauvegarder
watch(content, (newValue) => {
  if (typeof newValue === "object" && "ops" in newValue) {
    const markdownContent = deltaToMarkdown(newValue);
    emit("update:modelValue", markdownContent); // Stocker en Markdown
  } else {
    emit("update:modelValue", newValue);
  }
});
</script>

<template>
  <div>
    <QuillEditor v-model:content="content" :options="editorOptions" />
  </div>
</template>

<style>
/* Import des styles Quill */
@import "@vueup/vue-quill/dist/vue-quill.snow.css";
</style>
