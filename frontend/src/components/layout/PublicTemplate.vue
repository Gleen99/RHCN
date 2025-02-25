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
    padding-top: $publicMenuHeight;

    .PublicMenu {
        position: fixed;
    
		z-index: 100;
    }

        .content {
            margin: 108px;
		min-height: calc(100vh - $publicMenuHeight - $publicFooterHeight - 3 * $gap);
        @include desktopMax {
            margin: 127px;

            
        }
	}

	.PublicFooter {
		margin-top: calc($gap * 2);
	}
}
</style>