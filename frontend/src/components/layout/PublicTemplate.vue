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
  .container {
    margin: 0 5.8rem;
    @include desktopMax {
      margin: 0 10rem;
    }
  }
  .history {
    padding-top: 15rem;
  }

	.PublicFooter {
		margin-top: calc($gap * 2);
	}
}
</style>