<script setup lang="ts">

import PublicMenu from "@/components/layout/PublicMenu.vue";
import PublicFooter from "@/components/layout/PublicFooter.vue";

</script>

<template>
    <div class="PublicTemplate">
        <public-menu/>
        <div class="content">
            <slot/>
        </div>
		<public-footer/>
    </div>
</template>

<style lang="scss">
.PublicTemplate {
  position: relative;
  .content {

    min-height: calc(100vh - $publicMenuHeight - $publicFooterHeight - 3 * $gap);

  }
  .container {
    margin: 0 6.4rem;
    @include desktopMax {
      margin: 0 10rem;
    }
    @include mobile {
      margin: 0 1rem;
    }
  }
  .history {
    padding-top: 15rem;
  }


}
</style>