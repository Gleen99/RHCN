<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  // Déclaration de Tawk_API correctement avec TypeScript
  const Tawk_API: any = (window as any).Tawk_API || {};
  const Tawk_LoadStart = new Date();

  (function () {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/67a7601a3a842732607bdd57/1ijisupsj";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.head.appendChild(script);
  })();
});
</script>

<template>
</template>

<style scoped lang="scss">
/* Ajoute tes styles ici */
</style>