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

function deltaToCustomFormat(delta: any): any {
  return delta.ops.map((op: any) => {
    if (op.insert && typeof op.insert === "string") {
      let text = op.insert;

      // Vérifier les styles de texte
      let formattedText = text;
      if (op.attributes) {
        if (op.attributes.bold) {
          formattedText = `<strong>${formattedText}</strong>`;
        }
        if (op.attributes.italic) {
          formattedText = `<em>${formattedText}</em>`;
        }
        if (op.attributes.underline) {
          formattedText = `<u>${formattedText}</u>`;
        }
        if (op.attributes.strike) {
          formattedText = `<s>${formattedText}</s>`;
        }
      }

      // Gestion des titres
      if (op.attributes?.header === 1) {
        return { blockName: "block-title1", text: `<h1>${formattedText}</h1>` };
      }
      if (op.attributes?.header === 2) {
        return { blockName: "block-title2", text: `<h2>${formattedText}</h2>` };
      }

      // Gestion des listes
      if (op.attributes?.list === "ordered") {
        return { blockName: "block-list-ordered", text: `<li>${formattedText}</li>` };
      }
      if (op.attributes?.list === "bullet") {
        return { blockName: "block-list-unordered", text: `<li>${formattedText}</li>` };
      }

      // Paragraphe normal
      return { blockName: "block-paragraph", text: `<p>${formattedText}</p>` };
    }

    // Gestion des images
    if (op.insert && typeof op.insert === "object" && op.insert.image) {
      return { blockName: "block-image", path: op.insert.image };
    }

    return null;
  }).filter(Boolean);
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
    <QuillEditor v-model:content="content" :options="editorOptions" />
  </div>
</template>

<style>
@import "@vueup/vue-quill/dist/vue-quill.snow.css";
</style>