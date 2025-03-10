<script setup lang="ts">
import vResize from "@/directives/resize-directive";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import Box from "@/components/ui/Box.vue";
import IClose from "@/components/images/IClose.vue";

const props = defineProps<{
  title?: string;
  titleSlug?: string;
  closeButton?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { t } = useI18n();

const box = ref<HTMLElement | null>(null);
const flex = ref<boolean>(true);

function onResize() {
  if (box.value) {
    flex.value = box.value.clientHeight <= window.innerHeight;
  }
}

function close() {
  emit("close");
}

const theTitle = computed<string | null>(() => {
  return props.title ? props.title : props.titleSlug ? t(props.titleSlug) : null;
});
</script>

<template>
  <teleport to="#modal-container">
    <div
        class="Modal"
        :class="{ flex, block: !flex }"
        v-resize="onResize"
        @click="close"
        v-bind="$attrs"
    >
      <box class="ModalBox" ref="box" @click.stop>
        <div v-if="theTitle" class="ModalTitle">{{ theTitle }}</div>
        <div class="ModalContent">
          <slot :close="close" />
        </div>
        <template #footer>
          <slot name="footer" :close="close"  class="footer"/>
        </template>
        <div v-if="closeButton" class="close-button" @click="close">
          <IClose class="close-icon" />
        </div>
      </box>
    </div>
  </teleport>
</template>

<style lang="scss">
.Modal {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 15px;

  .ModalBox {
    background-color: white;

    &.Box {
      position: relative;
      padding: 0 0 30px 0;
    }

    .ModalTitle {
      color: $cyellow;
      font-size: 25px;
      font-weight: bold;
      line-height: 1.3em;
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
      padding-bottom: 30px;
      border-bottom: 1px solid $csoft-light-gray;
    }

    .close-button {
      position: absolute;
      top: -26px;
      right: -26px;
      padding: 10px;
      cursor: pointer;

      .close-icon {
        width: 54px;
        height: 55px;
        background-color: $cteal-dark;
        border-radius: 50%;
      }
    }
    .footer {
      padding-top: 30px;
      border-top: 1px solid $csoft-light-gray;
      display: flex;
     gap:30px;
    }

    .controls {
      display:flex;
      align-items: center;
      justify-content: center;
      gap: 30px;
    }
  }

  &.flex {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  &.block {
    overflow: scroll;

    .ModalBox {
      margin: 30px auto;
    }
  }
}
</style>