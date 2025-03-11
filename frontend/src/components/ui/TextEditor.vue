<script setup lang="ts">
import { ref, watch, PropType } from "vue";
import { QuillEditor, Delta } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const props = defineProps({
  modelValue: {
    type: [String, Object] as PropType<string | Delta>,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
const content = ref<string | Delta>(props.modelValue || "");

const editorOptions = ref({
  placeholder: "Ajoutez du contenu ici...",
  theme: "snow",
  formats: [
    "bold", "italic", "underline", "strike", "header",
    "list", "bullet", "align", "blockquote", "code-block",
    "link", "image", "video"
  ],
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // Gras, Italique, Souligné, Barré
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // Titres H1-H6
      [{ align: [] }], // Alignements
      [{ list: "ordered" }, { list: "bullet" }], // Listes
      ["link", "image"], // Liens, Images, Vidéos
      ["clean"], // Nettoyage de mise en forme
    ],
  },
});

function deltaToCustomFormat(delta: any): any {
  return delta.ops.reduce((acc: any[], op: any) => {
    if (op.insert && typeof op.insert === "string") {
      let text = op.insert.trim();
      let attributes = op.attributes || {};

      // Appliquer les styles de texte correctement en HTML
      if (attributes.bold) text = `<strong>${text}</strong>`;
      if (attributes.italic) text = `<em>${text}</em>`;
      if (attributes.underline) text = `<u>${text}</u>`;
      if (attributes.strike) text = `<s>${text}</s>`;

      // Gestion des titres (H1-H6)
      if (attributes.header) {
        acc.push({ blockName: `block-title${attributes.header}`, text: `<h${attributes.header}>${text}</h${attributes.header}>` });
        return acc;
      }

      // Gestion des listes (ordonnées et à puces)
      if (attributes.list) {
        const listType = attributes.list === "ordered" ? "ordered" : "unordered";
        acc.push({ blockName: `block-list-${listType}`, text: `<li>${text}</li>` });
        return acc;
      }

      // Ajout des paragraphes normaux avec un balisage `<p>`
      if (text) {
        acc.push({ blockName: "block-paragraph", text: `<p>${text}</p>` });
      }
      return acc;
    }

    // Gestion des images
    if (op.insert && typeof op.insert === "object" && op.insert.image) {
      acc.push({ blockName: "block-image", text: "Image", path: op.insert.image });
    }

    return acc;
  }, []);
}
watch(
    () => props.modelValue,
    (newValue) => {
      if (!newValue) {
        content.value = "";
        return;
      }
      if (typeof newValue === "object" && "ops" in newValue) {
        content.value = newValue;
      } else {
        content.value = newValue;
      }
    },
    { deep: true }
);

watch(content, (newValue) => {
  if (typeof newValue === "object" && "ops" in newValue) {
    const formattedContent = {
      content: deltaToCustomFormat(newValue),
    };
    emit("update:modelValue", formattedContent);
  } else {
    emit("update:modelValue", newValue);
  }
});
</script>

<template>
  <div>
    <QuillEditor v-model:content="content" :options="editorOptions" contentType="html" />
  </div>
</template>

<style>
@import "@vueup/vue-quill/dist/vue-quill.snow.css";
.ql-editor strong {
  font-weight: bold;
}
.ql-editor em {
  font-style: italic;
}
.ql-editor u {
  text-decoration: underline;
}
.ql-editor s {
  text-decoration: line-through;
}
</style>