<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  value: Object,
});

const emit = defineEmits(['onChange']);

const fileInput = ref<File | null>(null);

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const thumbnail = reader.result as string;
      const fileData = {
        path: file.name,
        thumbnail,
        mimetype: file.type,
      };
      emit("onChange", fileData);
    };
    reader.readAsDataURL(file);
  }
}
</script>

<template>
  <div class="picture-loader">
    <input type="file" @change="handleFileChange" />
    <div v-if="value?.thumbnail">
      <img :src="value.thumbnail" alt="Preview" class="image-preview" />
    </div>
  </div>
</template>

<style lang="scss">
.picture-loader {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .image-preview {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
    border-radius: 4px;
  }
}
</style>
