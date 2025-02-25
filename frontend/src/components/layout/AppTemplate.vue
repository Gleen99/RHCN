<script lang="ts" setup>


</script>

<template>
  <div class="AppTemplate">
  
  </div>
</template>

<style lang="scss">
.AppTemplate {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .Aside {
    flex-shrink: 0;
    padding: 40px;
    overflow-y: scroll; /* Permet le défilement */
    scrollbar-width: none; /* Pour Firefox */
  }

  .container::-webkit-scrollbar {
    display: none; /* Pour Chrome, Safari et Edge */
  }

  .MainWrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .AppMenuWrapper {
      flex-shrink: 0;
      background-color: $cwhite;
    }

    .MainContentWrapper {
      flex-grow: 1;
      overflow-y: auto;
      background-color: $almost-white-blue;

      .MainContent {
        padding: 24px;
        min-height: 100%;

        &.no-padding {
          padding: 0;
        }
      }
    }
  }
}
</style>